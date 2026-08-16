const fs = require("fs");
const path = require("path");

const convDir = "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\30109a89-6f3b-4428-8d75-d1a668b1a5a0";
const targetDir = path.join(__dirname, "../public/rooms/an-my-7");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(convDir);
const mediaFiles = files.filter((f) => f.startsWith("media_") && (f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".jpeg") || f.endsWith(".webp")));

console.log("Found media files:", mediaFiles);

// Sort by timestamp or mtime to identify newest files
const sorted = mediaFiles.map((f) => {
  const stat = fs.statSync(path.join(convDir, f));
  return { file: f, mtime: stat.mtimeMs };
}).sort((a, b) => b.mtime - a.mtime);

console.log("Sorted newest files:", sorted.slice(0, 5));

const newImages = sorted.slice(0, 5);
const copiedUrls = [];
let count = 1;

for (const item of newImages) {
  const srcPath = path.join(convDir, item.file);
  const ext = path.extname(item.file);
  const destName = `an-my-${count}${ext}`;
  const destPath = path.join(targetDir, destName);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${item.file} -> ${destName}`);
  copiedUrls.push(`/rooms/an-my-7/${destName}`);
  count++;
}

console.log("Copied URLs:", copiedUrls);
