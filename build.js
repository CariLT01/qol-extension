// build.js
console.log("🔨 Building and bundling everything...");

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const archiver = require("archiver");

// “projectRoot” is always the folder where build.js resides
const projectRoot = path.resolve(__dirname);

// Helper: exit showing projectRoot (not process.cwd())
function exitWithError(message) {
  console.error(`❌ ${message}`);
  console.error(`   Project root: ${projectRoot}`);
  process.exit(1);
}

// 1. Read version from package.json
const pkgPath = path.join(projectRoot, "package.json");
if (!fs.existsSync(pkgPath)) {
  exitWithError(`Cannot find package.json at "${pkgPath}".`);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
} catch (e) {
  exitWithError(`Failed to read/parse package.json at "${pkgPath}": ${e.message}`);
}

const version = pkg.version;
if (!version) {
  exitWithError(`No "version" field in package.json (path: "${pkgPath}").`);
}

// 2. Update extension/manifest.json version
const manifestPath = path.join(projectRoot, "extension", "manifest.json");
if (!fs.existsSync(manifestPath)) {
  exitWithError(`Cannot find extension/manifest.json at "${manifestPath}".`);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (e) {
  exitWithError(`Failed to read/parse manifest.json at "${manifestPath}": ${e.message}`);
}

manifest.version = version;
try {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
} catch (e) {
  exitWithError(`Failed to write updated manifest.json to "${manifestPath}": ${e.message}`);
}
console.log(`🔧 Updated manifest.json → version ${version} (path: "${manifestPath}")`);

// 3. Run webpack to bundle (always from projectRoot)
console.log("📦 Running “npx webpack” ...");
try {
  execSync("npx webpack", { stdio: "inherit", cwd: projectRoot });
} catch (err) {
  exitWithError(`“npx webpack” failed. Make sure webpack is installed and your config is valid.`);
}

// 4. Zip up the entire “extension” folder
const extensionDir = path.join(projectRoot, "extension");
if (!fs.existsSync(extensionDir) || !fs.statSync(extensionDir).isDirectory()) {
  exitWithError(`"extension" folder not found or is not a directory at "${extensionDir}".`);
}

const outputFilename = `qol-extension@${version}.zip`;
const outputPath = path.join(projectRoot, outputFilename);
const output = fs.createWriteStream(outputPath);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`✅ Created ${outputFilename} (${(archive.pointer() / 1024).toFixed(1)} KB) at "${outputPath}"`);
});

archive.on("error", (err) => {
  exitWithError(`Archiving failed: ${err.message}`);
});

// Archive everything inside “extension/” (no parent folder)
archive.pipe(output);
archive.directory(extensionDir, false);
archive.finalize();

console.log("✅ Done!");
