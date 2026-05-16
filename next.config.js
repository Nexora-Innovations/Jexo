/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tr.rbxcdn.com']
  },
  webpack: (config) => {
    // @tabler/icons v1 has a broken exports field that omits the root path,
    // causing webpack 5 to refuse to bundle it. This alias bypasses that by
    // pointing directly to the compiled ESM output.
    config.resolve.alias['@tabler/icons'] = require.resolve(
      '@tabler/icons/icons-react/dist/index.esm.js'
    );
    return config;
  },
}

module.exports = nextConfig