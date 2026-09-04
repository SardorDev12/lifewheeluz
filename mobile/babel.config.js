// babel-preset-expo auto-detects react-native-worklets (installed for
// react-native-reanimated) and wires its babel plugin itself — no manual
// plugins array needed here.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
