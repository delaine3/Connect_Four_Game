/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}
const withImages = require('next-images')
module.exports = withImages()