const fs = require("fs");
const path = require("path");

const convDir = "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\30109a89-6f3b-4428-8d75-d1a668b1a5a0";
const targetDir = path.join(__dirname, "../public/rooms/apartment-1");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(convDir);
console.log("Files in conversation dir:", files.filter(f => f.startsWith("media_")));

let count = 1;
const copiedUrls = [];

for (const file of files) {
  if (file.startsWith("media_") && (file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".webp") || file.endsWith(".mp4"))) {
    const srcPath = path.join(convDir, file);
    const ext = path.extname(file);
    const destName = `room-${count}${ext}`;
    const destPath = path.join(targetDir, destName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} -> ${destName}`);
    copiedUrls.push(`/rooms/apartment-1/${destName}`);
    count++;
  }
}

console.log("Copied URLs:", copiedUrls);
