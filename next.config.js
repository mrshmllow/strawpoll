const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    runtime: 'nodejs',
    serverComponents: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build
    // if (!dev && !isServer) {
    //   Object.assign(config.resolve.alias, {
    //     react: 'preact/compat',
    //     'react-dom/test-utils': 'preact/test-utils',
    //     'react-dom': 'preact/compat',
    //   })
    // }

    if (process.env.ANALYZE) {
     config.plugins.push(
       new BundleAnalyzerPlugin({
         analyzerMode: 'server',
         analyzerPort: isServer ? 9999 : 9999,
         openAnalyzer: true,
       })
      )
    }

    return config
  },
}

module.exports = nextConfig
