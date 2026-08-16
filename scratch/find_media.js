const fs = require("fs");
const path = require("path");

function searchFile(dir, fileName) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = searchFile(fullPath, fileName);
        if (found) return found;
      } else if (entry.name.includes("1786883577838")) {
        return fullPath;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

const baseDir = "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain";
console.log("Searching for media in brain...");
const result = searchFile(baseDir, "1786883577838");
console.log("Result:", result);
