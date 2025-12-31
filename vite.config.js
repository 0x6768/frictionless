import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // 构建相关的配置
  build: {
    // 指定构建输出目录
    outDir: 'dist', // 主输出目录，默认是 'dist'
    
    // 指定静态资源目录（相对于 outDir）
    assetsDir: '_vue', // 静态资源放在 dist/_vue 目录
    
    // 清空输出目录
    emptyOutDir: true,
    
    // 资源基础路径
    base: '/', // 可以是 './'、'/your-base/' 或 CDN 地址
    
    // 自定义 rollup 输出配置

  }
})