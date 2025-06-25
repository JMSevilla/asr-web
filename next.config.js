/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  basePath: '',
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  poweredByHeader: false,
  images: {
    domains: process.env.NEXT_PRIVATE_CMS_URL ? [process.env.NEXT_PRIVATE_CMS_URL.split('//')[1]] : undefined,
  },

  eslint: {
    // TODO: ESLint errors needs to be Fixed
    ignoreDuringBuilds: true,
  },

  publicRuntimeConfig: {
    processEnv: {
      ...Object.fromEntries(
        Object.entries(process.env).filter(
          ([key]) => key.includes('NEXT_PRIVATE_') || key.includes('VIDEO_RESOURCES_URL'),
        ),
      ),
      TRUSTED_GBG_ORIGINS: [
        process.env.GBG_URL,
        process.env.NEXT_PRIVATE_GBG_BASE_URL,
        ...(process.env.NODE_ENV === 'development' ? ['https://localhost:3000', 'http://localhost:3000'] : []),
      ].filter(Boolean)
    },
  },

  webpack: config => {
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[contenthash].[ext]',
            publicPath: '_next/static/worker',
            outputPath: 'static/worker',
          },
        },
      ],
    });

    return config;
  },
};
