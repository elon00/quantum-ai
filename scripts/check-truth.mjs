import fs from "node:fs";
const files=["README.md","server.ts"];
const forbidden=[/FIPS 203\/204 compliant ML-KEM/i,/active on-chain tool execution/i,/real-time telemetry, node load balancing \(up to 3,200 TPS\)/i,/Gemini 3\.7 Flash/i];
let failed=false;
for(const file of files){if(!fs.existsSync(file))continue;const t=fs.readFileSync(file,"utf8");for(const rule of forbidden){if(rule.test(t)){console.error(`TRUTH CHECK FAIL: ${file} matches ${rule}`);failed=true}}}
if(failed)process.exit(1);
console.log("TRUTH CHECK PASS");
