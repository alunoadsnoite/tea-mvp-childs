const { withAppBuildGradle, withProjectBuildGradle } = require("@expo/config-plugins");

// Keep the normal local APK installable. F-Droid builds an unsigned APK and signs it itself.
module.exports = function withFdroidBuild(config) {
  if (process.env.FDROID_BUILD !== "1") return config;
  config = withAppBuildGradle(config, (cfg) => {
    cfg.modResults.contents = cfg.modResults.contents.replace(
      /^\s*signingConfig signingConfigs\.debug\s*$/gm, ""
    );
    return cfg;
  });
  return withProjectBuildGradle(config, (cfg) => {
    // Hermes is enabled: neither of these template-local Maven repositories is used.
    cfg.modResults.contents = cfg.modResults.contents.replace(
      /        maven \{\n            \/\/ (?:All of React Native|Android JSC)[\s\S]*?\n        \}\n/g, ""
    );
    return cfg;
  });
};
