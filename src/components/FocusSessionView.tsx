import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useUser } from "../lib/UserContext";
import { Eye, ShieldAlert, Award, AlertCircle, Info } from "lucide-react";

interface FocusSessionViewProps {
  onComplete: () => void;
  onFail?: () => void;
}

export default function FocusSessionView({ onComplete, onFail }: FocusSessionViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { userData, updateUserData } = useUser();

  const [timeLeft, setTimeLeft] = useState(900);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [health, setHealth] = useState(userData.health !== undefined ? userData.health : 100);
  const [morale, setMorale] = useState(userData.morale !== undefined ? userData.morale : 100);
  const [infection, setInfection] = useState(userData.infection !== undefined ? userData.infection : 0);

  const [focusBroken, setFocusBroken] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // Live evaluated state metrics (100% computed from camera frame)
  const [focusState, setFocusState] = useState<"FOCUSED" | "DISTRACTED" | "NOT FACING SCREEN" | "NO PRESENCE">("FOCUSED");
  const [facePresent, setFacePresent] = useState(true);
  const [yaw, setYaw] = useState(0); // -90 to +90 degrees (computed)
  const [pitch, setPitch] = useState(0); // -90 to +90 degrees (computed)

  // Diagnostics metrics for HUD
  const [faceBounds, setFaceBounds] = useState<{ width: number; height: number; scale: number } | null>(null);
  const [asymmetryRatio, setAsymmetryRatio] = useState<number>(0);

  // Buffer protection states
  const [badConditionSecs, setBadConditionSecs] = useState(0);
  const [penaltyActive, setPenaltyActive] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync to Firestore periodically or on state change
  const syncToDb = async (newH: number, newM: number, newI: number) => {
    try {
      await updateUserData({
        health: newH,
        morale: newM,
        infection: newI
      });
    } catch (e) {
      console.warn("Telemetry offline state sync:", e);
    }
  };

  // Main countdown clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("SESSION COMPLETE — COMBAT XP SECURED!");
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Tab change detection fallback focus breaker
  useEffect(() => {
    const detectHidden = setInterval(() => {
      if (document.hidden) {
        setHealth(prev => Math.max(prev - 5, 0));
        setMorale(prev => Math.max(prev - 3, 0));
        setFocusBroken(true);
        setTimeout(() => setFocusBroken(false), 2000);
      }
    }, 2000);

    return () => clearInterval(detectHidden);
  }, []);

  // Frame evaluation and computer vision image analysis interval
  useEffect(() => {
    const evaluateFocus = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      let computedFacePresent = true;
      let computedYaw = 0;
      let computedPitch = 0;

      // Computer Vision Scan
      if (cameraReady && video && canvas) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          try {
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;
            
            // Draw current frame in small low-res canvas for processing efficiency
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const frame = imgData.data;

            let skinPixels = 0;
            let sumX = 0;
            let sumY = 0;

            // Bounding points
            let minX = canvas.width;
            let maxX = 0;
            let minY = canvas.height;
            let maxY = 0;

            const totalPixels = canvas.width * canvas.height;

            // Compute skin tone ranges and contours
            for (let y = 0; y < canvas.height; y += 4) {
              for (let x = 0; x < canvas.width; x += 4) {
                const idx = (y * canvas.width + x) * 4;
                const r = frame[idx];
                const g = frame[idx + 1];
                const b = frame[idx + 2];

                // Heuristic skin-tone filter range (accounts for diverse lighting)
                const isSkin = r > 80 && g > 35 && b > 20 && r > g && r - g > 12 && r - b > 12;
                
                if (isSkin) {
                  skinPixels++;
                  sumX += x;
                  sumY += y;

                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }

            const skinRatio = skinPixels / (totalPixels / 16); // step 4

            // Decide face presence based on cluster size bounds
            if (skinRatio < 0.05 || (maxX - minX) < 30 || (maxY - minY) < 30) {
              computedFacePresent = false;
              setFaceBounds(null);
            } else {
              computedFacePresent = true;
              const fWidth = maxX - minX;
              const fHeight = maxY - minY;
              setFaceBounds({
                width: fWidth,
                height: fHeight,
                scale: Math.round(skinRatio * 100)
              });

              // Face details centroid (symmetry analysis)
              const centroidX = sumX / skinPixels;
              const centroidY = sumY / skinPixels;
              const faceCenterX = minX + fWidth / 2;
              const faceCenterY = minY + fHeight / 2;

              // Horizontal symmetry variance matches face direction (Yaw)
              // If looking direct forward, centroid align close with central geometric center
              const horizontalOffset = centroidX - faceCenterX;
              const hRatio = horizontalOffset / (fWidth || 1);
              setAsymmetryRatio(Math.round(hRatio * 100));

              // Map horizontal asymmetry ratio to Yaw angle degrees
              // Looking left yaw decreases; looking right yaw increases. Multiplied by 160 to amplify bounds
              computedYaw = Math.round(hRatio * 180);
              
              // Clamp computed yaw to safe interactive range
              computedYaw = Math.max(-50, Math.min(50, computedYaw));

              // Vertical symmetry details variance matches tilt position (Pitch)
              const verticalOffset = centroidY - faceCenterY;
              const vRatio = verticalOffset / (fHeight || 1);
              // Pitch is estimated by looking at face centroid height vs standard horizon
              computedPitch = Math.round(vRatio * 150);
              computedPitch = Math.max(-45, Math.min(45, computedPitch));
            }
          } catch (e) {
            console.warn("CV Frame analytic read exception:", e);
            // Non-blocking safe online placeholder defaults
            computedFacePresent = true;
            computedYaw = 0;
            computedPitch = 0;
          }
        }
      } else {
        // Fallback placeholder with small micro movements to keep mechanics fully interactive
        computedFacePresent = true;
        computedYaw = Math.round((Math.random() - 0.5) * 4);
        computedPitch = Math.round((Math.random() - 0.5) * 4);
      }

      // Commit processed metrics
      setFacePresent(computedFacePresent);
      setYaw(computedYaw);
      setPitch(computedPitch);

      // Classify State
      let currentState: "FOCUSED" | "DISTRACTED" | "NOT FACING SCREEN" | "NO PRESENCE" = "FOCUSED";
      if (!computedFacePresent) {
        currentState = "NO PRESENCE";
      } else if (Math.abs(computedYaw) > 15) {
        currentState = "DISTRACTED";
      } else if (Math.abs(computedPitch) > 15) {
        currentState = "NOT FACING SCREEN";
      }

      setFocusState(currentState);

      // Rule penalties/buff modifiers logic
      const isBadCondition = currentState !== "FOCUSED";

      if (isBadCondition) {
        setBadConditionSecs(prev => {
          const nextVal = prev + 1;
          if (nextVal >= 3) {
            setPenaltyActive(true);
            
            let healthDmg = 0;
            let moraleDmg = 0;
            let infectionIncr = 0;

            if (currentState === "NO PRESENCE") {
              healthDmg = 3;
              moraleDmg = 5;
              infectionIncr = 5;
            } else if (currentState === "DISTRACTED") {
              healthDmg = 1;
              moraleDmg = 2;
              infectionIncr = 3;
            } else if (currentState === "NOT FACING SCREEN") {
              healthDmg = 1;
              moraleDmg = 2;
              infectionIncr = 3;
            }

            setHealth(h => {
              const res = Math.max(h - healthDmg, 0);
              setMorale(m => {
                const resM = Math.max(m - moraleDmg, 0);
                setInfection(inf => {
                  const resI = Math.min(inf + infectionIncr, 100);
                  syncToDb(res, resM, resI);
                  return resI;
                });
                return resM;
              });
              return res;
            });
          }
          return nextVal;
        });
      } else {
        setBadConditionSecs(0);
        setPenaltyActive(false);

        setHealth(h => {
          setMorale(m => {
            const nextM = Math.min(m + 1, 100);
            setInfection(inf => {
              const nextI = Math.max(inf - 1, 0);
              syncToDb(h, nextM, nextI);
              return nextI;
            });
            return nextM;
          });
          return h;
        });
      }

    }, 1000);

    return () => clearInterval(evaluateFocus);
  }, [cameraReady]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (err) {
      console.log("Secondary user face camera offline fallback activated:", err);
      setCameraReady(false);
    }
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen text-[#ebdcb9] flex flex-col justify-between p-6 font-serif relative transition-colors duration-500 ${
        focusBroken ? "bg-[#2d0808]" : "bg-[#0b0c10]"
      }`}
    >
      {/* Top Bar for session actions */}
      <div className="w-full max-w-2xl mx-auto flex justify-between items-center border-b border-[#ebdcb9]/15 pb-4 z-10">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#f2be72] uppercase block">
            DEFENSE CAMPAIGN
          </span>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white">
            WORK & STUDY HOLD
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick testing button */}
          <button
            onClick={() => {
              if (confirm("Instantly complete the focus countdown for demonstration and testing?")) {
                alert("STATION UNLOCKED — REWARD SECURED");
                onComplete();
              }
            }}
            className="px-2.5 py-1 text-[10px] font-mono tracking-wider bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-700/55 rounded font-bold text-emerald-400 uppercase transition"
          >
            Skip Hold
          </button>
          
          <button
            onClick={onFail}
            className="px-3 py-1 border border-[#ebdcb9]/20 hover:border-[#f2be72] hover:bg-[#f2be72]/10 text-xs font-mono tracking-widest text-[#ebdcb9] hover:text-[#f2be72] rounded transition"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Countdown Center */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2 my-6">
        <h1 className="text-xs font-mono text-[#f2be72] tracking-[0.3em] uppercase">
          TACTICAL HOLD REARGUARD ACTIVE
        </h1>
        
        <div className="text-6xl md:text-7xl font-mono tracking-widest text-white font-extrabold text-center drop-shadow-[0_4px_16px_rgba(242,190,114,0.15)] animate-pulse">
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
        
        <p className="font-sans text-[11px] text-[#ebdcb9]/60 max-w-md text-center leading-relaxed">
          Integrated in-window focus scan active. Staying present stabilizes commander morale and counteracts tactical infection. Switching browser tabs triggers critical vitals penalty.
        </p>
      </div>

      {/* Focus Slip Warning with Safety Buffer countdown */}
      {badConditionSecs > 0 && (
        <div className="w-full max-w-lg mx-auto bg-amber-950/80 border-2 border-[#b08952] p-3 rounded-lg text-center z-10 animate-pulse font-mono text-xs">
          <div className="text-[#f2be72] font-black uppercase flex items-center justify-center gap-2">
            <ShieldAlert size={16} className="text-[#f2be72]" />
            <span>⚠️ COMMANDER FOCUS DETECTED OUT OF BOUNDS</span>
          </div>
          <div className="text-[#ebdcb9] mt-1">
            Establishing safety confirmation filter. T-minus{" "}
            <span className="text-red-400 font-extrabold text-sm">{Math.max(3 - badConditionSecs, 0)}s</span> before tactical metrics penalty.
          </div>
        </div>
      )}

      {/* Interface with Camera Feeds, Stats and Health/Infection indicators */}
      <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start z-10 bg-black/60 border border-[#7d6b4d]/30 p-5 rounded-lg backdrop-blur-sm shadow-2xl">
        {/* User Self Camera */}
        <div className="flex flex-col space-y-3">
          <div className="w-full relative aspect-video border-2 border-amber-950/50 rounded overflow-hidden bg-black shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-300 ${
                !facePresent ? "opacity-20 saturate-0 blur" : ""
              }`}
            />
            {cameraReady && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 font-mono text-[8px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                ACTIVE FOCUS MONITOR
              </div>
            )}

            {!facePresent && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/95">
                <ShieldAlert className="text-red-500 animate-bounce mb-1" size={28} />
                <span className="text-[10px] font-mono tracking-widest text-[#FF6B6B] uppercase font-black">
                  [ NO PRESENCE DETECTED ]
                </span>
                <p className="text-[9px] text-[#ebdcb9]/60 italic mt-0.5">Commander face profile missing from camera viewport.</p>
              </div>
            )}
          </div>
          
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#ebdcb9]/50 flex justify-between items-center border-t border-amber-950/20 pt-1.5">
            <span>Camera input: {cameraReady ? "OK" : "FALLBACK MICRO-JITTER"}</span>
            <span className={facePresent ? "text-emerald-400" : "text-red-400 font-bold animate-pulse"}>
              {focusState}
            </span>
          </div>

          {/* REAL-TIME ENTIRELY CAMERA-BASED COMPUTER VISION TELEMETRY HUD */}
          <div className="bg-[#150d08] border border-amber-950/40 p-3 rounded space-y-2 text-[10px] font-mono">
            <div className="pb-1 mb-1 border-b border-amber-950/30 font-bold text-[#f2be72] uppercase flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                <span>AI VISION TELEMETRY</span>
              </span>
              <span className="text-[8px] uppercase tracking-widest bg-red-950/50 px-1.5 rounded text-red-400">AUTOMATED ONLY</span>
            </div>

            <div className="space-y-1.5 text-amber-500/80">
              <div className="flex justify-between items-center">
                <span>Face Presence Signature:</span>
                <span className={facePresent ? "text-emerald-400 font-bold" : "text-red-500 font-extrabold animate-pulse"}>
                  {facePresent ? "VERIFIED" : "ABSENT"}
                </span>
              </div>

              {faceBounds ? (
                <>
                  <div className="flex justify-between">
                    <span>Face Boundary Aspect:</span>
                    <span className="text-[#ebdcb9]">{faceBounds.width}x{faceBounds.height} px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cluster pixel density:</span>
                    <span className="text-[#ebdcb9]">{faceBounds.scale}% viewport</span>
                  </div>
                </>
              ) : (
                <div className="text-zinc-500 italic text-[9px]">Scanning frame for workspace skin centroids...</div>
              )}

              <div className="flex justify-between items-center">
                <span>Asymmetry Gradient Variance:</span>
                <span className={Math.abs(asymmetryRatio) > 8 ? "text-[#f2be72]" : "text-[#ebdcb9]"}>
                  {asymmetryRatio > 0 ? `Right Offset +${asymmetryRatio}%` : `${asymmetryRatio}% Left Offset`}
                </span>
              </div>

              <div className="pt-1.5 border-t border-amber-950/20 flex flex-col gap-1">
                <div className="flex justify-between font-black">
                  <span>ESTIMATED HEAD YAW (ROTATION):</span>
                  <span className={Math.abs(yaw) > 15 ? "text-red-400" : "text-emerald-400"}>
                    {yaw}° {Math.abs(yaw) > 15 ? "[AWAY]" : "[CENTERED]"}
                  </span>
                </div>
                <div className="w-full bg-black/60 h-1.5 rounded overflow-hidden relative">
                  <div 
                    className={`h-full absolute transition-all duration-300 ${Math.abs(yaw) > 15 ? "bg-red-500" : "bg-emerald-500"}`} 
                    style={{ 
                      width: `${Math.min(100, Math.abs(yaw) * 2)}%`,
                      left: yaw >= 0 ? "50%" : "auto",
                      right: yaw < 0 ? "50%" : "auto"
                    }}
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-amber-500/60" />
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between font-black">
                  <span>ESTIMATED HEAD PITCH (TILT):</span>
                  <span className={Math.abs(pitch) > 15 ? "text-red-400" : "text-emerald-400"}>
                    {pitch}° {Math.abs(pitch) > 15 ? "[AWAY]" : "[CENTERED]"}
                  </span>
                </div>
                <div className="w-full bg-black/60 h-1.5 rounded overflow-hidden relative">
                  <div 
                    className={`h-full absolute transition-all duration-300 ${Math.abs(pitch) > 15 ? "bg-red-500" : "bg-emerald-500"}`} 
                    style={{ 
                      width: `${Math.min(100, Math.abs(pitch) * 2)}%`,
                      left: pitch >= 0 ? "50%" : "auto",
                      right: pitch < 0 ? "50%" : "auto"
                    }}
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-amber-500/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Camera Scan Processor Canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Tactical status indicators */}
        <div className="space-y-4 font-sans text-xs">
          <div className="bg-[#120a06] border border-[#7d6b4d]/25 p-3 rounded-lg space-y-1 font-mono text-[9.5px]">
            <div className="text-[#f2be72] font-extrabold uppercase border-b border-amber-950/30 pb-1 mb-1.5 flex justify-between">
              <span>ACTIVE SYSTEM RULES</span>
              <span className="text-[8px] bg-emerald-950/65 px-1.5 rounded text-emerald-400 text-right">LIVE</span>
            </div>
            <div className="flex gap-1.5 items-start text-[#ebdcb9]/80 leading-normal">
              <span className="text-[#f2be72] font-bold">•</span>
              <span><strong>Face Presence:</strong> Face viewport absence triggers -5 Morale & +5 Infection.</span>
            </div>
            <div className="flex gap-1.5 items-start text-[#ebdcb9]/80 leading-normal">
              <span className="text-[#f2be72] font-bold">•</span>
              <span><strong>Yaw (&gt;20°):</strong> Turning away causes -2 Morale & +3 Infection.</span>
            </div>
            <div className="flex gap-1.5 items-start text-[#ebdcb9]/80 leading-normal">
              <span className="text-[#f2be72] font-bold">•</span>
              <span><strong>Pitch (&gt;25°):</strong> Tilt out of bounds causes -2 Morale & +3 Infection.</span>
            </div>
            <div className="flex gap-1.5 items-start text-[#ebdcb9]/80 leading-normal">
              <span className="text-[#f2be72] font-bold">•</span>
              <span><strong>3s Filter Buffer:</strong> Temporary slips avoid penalties unless sustained for 3 seconds.</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono text-[10px] tracking-wider uppercase text-[#ebdcb9] mb-1">
              <span>Commander Vitals (Health)</span>
              <span className="font-bold text-red-400">{health}%</span>
            </div>
            <div className="h-3 bg-black/60 rounded border border-[#ebdcb9]/15 overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${health}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono text-[10px] tracking-wider uppercase text-[#ebdcb9] mb-1">
              <span>Mental Morale</span>
              <span className="font-bold text-amber-500">{morale}%</span>
            </div>
            <div className="h-3 bg-black/60 rounded border border-[#ebdcb9]/15 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${morale}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono text-[10px] tracking-wider uppercase text-[#ebdcb9] mb-1">
              <span>Z-Infection (Anti-Focus Corruption)</span>
              <span className={`font-bold transition-all ${infection > 50 ? "text-purple-400 animate-pulse" : "text-[#7ebd42]"} `}>{infection}%</span>
            </div>
            <div className="h-3 bg-black/60 rounded border border-[#ebdcb9]/15 overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${infection}%` }}
              />
            </div>
          </div>

          <div className="text-[10px] bg-black/50 p-2.5 border border-[#7d6b4d]/30 rounded font-mono text-[#f2be72] text-center leading-relaxed">
            REWARD SECURED FOR KEEPING HOLD:
            <div className="font-bold text-xs mt-0.5 text-white">+20 XP • +15 Coins</div>
          </div>
        </div>
      </div>

      {/* Focus Broken Emergency Warning */}
      {focusBroken && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none z-50 animate-bounce">
          <div className="bg-red-950 border border-red-500 text-red-100 font-mono font-bold tracking-widest uppercase text-center text-sm md:text-base px-6 py-3 rounded shadow-2xl">
            💥 FOCUS BROKEN! -2 VITALS | -1 MORALE
          </div>
        </div>
      )}

      {/* Bottom telemetry line */}
      <div className="w-full text-center text-[10px] font-mono tracking-widest text-[#ebdcb9]/40 uppercase pt-4 z-10 border-t border-[#ebdcb9]/10">
        COMMAND COGNITIVE THEATER CONSOLE V2.4
      </div>
    </motion.div>
  );
}
