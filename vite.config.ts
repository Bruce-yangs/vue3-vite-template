import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
// import styleImport, {
//   ElementPlusResolve,
// } from 'vite-plugin-style-import'

const proxyServer = 'http://172.16.100.12:8888'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      refTransform: true,
    }),
    // styleImport({
    //   resolves: [ElementPlusResolve()]
    // }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      // imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      dts: 'src/auto-import.d.ts',
    }),
    Components({
      // 指定组件位置，默认是src/components
      dirs: ['src/components'],

      extensions: ['vue'],
      // 配置文件生成位置
      dts: 'src/components.d.ts',
      // ui库解析器
      // resolvers: [ElementPlusResolver()],
      resolvers: [
        ElementPlusResolver({
          // importStyle: 'sass',
          // directives: true,
        }),
      ],
      // exclude: [/[\/]node_modules[\/]/, /[\/].git[\/]/, /[\/].nuxt[\/]/],
    }),
  ],
  // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
  base: '/',
  // base: './',
  resolve: {
    alias: {
      // 键必须以斜线开始和结束
      '@': resolve(__dirname, 'src'),
      views: resolve(__dirname, 'src/views'),
      components: resolve(__dirname, 'src/components'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
  css: {
    // 🔥此处添加全局scss🔥
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles/element/index.scss" as *;`
        // additionalData: '@import "./src/element-reset.scss";',
        // additionalData: '@import "./src/variables.scss";',
        //如定义多个全局 写法如下
        // additionalData: '@import "./src/variables.scss"; @import "./src/reset.scss";'
      },
    },
  },
  // webpack-dev-server 相关配置
  server: {
    open: true,
    host: '0.0.0.0',
    port: 8090,
    https: false,
    // http 代理配置
    proxy: {
      // '/api': {
      //   target: proxyServer,
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
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
          "/^\/api/": ""
        }
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
})
