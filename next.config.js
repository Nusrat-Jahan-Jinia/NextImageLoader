/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// const withImages = require("next-images");
// module.exports = nextConfig;
// module.exports = withImages({});
// module.exports = {
//   images: {
//     domains: ["jam.innovatorslab.net", "localhost"],
//   },
// };

const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");
module.exports = nextConfig;
module.exports = withPlugins([
  [
    optimizedImages,
    {
      handleImages: ["jpeg", "png", "svg"],
    },
  ],

  // your other plugins here
]);
