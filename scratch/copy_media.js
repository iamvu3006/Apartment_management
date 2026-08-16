const fs = require("fs");
const path = require("path");

const tempDir = "C:/Users/Admin/.gemini/antigravity-ide/brain/tempmediaStorage";
const targetDir = path.join(__dirname, "../public/rooms/apartment-1");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

try {
  const files = fs.readdirSync(tempDir);
  console.log("Found temp files:", files);
  let count = 1;
  for (const file of files) {
    if (file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".webp") || file.endsWith(".mp4")) {
      const srcPath = path.join(tempDir, file);
      const ext = path.extname(file);
      const destPath = path.join(targetDir, `photo-${count}${ext}`);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} -> photo-${count}${ext}`);
      count++;
    }
  }
} catch (err) {
  console.error("Error reading tempDir:", err);
}
