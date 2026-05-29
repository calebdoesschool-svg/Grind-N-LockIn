const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<script type="text/babel"');
const startTagEnd = content.indexOf('>', start) + 1;
const end = content.lastIndexOf('</script>');
const scriptContent = content.substring(startTagEnd, end);

// Need to replace the React global uses with imports since it's going to be in a regular file now
let transformedContent = scriptContent.replace(/\s+const LucideIcon/g, "\nimport React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport * as lucide from 'lucide';\nconst LucideIcon");

// Replace window.lucide with lucide since we imported it
transformedContent = transformedContent.replace(/window\.lucide/g, 'lucide');

fs.writeFileSync('src/main.jsx', transformedContent.trim());

// Also clean up index.html by removing React/Babel CDNs and moving the script to src/main.jsx
let newHtml = content.substring(0, start) + '<script type="module" src="/src/main.jsx"></script>\n' + content.substring(end + 9);
newHtml = newHtml.replace(/<script src="https:\/\/unpkg\.com\/react.*?<\/script>\n/g, '');
newHtml = newHtml.replace(/<script src="https:\/\/unpkg\.com\/@babel.*?<\/script>\n/g, '');
newHtml = newHtml.replace(/<script src="https:\/\/unpkg\.com\/lucide.*?<\/script>\n/g, '');

fs.writeFileSync('index.html', newHtml);
