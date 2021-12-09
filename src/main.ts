import { createApp } from 'vue'
// import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import store from './store'
import { hasAuthBind } from './utils/auth'
import axios from './utils/request'
// import 'element-plus/es/components/message/style/css.css'

// import './element-variables.scss'
import 'element-plus/es/components/message/style/css'

import './element-reset.scss'

import router from './router'


const app = createApp(App)
//全局挂载
app.config.globalProperties.$axios = axios
// app.use(ElementPlus, { /* locale: zhCn, size: 'small'  */})
app.use(store)
app.use(router)
app.directive('has', {
  beforeMount: hasAuthBind
})
app.mount('#app')
