@import url('https://fonts.googleapis.com/css2?family=Chivo:wght@400;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  /* Font Family */
  --font-display-lg: "Chivo", sans-serif;
  --font-body-lg: "Source Serif 4", serif;
  --font-title-md: "Source Serif 4", serif;
  --font-body-md: "Source Serif 4", serif;
  --font-label-sm: "JetBrains Mono", monospace;
  --font-label-md: "JetBrains Mono", monospace;

  /* Colors */
  --color-surface: #0c141f;
  --color-on-surface: #dbe3f3;
  --color-primary: #f2be72;
  --color-on-primary: #442b00;
  --color-primary-container: #d4a35a;
  --color-on-tertiary-container: #483f2f;
  --color-error-container: #93000a;
  --color-on-error-container: #ffdad6;
  --color-surface-container: #18202c;
  --color-surface-container-high: #222a37;
  --color-surface-container-highest: #2d3542;
  --color-outline: #9c8f7f;
  --color-outline-variant: #4f4538;
  --color-tertiary-fixed-dim: #d2c5b0;

  /* Spacing */
  --spacing-container-padding: 24px;
  --spacing-gutter: 16px;
  --spacing-margin-desktop: 64px;
  --spacing-margin-mobile: 16px;
}

@layer base {
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    background: #181512;
  }
}

#campaignScreen {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #13110f;
  z-index: 9999;
  font-family: serif;
  color: #e7d7b1;
}

#focusCamera {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.32;
  filter: brightness(0.5) sepia(0.35) contrast(1.1);
}

#darkOverlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.82));
}

#campaignTop {
  position: absolute;
  top: 40px;
  width: 100%;
  text-align: center;
  z-index: 2;
}

.campaignTitle {
  font-size: 2rem;
  letter-spacing: 4px;
  font-weight: bold;
}

.campaignSubtitle {
  margin-top: 8px;
  opacity: 0.7;
  font-size: 0.95rem;
}

#campaignCenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

#focusState {
  font-size: 1.6rem;
  padding: 18px 28px;
  border: 1px solid rgba(231, 215, 177, 0.25);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  letter-spacing: 2px;
}

#campaignBottom {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: min(90%, 500px);
  z-index: 2;
}

.statSection {
  margin-top: 18px;
}

.statLabel {
  margin-bottom: 8px;
  font-size: 0.85rem;
  letter-spacing: 2px;
}

.bar {
  width: 100%;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(231, 215, 177, 0.2);
  overflow: hidden;
}

#healthFill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #5e1f1f, #a03f3f);
  transition: 0.8s;
}

#moraleFill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #66512a, #c8a55c);
  transition: 0.8s;
}

#campaignScreen::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("fog.png");
  background-size: cover;
  opacity: 0.06;
  animation: fogMove 30s linear infinite;
}

@keyframes fogMove {
  from { transform: translateX(0); }
  to { transform: translateX(-200px); }
}

.danger #focusState {
  color: #ffb0b0;
  border-color: #aa4444;
}

.danger #focusCamera {
  filter: brightness(0.35) contrast(1.4) saturate(0.5);
}

#campaignTimer{
  margin-top:18px;
  font-size:2.4rem;
  letter-spacing:4px;
  font-weight:bold;
  color:#d8c39a;

  text-shadow:
    0 0 12px rgba(216,195,154,0.35);
}

.hover {
  transition: ease 0.2s;
}

.dangerFlash{
  animation: dangerPulse 0.5s;
}

@keyframes dangerPulse{

  0%{
    background:red;
  }

  100%{
    background:black;
  }

}

.disciplineLockScreen{
  position:fixed;
  inset:0;

  width:100vw;
  height:100vh;

  background:black;

  display:flex;
  justify-content:center;
  align-items:center;

  overflow:hidden;

  z-index:999999;
}

.lockContent{
  width:100%;
  height:100%;

  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;

  padding:5vw;

  box-sizing:border-box;

  text-align:center;

  color:white;

  font-family:serif;
}

.lockTitle{
  font-size:clamp(28px, 7vw, 60px);

  letter-spacing:0.3vw;

  margin-bottom:4vh;
}

.lockSubtitle{
  font-size:clamp(14px, 3vw, 22px);

  opacity:0.7;

  margin-bottom:6vh;

  max-width:85%;
}

.timerDisplay{

  width:100%;

  display:flex;
  justify-content:center;
  align-items:center;

  font-size:clamp(70px, 22vw, 220px);

  font-weight:bold;

  line-height:1;

  letter-spacing:-0.04em;

  text-shadow:
    0 0 30px rgba(255,180,80,0.25);

  word-break:keep-all;
}

.rewardText{
  margin-top:6vh;

  font-size:clamp(14px, 4vw, 28px);

  opacity:0.75;
}

@keyframes pulseFog{

  from{
    opacity:0.4;
  }

  to{
    opacity:0.9;
  }

}

