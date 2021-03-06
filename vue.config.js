const path = require('path');
const webpack = require('webpack');

const proxy = process.env.DEV_SERVER_PROXY_URL || 'http://localhost:10081';
const port = process.env.DEV_SERVER_PORT || 10080;

module.exports = {
  publicPath: '',
  outputDir: './dist',
  runtimeCompiler: true,
  devServer: {
    port,
    proxy: {
      '^/api': {
        target: proxy,
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.output.library('ycApp').libraryTarget('umd');
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash',
        dayjs: 'dayjs',
        $utils: [path.resolve(__dirname, 'src/utils'), 'default'], // 非工具库的自定义全局变量统一在前面加上$
        $http: [path.resolve(__dirname, 'src/libs/http.js'), 'default']
      })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import '@/styles/variables.scss';`
      }
    }
  },
  pwa: {
    iconPaths: {
      faviconSVG: 'favicon.ico',
      favicon16: 'favicon.ico',
      favicon32: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico',
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'js',
      navigateFallback: '/',
      navigateFallbackBlacklist: [/\/api\//]
    }
  }
};
