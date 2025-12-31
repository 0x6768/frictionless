<template>
  <div class="toolbox-home">
    <!-- 欢迎区域 -->
    <n-card class="welcome-section" :bordered="false">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1 class="welcome-title">欢迎使用 Frictionless</h1>
          <p class="welcome-subtitle">让工具回归工具，让你成为你</p>
          <p class="welcome-desc">一个专注于解决实际问题的小工具集合</p>
        </div>
        <div class="welcome-icon">
          <Icon icon="mdi:pipe-wrench" width="80" height="80" />
        </div>
      </div>
    </n-card>

    <!-- 搜索和过滤区域 -->
    <n-card class="search-section" :bordered="false">
      <div class="search-content">
        <n-input
          v-model:value="searchQuery"
          placeholder="搜索工具..."
          size="large"
          round
          clearable
        >
          <template #prefix>
            <Icon icon="mdi:magnify" />
          </template>
        </n-input>
        <n-space v-if="selectedCategory !== 'all'" class="category-tags">
          <n-tag
            v-for="category in categories"
            :key="category.id"
            :type="selectedCategory === category.id ? 'primary' : 'default'"
            round
            @click="selectCategory(category.id)"
          >
            <template #icon>
              <Icon :icon="category.icon" />
            </template>
            {{ category.name }}
          </n-tag>
        </n-space>
      </div>
    </n-card>

    <!-- 工具展示区域 -->
    <div class="tools-section">
      <h2 class="section-title">可用的工具</h2>
      <p class="section-subtitle">共 {{ filteredTools.length }} 个工具可用</p>
      
      <div v-if="filteredTools.length === 0" class="no-results">
        <n-empty description="没有找到相关工具">
          <template #icon>
            <Icon icon="mdi:toolbox-remove" width="60" />
          </template>
        </n-empty>
      </div>

      <div class="tools-grid">
        <n-card
          v-for="tool in filteredTools"
          :key="tool.key"
          class="tool-card"
          hoverable
          :title="tool.label"
          @click="navigateToTool(tool.key)"
        >
          <template #header-extra>
            <n-tag :type="getCategoryType(tool.category)" size="small" round>
              {{ getCategoryName(tool.category) }}
            </n-tag>
          </template>
          
          <div class="tool-content">
            <div class="tool-icon">
              <Icon :icon="tool.icon" width="40" height="40" />
            </div>
            <div class="tool-info">
              <p class="tool-description">{{ tool.description }}</p>
              <div class="tool-features">
                <n-space size="small">
                  <n-tag
                    v-for="tag in tool.tags"
                    :key="tag"
                    size="tiny"
                    :bordered="false"
                  >
                    {{ tag }}
                  </n-tag>
                </n-space>
              </div>
            </div>
          </div>
          
          <template #action>
            <div class="tool-actions">
              <n-button text type="primary" @click.stop="navigateToTool(tool.key)">
                <template #icon>
                  <Icon icon="mdi:arrow-right" />
                </template>
                开始使用
              </n-button>
            </div>
          </template>
        </n-card>
      </div>
    </div>

    <!-- 快速使用提示 -->
    <n-card class="quick-tips" :bordered="false">
      <div class="tips-content">
        <div class="tip-item">
          <Icon icon="mdi:keyboard" width="30" />
          <h3>键盘快捷键</h3>
          <p>使用 Ctrl + K 快速搜索工具</p>
        </div>
        <div class="tip-item">
          <Icon icon="mdi:history" width="30" />
          <h3>最近使用</h3>
          <p>您最常用的工具会显示在顶部</p>
        </div>
        <div class="tip-item">
          <Icon icon="mdi:bookmark" width="30" />
          <h3>收藏功能</h3>
          <p>点击工具卡片右上角收藏常用工具</p>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NCard, 
  NAlert, 
  NButton, 
  NModal,
  NInput,
  NTag,
  NSpace,
  NEmpty
} from 'naive-ui'
import { Icon } from '@iconify/vue'

const router = useRouter()

// 搜索和过滤
const searchQuery = ref('')
const selectedCategory = ref('all')

