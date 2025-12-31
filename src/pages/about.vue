<template>
    <div class="about-page">
        <!-- 标题区域 -->
        <n-card class="title-section" :bordered="false">
            <div class="title-content">
                <h1 class="main-title">关于 Frictionless</h1>
                <p class="subtitle">让工具回归工具，让你成为你</p>
            </div>
        </n-card>

        <!-- 致歉说明 -->
        <n-card title="关于项目" class="apology-section">
            <div class="apology-content">
                <n-alert type="info" class="apology-alert">
        
                    <div class="alert-content">
    <h4>🎉 感谢使用 Frictionless</h4>
    <p><strong>项目架构：</strong>这是一个纯前端 Vue.js 应用，无需后端服务器支持。</p>
    <p><strong>数据存储：</strong>所有数据都保存在您浏览器的本地存储中，不会上传到任何服务器。</p>
    <p><strong>隐私保护：</strong>您的数据完全私密，仅存在于当前设备中。</p>
    <p><strong>注意事项：</strong>清除浏览器数据或更换设备会导致数据丢失，请及时备份重要信息。</p>
    <p>作为我的第一个 Vue 项目，如有不足欢迎反馈！</p>
</div>
                </n-alert>
            </div>
        </n-card>

        <!-- 技术栈展示 -->
        <n-card title="技术栈" class="tech-stack-section">
            <n-grid :cols="2" :x-gap="16" :y-gap="16">
                <n-gi>
                    <n-card class="tech-card" hoverable>
                        <div class="tech-item">
                            <div class="tech-icon">
                                <Icon icon="logos:vue" width="40" height="40" />
                            </div>
                            <div class="tech-info">
                                <h3>Vue 3</h3>
                                <p>渐进式 JavaScript 框架</p>
                            </div>
                        </div>
                    </n-card>
                </n-gi>

                <n-gi>
                    <n-card class="tech-card" hoverable>
                        <div class="tech-item">
                            <div class="tech-icon">
                                <Icon icon="mdi:router" width="40" height="40" />
                            </div>
                            <div class="tech-info">
                                <h3>unplugin-vue-router</h3>
                                <p>基于文件系统的路由</p>
                            </div>
                        </div>
                    </n-card>
                </n-gi>

                <n-gi>
                    <n-card class="tech-card" hoverable>
                        <div class="tech-item">
                            <div class="tech-icon">
                                <Icon icon="logos:vitejs" width="40" height="40" />
                            </div>
                            <div class="tech-info">
                                <h3>Vite</h3>
                                <p>下一代前端构建工具</p>
                            </div>
                        </div>
                    </n-card>
                </n-gi>

                <n-gi>
                    <n-card class="tech-card" hoverable>
                        <div class="tech-item">
                            <div class="tech-icon">
                                <Icon icon="simple-icons:iconify" width="40" height="40" />
                            </div>
                            <div class="tech-info">
                                <h3>Iconify</h3>
                                <p>统一的图标框架</p>
                            </div>
                        </div>
                    </n-card>
                </n-gi>

                <n-gi>
                    <n-card class="tech-card" hoverable>
                        <div class="tech-item">
                            <div class="tech-icon">
                                <Icon icon="logos:naiveui" width="40" height="40" />
                            </div>
                            <div class="tech-info">
                                <h3>Naive UI</h3>
                                <p>Vue 3 组件库</p>
                            </div>
                        </div>
                    </n-card>
                </n-gi>

                <n-gi>
                    <n-card class="tech-card" hoverable>
                        <div class="tech-item">
                            <div class="tech-icon">
                                <Icon icon="mdi:code-json" width="40" height="40" />
                            </div>
                            <div class="tech-info">
                                <h3>其他技术</h3>
                                <p>ES6+、CSS3 等</p>
                            </div>
                        </div>
                    </n-card>
                </n-gi>
            </n-grid>
        </n-card>

    

        <!-- 联系方式 -->
        <n-card title="联系我" class="contact-section">
            <div class="contact-content">
                <p>如果您对这个项目有任何建议或发现了问题，欢迎通过以下方式联系我：</p>
                <div class="contact-actions">
                    <n-button type="primary" @click="sendFeedback">
                        <template #icon>
                            <Icon icon="mdi:email" />
                        </template>
                        联系邮箱
                    </n-button>
                    <n-button @click="viewSourceCode">
                        <template #icon>
                            <Icon icon="mdi:github" />
                        </template>
                        查看源代码
                    </n-button>
                </div>
            </div>
        </n-card>
    </div>
    <!-- 模态框 -->
   
</template>

<script setup>
import { ref } from 'vue'
import {
    NCard,
    NAlert,
    NButton,
    NGrid,
    NGi,
    useMessage
} from 'naive-ui'
import { Icon } from '@iconify/vue'

const message = useMessage()

const sendFeedback = () => {
    // 复制邮箱到剪贴板
    const email = 'admin@7003410.xyz'
    const textarea = document.createElement('textarea')
    textarea.value = email
    document.body.appendChild(textarea)
    textarea.select()
    /// 使用现代化的方法web clipboard api
    navigator.clipboard.writeText(email).then(() => {
        message.success('复制邮箱成功')
    }).catch(() => {
        message.error('复制邮箱失败')
    })

}

// 查看源代码
const viewSourceCode = () => {
    message.info('源代码暂未公开，敬请期待！')
}
</script>

<style scoped>
.about-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.title-section {
    margin-bottom: 24px;
    background: linear-gradient(135deg, #18a058 0%, #36b571 100%);
    color: white;
    text-align: center;
}

.title-section :deep(.n-card__content) {
    padding: 40px 30px;
}

.main-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

.apology-section,
.tech-stack-section,
.learning-section,
.contact-section {
    margin-bottom: 24px;
}

.apology-alert {
    margin: 10px 0;
}

.alert-content h4 {
    margin-bottom: 8px;
    color: #18a058;
}

.alert-content p {
    margin-bottom: 8px;
    line-height: 1.6;
}

.tech-card {
    height: 100%;
    transition: transform 0.2s;
}

.tech-card:hover {
    transform: translateY(-2px);
}

.tech-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
}

.tech-icon {
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: #f5f5f5;
    border-radius: 8px;
}

.tech-info h3 {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.tech-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.learning-section :deep(.n-list-item) {
    padding: 16px 0;
}

.contact-content p {
    margin-bottom: 20px;
    line-height: 1.6;
}

.contact-actions {
    display: flex;
    gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .about-page {
        padding: 15px;
    }

    .main-title {
        font-size: 2rem;
    }

    .title-section :deep(.n-card__content) {
        padding: 30px 20px;
    }

    .contact-actions {
        flex-direction: column;
    }

    .tech-item {
        flex-direction: column;
        text-align: center;
    }

    .tech-icon {
        margin-right: 0;
        margin-bottom: 10px;
    }
}

@media (max-width: 480px) {
    .tech-stack-section :deep(.n-grid) {
        grid-template-columns: 1fr !important;
    }
}
</style>