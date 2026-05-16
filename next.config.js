/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tr.rbxcdn.com']
  },
  webpack: (config) => {
    // @tabler/icons v1 exports field maps `./*` to `./icons/*` (SVG files),
    // so any subpath import gets redirected to a non-existent location.
    // path.resolve bypasses the exports field entirely and points webpack
    // directly at the compiled React components.
    config.resolve.alias['@tabler/icons'] = path.resolve(
      __dirname,
      'node_modules/@tabler/icons/icons-react/dist/index.esm.js'
    );
    return config;
  },
}

module.exports = nextConfig