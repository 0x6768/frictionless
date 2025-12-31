<!-- src/pages/tools/duckduckgo-email-conf.vue -->
<template>
    <n-card class="card-custom" style="max-width: 500px; margin: 0 auto;">
      <template #header>
        <div class="text-center">
          <Icon icon="mdi:cog" class="icon-large"></Icon>
          <h2 class="h4 mb-0">初始配置</h2>
          <p class="mb-0 opacity-75 mt-1">请先配置您的 API 信息</p>
        </div>
      </template>
  
      <n-form-item label="API Token">
        <n-input
          v-model:value="config.apiToken"
          type="password"
          placeholder="输入你的 API Token"
        />
      </n-form-item>
  
      <n-form-item label="服务器选择">
        <n-select
          v-model:value="config.serverType"
          :options="serverOptions"
          @update-value="handleServerChange"
        />
      </n-form-item>
  
      <div v-if="config.serverType === 'custom'" class="mb-3">
        <div class="custom-server-info mb-3">
          <p class="mb-1"><strong>DuckDuckGo代理脚本(Worker版本)：</strong></p>
          <a
            href="https://github.com/0x6768/src/blob/main/ddg-proxy.js"
            target="_blank"
            class="text-decoration-none"
          >https://github.com/0x6768/src/blob/main/ddg-proxy.js</a>
          <p class="mb-1"><strong>DuckDuckGo代理脚本(EdgeOne CORS Anywhere)：</strong></p>
          <a
            href="https://github.com/0x6768/edgeone-cors-anywhere"
            target="_blank"
            class="text-decoration-none"
          >https://github.com/0x6768/edgeone-cors-anywhere</a>
          <p class="mb-0 mt-2"><strong>自定义服务器格式：</strong>https://{你的服务器地址}/api/email/addresses</p>
          <p class="mb-0 mt-2"><strong>EdgeOne CORS Anywhere 自定义服务器格式：</strong>https://{你的服务器地址}/proxy/quack.duckduckgo.com/api/email/addresses</p>
        </div>
  
        <n-form-item label="自定义服务器地址">
          <n-input
            v-model:value="config.customServer"
            placeholder="https://your-proxy.com/api/email/addresses"
          />
        </n-form-item>
      </div>
  
      <n-button
        type="primary"
        block
        :loading="saving"
        @click="saveConfig"
      >
        <template #icon>
          <Icon icon="mdi:content-save"></Icon>
        </template>
        保存配置
      </n-button>
      
      <n-alert v-if="configError" type="error" class="mt-3">
        <Icon icon="mdi:alert-circle" class="me-2"></Icon>
        {{ configError }}
      </n-alert>


  <!-- ... 其他代码保持不变 ... -->
  
  <div class="api-token-help mt-3">
   <br>
    
    <n-alert type="info" class="mb-3">
      <template #icon>
        <Icon icon="mdi:information"></Icon>
      </template>
      <strong>如何获取 API Token：</strong>
      <ol class="mb-0 mt-2">
        <li>登录 DuckDuckGo Email <a href="https://duckduckgo.com/email/settings/autofill" target="_blank">网页版</a></li>
        <li>按 F12 打开浏览器开发者工具</li>
        <li>转到 Network (网络) 标签页</li>
        <li>点击页面中"Generate Private Duck Address"按钮</li>
        <li>在 Network 标签页中找到最近的请求（通常是 <code>/api/email/addresses</code>）</li>
        <li>点击该请求，在 Headers 中找到 <code>Authorization: Bearer xxxxxx</code></li>
        <li><code>xxxxxx</code> 部分就是你的 API Token</li>

      </ol>
      <p>图片指引：<a href="/image_118.png" target="_blank">点击查看</a></p>
    </n-alert>
    
    
  </div>

