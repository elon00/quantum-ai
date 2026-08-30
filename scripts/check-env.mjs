import fs from "node:fs";
if(!fs.existsSync(".gitignore")){console.error("ENV CHECK FAIL: .gitignore missing");process.exit(1)}
const text=fs.readFileSync(".gitignore","utf8");
if(!text.includes(".env*")){console.error("ENV CHECK FAIL: .env* is not protected");process.exit(1)}
console.log("ENV CHECK PASS");