// 工具分类
const categories = [
  { id: 'all', name: '全部工具', icon: 'mdi:toolbox' },
  { id: 'dev', name: '开发者工具', icon: 'mdi:code-braces' },
  { id: 'security', name: '安全工具', icon: 'mdi:shield-check' },
  { id: 'network', name: '网络工具', icon: 'mdi:cloud' },
  { id: 'productivity', name: '效率工具', icon: 'mdi:rocket-launch' }
]

// 工具数据
const tools = [
  {
    key: '/tools/unix-chmod',
    label: 'Unix 权限计算器',
    description: '计算和转换 Unix/Linux 文件权限（chmod 数字/符号表示法）',
    icon: 'mdi:lock-outline',
    category: 'dev',
    tags: ['Linux', '权限', '服务器']
  },
  {
    key: '/tools/duckduckgo-email',
    label: 'DuckDuckGo 隐私邮件',
    description: '生成一次性 DuckDuckGo 隐私邮件地址，保护真实邮箱',
    icon: 'mdi:email',
    category: 'security',
    tags: ['隐私', '邮件', '匿名']
  },
  {
    key: '/tools/cloudflare-dns-batch-delete',
    label: 'Cloudflare DNS 批量删除',
    description: '批量管理 Cloudflare DNS 记录，支持筛选和批量删除',
    icon: 'mdi:cloud',
    category: 'network',
    tags: ['DNS', 'Cloudflare', '批量']
  },
  {
    key: '/tools/api-tester',
    label: 'API 测试工具',
    description: '发送 HTTP 请求，测试 API 接口，支持多种方法和认证',
    icon: 'mdi:api',
    category: 'dev',
    tags: ['API', '测试', '调试']
  }
]

// 过滤工具
const filteredTools = computed(() => {
  let result = tools
  
  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(tool => tool.category === selectedCategory.value)
  }
  
  // 按搜索词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(tool => 
      tool.label.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return result
})

// 获取分类名称
const getCategoryName = (category) => {
  const cat = categories.find(c => c.id === category)
  return cat ? cat.name : '其他'
}

// 获取分类类型
const getCategoryType = (category) => {
  const types = {
    'dev': 'primary',
    'security': 'error',
    'network': 'info',
    'productivity': 'success'
  }
  return types[category] || 'default'
}

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category
}

// 导航到工具
const navigateToTool = (path) => {
  router.push(path)
}

// 快捷键支持
onMounted(() => {
  const handleKeyDown = (e) => {
    // Ctrl + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      document.querySelector('input[placeholder="搜索工具..."]')?.focus()
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<style scoped>
.toolbox-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-section {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #18a058 0%, #36b571 100%);
  color: white;
  border-radius: 12px;
}

.welcome-section :deep(.n-card__content) {
  padding: 40px 30px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.welcome-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 5px;
  line-height: 1.6;
}

.welcome-desc {
  font-size: 1rem;
  opacity: 0.8;
  line-height: 1.6;
}

.welcome-icon {
  margin-left: 30px;
  opacity: 0.9;
}

.search-section {
  margin-bottom: 30px;
  border-radius: 12px;
}

.search-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category-tags {
  flex-wrap: wrap;
}

.category-tags .n-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tags .n-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1d1d1f;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #86868b;
  margin-bottom: 30px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.tool-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.tool-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
  padding: 5px 0;
}

.tool-icon {
  flex-shrink: 0;
  color: #18a058;
  opacity: 0.8;
}

.tool-info {
  flex: 1;
}

.tool-description {
  color: #515767;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.tool-features {
  margin-top: auto;
}

.tool-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 10px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  border-radius: 12px;
  background: #f8f9fa;
  margin: 30px 0;
}

.quick-tips {
  margin-top: 30px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.tips-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  text-align: center;
}

.tip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.tip-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 5px 0;
}

.tip-item p {
  color: #515767;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbox-home {
    padding: 15px;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-icon {
    margin-left: 0;
    margin-top: 20px;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-section :deep(.n-card__content) {
    padding: 30px 20px;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .tool-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
  }
  
  .tips-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.6rem;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
}
</style>