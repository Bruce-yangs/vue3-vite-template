import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import store from './store'
import { hasAuthBind } from './utils/auth'
import axios from './utils/request'
import './element-variables.scss'
import router from './router'

import './element-reset.scss'

const app = createApp(App)
//全局挂载
app.config.globalProperties.$axios = axios
app.use(ElementPlus, { locale, size: 'small' })
app.use(store)
app.use(router)
app.directive('has', {
  beforeMount: hasAuthBind
})
app.mount('#app')
