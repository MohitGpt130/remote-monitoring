var replace = require("replace-in-file");
var fs = require("fs");
// process.argv[2]
const moment = require("moment-timezone");
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const deployments = JSON.parse(fs.readFileSync('deployments.json', 'utf-8'));

var timestamp = new Date().toISOString();
var timestampInTimezone = moment(timestamp).tz("Asia/Kolkata").format("MM/DD/YYYY hh:mm:ss A z");

const changes = [];
let options = {
  files: [
    "src/environments/environment.ts",
    "src/environments/environment.prod.ts",
  ],
  from: /timestamp: '(.*)'/g,
  to: "timestamp: '" + timestamp + "'",
  allowEmptyPaths: false,
};
changes.push(options);
options = {
  files: [
    "src/environments/environment.ts",
    "src/environments/environment.prod.ts",
  ],
  from: /version: '(.*)'/g,
  to: "version: '" + packageJson.version + "'",
  allowEmptyPaths: false,
};
changes.push(options);
options = {
  files: [
    "src/environments/environment.ts",
    "src/environments/environment.prod.ts",
  ],
  from: /title: '(.*)'/g,
  to: "title: '" + packageJson.title + "'",
  allowEmptyPaths: false,
};
options = {
  files: [
    "src/environments/environment.ts",
  ],
  from: /apiServer: '(.*)'/g,
  to: "apiServer: '" + packageJson.title + "'",
  allowEmptyPaths: false,
};
changes.push(options);
try {
  changes.forEach(element => {
    let changedFiles = replace.sync(element);
    if (changedFiles == 0) {
      throw (
        "Please make sure that the file '" +
        options.files +
        "' has \"timestamp: ''\""
      );
    }
  });
  console.log("Build timestamp is set to: " + timestampInTimezone);
} catch (error) {
  console.error("Error occurred:", error);
  throw error;
}
