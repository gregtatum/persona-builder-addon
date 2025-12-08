module.exports = {
  sourceDir: ".",
  artifactsDir: "dist",
  ignoreFiles: [
    "node_modules/**",
    "dist/**",
    ".git/**"
  ],
  browserConsole: true,
  keepProfileChanges: true,
  // Set to null to use default Firefox, or adjust to "firefoxdeveloperedition" / "firefoxnightly".
  firefox: null
};
