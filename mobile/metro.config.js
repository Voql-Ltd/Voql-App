
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);

// config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
// config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
// config.resolver.sourceExts.push('svg');

// module.exports = withNativeWind(config, { input: './styles/global.css' });

// // @ts-nocheck
// // metro.config.js
// const {getDefaultConfig} = require("expo/metro-config");
// const {withNativeWind} = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// // Configure SVG transformer
// const transformer = {
//   ...config.transformer,
//   babelTransformerPath: require.resolve("react-native-svg-transformer"),
// };


// Configure SVG transformer
const transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

const resolver = {
  ...config.resolver,
  // Support SVG imports
  assetExts: (config.resolver?.assetExts ?? []).filter((ext) => ext !== "svg"),
  sourceExts: [...(config.resolver?.sourceExts ?? []), "svg"],
  // Mirror tsconfig.json baseUrl/paths so Metro can resolve "@/..." aliases
  alias: {
    ...(config.resolver?.alias ?? {}),
    "@": __dirname,
    "buffer": require.resolve("buffer/"),
  },
};

module.exports = withNativeWind(
  {
    ...config,
    transformer,
    resolver,
  },
  {input: "./styles/global.css"}
);
