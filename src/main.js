import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { routes } from 'vue-router/auto-routes'

// 引入 Naive UI
import {
  NConfigProvider,
  NMessageProvider,
  create
} from 'naive-ui'

const naive = create({
  components: [NConfigProvider, NMessageProvider]
})

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')