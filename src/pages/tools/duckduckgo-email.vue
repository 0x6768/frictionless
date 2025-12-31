特别是这个非常独特的工具
<!-- src/pages/tools/duckduckgo-email.vue -->
<template>
  <n-card class="card-custom" style="max-width: 500px; margin: 0 auto;">
    <template #header>
      <div class="position-relative text-center">
       
        <Icon icon="mdi:email" class="icon-large"></Icon>
        <h2 class="h4 mb-0">隐私邮箱生成器</h2>
        <p class="mb-0 opacity-75 mt-1">DuckDuckGo 隐私保护邮箱</p>
      </div>
      <n-button
          class="me-1"
          text
          @click="showReconfigureModal = true"
        >
          <Icon icon="ic:baseline-create"></Icon>重新配置
        </n-button>
    </template>

    <n-button
      type="primary"
      block
      size="large"
      :loading="generating"
      @click="generateEmail"
    >
      <template #icon>
        <Icon icon="mdi:email-plus"></Icon>
      </template>
      生成隐私邮箱
    </n-button>

    <div v-if="emailResult" class="mt-4">
      <n-form-item label="生成的邮箱地址">
        <n-input-group>
          <n-input v-model:value="emailResult" readonly />
          <n-button @click="copyToClipboard" :disabled="!emailResult">
            <Icon icon="mdi:content-copy"></Icon>
          </n-button>
        </n-input-group>
      </n-form-item>
    </div>

    <n-alert v-if="error" type="error" class="mt-3">
      <Icon icon="mdi:alert-circle" class="me-2"></Icon>
      {{ error }}
    </n-alert>

    <div class="mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h5 mb-0">
          <Icon icon="mdi:history" class="me-2"></Icon> 历史记录
        </h3>
        <n-button
          v-if="history.length > 0"
          size="small"
          text
          @click="clearHistory"
          class="text-muted"
        >
          <Icon icon="mdi:trash-can-outline" class="me-1"></Icon>
          清空
        </n-button>
      </div>
      
      <n-list v-if="history.length > 0" bordered class="history-list">
        <n-list-item v-for="(item, index) in history" :key="index">
          <template #prefix>
            <div class="history-icon">
              <Icon icon="mdi:email-outline" />
            </div>
          </template>
          
          <div class="history-content">
            <div class="email-address font-monospace">{{ item.email }}</div>
            <div class="timestamp text-muted">{{ item.timestamp }}</div>
          </div>
          
          <template #suffix>
            <n-button-group size="small">
              <n-button
                type="primary"
                ghost
                @click="copyHistoryEmail(item.email)"
              >
                <Icon icon="mdi:content-copy" class="me-1"></Icon>
                复制
              </n-button>
              <n-button
                type="error"
                ghost
                @click="deleteHistoryItem(index)"
              >
                <Icon icon="mdi:delete-outline" />
              </n-button>
            </n-button-group>
          </template>
        </n-list-item>
      </n-list>

      <div v-else class="empty-state">
        <n-empty description="暂无历史记录">
          <template #icon>
            <Icon icon="mdi:inbox-outline" />
          </template>
          <template #extra>
            <n-text depth="3" class="small">
              生成的隐私邮箱将显示在这里
            </n-text>
          </template>
        </n-empty>
      </div>
    </div>
  </n-card>

  <!-- 重新配置模态框 -->
  <n-modal v-model:show="showReconfigureModal" preset="dialog" title="重新配置">
    <template #header>
      <div>
      
        重新配置
      </div>
    </template>
    <p>确定要重新配置API设置吗？这将清除当前的配置信息。</p>
    <n-alert type="warning" class="mt-2">

      历史记录将保留，但需要重新配置API才能继续生成邮箱。
    </n-alert>
    <template #action>
      <n-button @click="showReconfigureModal = false">取消</n-button>
      <n-button type="warning" @click="reconfigure">确认重新配置</n-button>
    </template>
  </n-modal>

  <!-- 清空历史确认模态框 -->
  <n-modal v-model:show="showClearConfirm" preset="dialog" title="清空历史记录">
    <template #header>
      <div>
        确认清空
      </div>
    </template>
    <p>确定要清空所有历史记录吗？此操作不可撤销。</p>
    <template #action>
      <n-button @click="showClearConfirm = false">取消</n-button>
      <n-button type="error" @click="confirmClearHistory">确认清空</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard,
  NButton,
  NInput,
  NInputGroup,
  NFormItem,
  NAlert,
  NModal,
  NList,
  NListItem,
  NButtonGroup,
  NEmpty,
  NText,
  useMessage
} from 'naive-ui'
import { Icon } from '@iconify/vue'

