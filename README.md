# 🔧 Frictionless Tools

[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646cff?logo=vite)](https://vitejs.dev/)
[![Naive UI](https://img.shields.io/badge/Naive_UI-2.43-4fc08d)](https://www.naiveui.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Netlify Status](https://img.shields.io/netlify/your-app-id)](https://app.netlify.com/sites/your-site/deploys)


> 让工具回归工具，让你成为你

一个专注于解决实际问题的极简工具集合。无广告、无追踪、无干扰。

---

## ✨ 特性

- 🚀 **极速加载** - 每个工具独立页面，秒开即用
- 🎨 **简洁设计** - 基于 Naive UI，自动明暗主题
- 📱 **全端响应** - 手机/平板/电脑完美适配
- ⚡️ **现代技术栈** - Vue 3 + Vite + 文件系统路由
- 🔧 **开箱即用** - 无需登录配置，打开就用
- 🔐 **隐私优先** - 所有工具在浏览器本地运行

## 🛠️ 工具列表

### 🌐 网络工具
- https://tools.frictionless.cc/tools/cloudflare-dns-batch-delete - 批量管理 Cloudflare DNS 记录
- https://tools.frictionless.cc/tools/duckduckgo-email - 快速生成匿名邮箱

### 💻 开发工具
- https://tools.frictionless.cc/tools/unix-chmod - 八进制与符号权限互转
- #

---

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/yourname/frictionless.git
cd frictionless

# 安装依赖（推荐 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📁 项目结构

```
src/
├── pages/           # 所有页面（文件即路由）
│   ├── tools/       # 工具页面
│   │   ├── cloudflare-dns-batch-delete.vue
│   │   ├── duckduckgo-email.vue
│   │   └── unix-chmod.vue
│   ├── index.vue    # 首页
│   └── about.vue    # 关于页
├── assets/          # 静态资源
│   ├── base.css     # 基础样式
│   └── main.css     # 全局样式
└── main.js          # 应用入口
```

## 🧩 添加新工具

1. 在 `src/pages/tools/` 创建 `.vue` 文件，如 `new-tool.vue`
2. 自动路由到 `/tools/new-tool`
3. 工具会在首页自动列出（或手动添加到导航）

```vue
<template>
  <!-- 你的工具界面 -->
</template>

<script setup>
// 纯 JavaScript，无 TypeScript
// 保持逻辑简洁专注
</script>

<style scoped>
/* 组件样式 */
</style>
```

## 🤔 为什么选择这个技术栈？

- **Vue 3** - 渐进式框架，上手简单
- **Vite** - 极速的开发体验
- **Naive UI** - 组件齐全，设计优雅
- **文件系统路由** - 零配置路由
- **纯 JavaScript** - 避免过度工程化
- **Netlify** - 自动部署，全球 CDN

## 🤝 贡献

欢迎贡献新工具或改进现有工具！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feat/awesome-tool`)
3. 提交更改 (`git commit -m 'feat: add awesome tool'`)
4. 推送分支 (`git push origin feat/awesome-tool`)
5. 创建 Pull Request

## 📄 许可

MIT © LICENSE 文件

---

## 🌟 Star 历史


[![Vue Star History Chart](https://api.star-history.com/svg?repos=0x6768/frictionless&type=Date)](ttps://star-history.com/#yourname/frictionless&Date)
