import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const proxyServer = 'http://172.16.100.12:8888'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
  base: '/',
  // base: './',
  resolve: {
    alias: {
      // 键必须以斜线开始和结束
      '@': resolve(__dirname, 'src'),
      views: resolve(__dirname, 'src/views'),
      components: resolve(__dirname, 'src/components'),
      utils: resolve(__dirname, 'src/utils')
    }
  },
  css: {
    // 🔥此处添加全局scss🔥
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/variables.scss";'
        //如定义多个全局 写法如下
        // additionalData: '@import "./src/variables.scss"; @import "./src/reset.scss";'
      }
    }
  },
  // webpack-dev-server 相关配置
  server: {
    open: true,
    host: 'localhost',
    port: 8090,
    https: false,
    // http 代理配置
    proxy: {
      // "/api": {
      //   target: "http://172.16.100.30:80",
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/api/, '')
      // },
      // "/Tiles": {
      //   target: "http://172.16.100.34:80",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/Tiles": "/Tiles"
      //   }
      // },
      // "/bimTiles": {
      //   target: "http://172.16.100.34:80",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/bimTiles": "/bimTiles"
      //   }
      // },
      // "/czml": {
      //   target: "http://172.16.100.34:80",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/czml": "/czml"
      //   }
      // },
      // "/gltf": {
      //   target: "http://172.16.100.34:80",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/gltf": "/gltf"
      //   }
      // },
      // "/index": {
      //   target: "http://172.16.100.34:8888",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/index": "/index"
      //   }
      // },
      // "/geoserver/": {
      //   target: proxyGeoServer,
      //   changeOrigin: true,
      //   ws: true,
      //   secure: false
      // },
      '/api': {
        target: proxyServer,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