const router = useRouter()
const message = useMessage()

// 存储键
const STORAGE_KEYS = {
  API_TOKEN: 'ddg_api_token',
  SERVER_TYPE: 'ddg_server_type',
  CUSTOM_SERVER: 'ddg_custom_server',
  CONFIGURED: 'ddg_configured',
  HISTORY: 'ddg_email_history'
}

// 响应式状态
const emailResult = ref('')
const error = ref('')
const generating = ref(false)
const showReconfigureModal = ref(false)
const showClearConfirm = ref(false)
const history = ref([])

// 检查配置状态
function checkConfiguration() {
  const isConfigured = localStorage.getItem(STORAGE_KEYS.CONFIGURED) === 'true'
  const apiToken = localStorage.getItem(STORAGE_KEYS.API_TOKEN)
  const serverType = localStorage.getItem(STORAGE_KEYS.SERVER_TYPE)
  
  if (!isConfigured || !apiToken || !serverType || serverType === 'daffy') {
    router.push('/tools/duckduckgo-email-configure')
    return false
  }
  return true
}

// 加载历史记录
function loadHistory() {
  const saved = localStorage.getItem(STORAGE_KEYS.HISTORY)
  history.value = saved ? JSON.parse(saved) : []
}

// 保存历史
function addToHistory(email) {
  const list = [{ 
    email, 
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }, ...history.value]
  
  history.value = list.slice(0, 20) // 增加到20条记录
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.value))
}

// 删除单条历史记录
function deleteHistoryItem(index) {
  history.value.splice(index, 1)
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.value))
  message.success('记录已删除')
}

// 清空历史记录
function clearHistory() {
  showClearConfirm.value = true
}

function confirmClearHistory() {
  history.value = []
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]))
  showClearConfirm.value = false
  message.success('历史记录已清空')
}

// 生成邮箱
async function generateEmail() {
  if (!checkConfiguration()) return
  
  emailResult.value = ''
  error.value = ''
  generating.value = true

  message.info("正在生成隐私邮箱...")

  const token = localStorage.getItem(STORAGE_KEYS.API_TOKEN)
  let baseUrl = localStorage.getItem(STORAGE_KEYS.SERVER_TYPE)

  if (baseUrl === 'custom') {
    baseUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_SERVER)
  }

  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    if (!data.address) throw new Error('无效响应')

    const email = `${data.address}@duck.com`
    emailResult.value = email
    addToHistory(email)

    message.success("邮箱已生成！")
  } catch (err) {
    error.value = `请求失败: ${err.message}`
    message.error(`生成失败: ${err.message}`)
  } finally {
    generating.value = false
  }
}

// 复制到剪贴板
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(emailResult.value)
    message.success("已复制到剪贴板！")
  } catch (err) {
    message.error("复制失败")
  }
}

async function copyHistoryEmail(email) {
  try {
    await navigator.clipboard.writeText(email)
    message.success("已复制到剪贴板！")
  } catch (err) {
    message.error("复制失败")
  }
}

// 重新配置
function reconfigure() {
  localStorage.removeItem(STORAGE_KEYS.API_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.SERVER_TYPE)
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_SERVER)
  localStorage.setItem(STORAGE_KEYS.CONFIGURED, 'false')

  showReconfigureModal.value = false
  router.push('/tools/duckduckgo-email-configure')
  message.info("配置已重置，请重新配置")
}

// 初始化
onMounted(() => {
  if (!checkConfiguration()) return
  loadHistory()
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

.history-list {
  border-radius: 8px;
  overflow: hidden;
}

.history-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f0f7ff;
  border-radius: 50%;
  color: #1890ff;
}

.history-content {
  flex: 1;
  min-width: 0;
}

.email-address {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
  word-break: break-all;
}

.timestamp {
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.font-monospace {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.text-muted {
  color: #6c757d !important;
}

.small {
  font-size: 0.875em;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}
</style>