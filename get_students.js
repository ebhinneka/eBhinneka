const fs = require('fs');
const execSync = require('child_process').execSync;
try {
  const output = execSync('grep -rn "from(\'students\')" pages/').toString();
  console.log(output);
} catch (e) {
  console.error(e.stdout.toString());
}