<!-- <style scoped>
.api-token-help ol,
.api-token-help ul {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.api-token-help li {
  margin-bottom: 0.25rem;
  line-height: 1.4;
}
</style> -->
    </n-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { NCard, NButton, NInput, NSelect, NAlert, NFormItem, useMessage } from 'naive-ui'
  import { Icon } from '@iconify/vue'
  
  const router = useRouter()
  const message = useMessage()
  
  // 存储键
  const STORAGE_KEYS = {
    API_TOKEN: 'ddg_api_token',
    SERVER_TYPE: 'ddg_server_type',
    CUSTOM_SERVER: 'ddg_custom_server',
    CONFIGURED: 'ddg_configured'
  }
  
  // 响应式状态
  const config = ref({
    apiToken: '',
    serverType: 'daffy',
    customServer: ''
  })
  
  const configError = ref('')
  const saving = ref(false)
  
  // 服务器选项
  const serverOptions = [
    { label: '请下拉选择服务器', value: 'daffy', disabled: true },
    { label: '官方服务器', value: 'https://quack.duckduckgo.com/api/email/addresses' },
    { label: '作者代理服务器（Cloudflare Workers）', value: 'https://ddgp.yang751892.eu.org/api/email/addresses' },
    { label: 'EdgeOne CORS Anywhere', value: 'https://cors-anywhere.7003410.xyz/proxy/quack.duckduckgo.com/api/email/addresses' },
    { label: '自定义代理服务器（需自行搭建）', value: 'custom' }
  ]
  
  // 处理服务器选择变化
  function handleServerChange(value) {
    if (value === 'https://quack.duckduckgo.com/api/email/addresses') {
      message.warning("有可能存在CORS和中国大陆网络无法访问的问题")
    } else if (value === 'https://ddgp.yang751892.eu.org/api/email/addresses') {
      message.info("本服务由本人搭建，使用CloudFlare Workers")
    } else if (value === 'custom') {
      message.info("自定义服务器格式：https://{你的服务器地址}/api/email/addresses")
    }
    else if(value === "https://cors-anywhere.7003410.xyz/proxy/quack.duckduckgo.com/api/email/addresses") {
      message.info("EdgeOne CORS Anywhere 代理服务器，也是作者搭建的")
    }
    else{
      message.info("你丫的到底选了什么")
    }
  }
  
  // 保存配置
  async function saveConfig() {
    configError.value = ''
    const token = config.value.apiToken.trim()
    const server = config.value.serverType
  
    if (!token) {
      configError.value = '请输入 API Token'
      return
    }
  
    if (server === 'daffy') {
      message.warning("请选择一个服务器")
      return
    }
  
    if (server === 'custom') {
      const custom = config.value.customServer.trim()
      if (!custom) {
        message.warning("请输入自定义服务器地址")
        return
      }
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SERVER, custom)
    }
  
    saving.value = true
  
    try {
      localStorage.setItem(STORAGE_KEYS.API_TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.SERVER_TYPE, server)
      localStorage.setItem(STORAGE_KEYS.CONFIGURED, 'true')
  
      message.success("配置已保存！")
      
      // 跳转回主页面
      router.push('/tools/duckduckgo-email')
    } catch (error) {
      message.error("保存配置失败")
    } finally {
      saving.value = false
    }
  }
  
  // 初始化
  onMounted(() => {
    // 加载已保存的配置（用于回显）
    const savedToken = localStorage.getItem(STORAGE_KEYS.API_TOKEN)
    const savedServer = localStorage.getItem(STORAGE_KEYS.SERVER_TYPE)
    const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_SERVER)
  
    if (savedToken) config.value.apiToken = savedToken
    if (savedServer && savedServer !== 'daffy') config.value.serverType = savedServer
    if (savedCustom) config.value.customServer = savedCustom
  })
  </script>
  
  <style scoped>
  .card-custom {
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .icon-large {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .custom-server-info {
    background-color: #e7f1ff;
    border-radius: 8px;
    padding: 12px;
    font-size: 0.875rem;
  }
  .api-token-help ol,
.api-token-help ul {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.api-token-help li {
  margin-bottom: 0.25rem;
  line-height: 1.4;
}
/*  设置a标签 颜色 */
.api-token-help a {
  color: #007bff;
  text-decoration: none;
}

.api-token-help a:hover {
  text-decoration: underline;
}
  </style>