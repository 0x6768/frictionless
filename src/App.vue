<template>
  <n-config-provider>
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-modal-provider>
            <n-layout
              has-sider
              class="app-layout"
              :style="{ '--sidebar-width': sidebarWidth }"
            >
              <!-- 侧边栏 -->
              <n-layout-sider
                bordered
                collapse-mode="width"
                :collapsed-width="64"
                :width="240"
                :collapsed="collapsed"
                show-trigger
                @collapse="collapsed = true"
                @expand="collapsed = false"
                class="sidebar"
              >
                <!-- Logo 区域 -->
                <div class="logo-area">
                  <router-link to="/" class="logo-link">
                    <n-space align="center" justify="center">
                      <n-icon size="28" color="#18a058">
                        <Icon icon="mdi:pipe-wrench" />
                      </n-icon>
                      <n-text v-if="!collapsed" strong class="logo-text">
                        Frictionless
                      </n-text>
                    </n-space>
                  </router-link>
                </div>

                <!-- 导航菜单 -->
                <n-menu
                  :collapsed="collapsed"
                  :collapsed-width="64"
                  :collapsed-icon-size="22"
                  :options="menuOptions"
                  :value="currentMenuKey"
                  :default-expanded-keys="defaultExpandedKeys"
                  @update:value="handleMenuSelect"
                />
              </n-layout-sider>

              <!-- 主内容区域 -->
              <n-layout>
                <!-- 顶部栏 -->
                <n-layout-header bordered class="header">
                  <div class="header-content">
                    <n-button text @click="toggleSidebar" class="sidebar-toggle">
                      <template #icon>
                        <n-icon>
                          <Icon :icon="collapsed ? 'mdi:menu' : 'mdi:backburger'" />
                        </n-icon>
                      </template>
                    </n-button>
                  </div>
                </n-layout-header>

                <!-- 页面内容 -->
                <n-layout-content content-style="padding: 24px;" class="main-content">
                  <router-view />
                </n-layout-content>

                <!-- 底部 -->
                <n-layout-footer bordered class="footer">
                  <div class="footer-content">
                    <n-text depth="3"> Built with 💻 and ☕ by 晓正杨 </n-text>
                  </div>
                </n-layout-footer>
              </n-layout>
            </n-layout>
          </n-modal-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

// 按需引入 Naive UI 组件
import {
  NConfigProvider,
  NMessageProvider,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NSpace,
  NIcon,
  NText,
  NMenu,
  NButton,
  NLoadingBarProvider,
  NDialogProvider,
  NModalProvider
} from 'naive-ui'

const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const collapsed = ref(false)

// 默认展开的菜单项
const defaultExpandedKeys = ref(['tools'])

// 计算侧边栏宽度（用于 CSS 变量）
const sidebarWidth = computed(() => collapsed.value ? '64px' : '240px')

// 切换侧边栏
const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

// 菜单配置
const menuOptions = [
  {
    label: '首页',
    key: '/',
    icon: () => h(Icon, { icon: 'mdi:home' })
  },
  {
    label: '工具',
    key: 'tools-group', // 父菜单使用不同的 key
    icon: () => h(Icon, { icon: 'mdi:tools' }),
    children: [
      {
        label: 'DuckDuckGo 隐私邮件',
        key: '/tools/duckduckgo-email',
        icon: () => h(Icon, { icon: 'mdi:email' })
      },
      {
        label: 'Unix 权限计算器',
        key: '/tools/unix-chmod',
        icon: () => h(Icon, { icon: 'mdi:lock-outline' })
      },
      {
        label: 'Cloudflare DNS 批量删除',
        key: '/tools/cloudflare-dns-batch-delete',
        icon: () => h(Icon, { icon: 'mdi:cloud' })
      }
    ]
  },
  {
    label: '关于',
    key: '/about',
    icon: () => h(Icon, { icon: 'mdi:information' })
  }
]

// 当前选中的菜单项 - 精确匹配子页面
const currentMenuKey = computed(() => {
  return route.path
})

// 菜单选择处理
const handleMenuSelect = (key) => {
  // 如果是父菜单，不跳转，只展开/折叠
  if (key === 'tools-group') {
    // 切换展开状态
    const index = defaultExpandedKeys.value.indexOf('tools-group')
    if (index > -1) {
      defaultExpandedKeys.value.splice(index, 1)
    } else {
      defaultExpandedKeys.value.push('tools-group')
    }
    return
  }
  
  // 跳转到对应的路由
  router.push(key)
}

// 监听路由变化，确保父菜单展开
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/tools')) {
    // 如果访问工具相关页面，确保工具菜单是展开的
    if (!defaultExpandedKeys.value.includes('tools-group')) {
      defaultExpandedKeys.value.push('tools-group')
    }
  }
}, { immediate: true })
</script>

<style scoped>
.app-layout {
  height: 100vh;
}

.logo-area {
  padding: 20px 16px;
  border-bottom: 1px solid var(--n-border-color);
}

.logo-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.logo-text {
  font-size: 18px;
  color: #18a058;
}

.header {
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.sidebar-toggle {
  font-size: 20px;
}

.main-content {
  min-height: calc(100vh - 120px); /* 减去头部和底部高度 */
  overflow-y: auto;
}

.footer {
  padding: 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  text-align: center;
}
</style>