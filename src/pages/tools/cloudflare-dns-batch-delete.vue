<script setup>
    import { ref } from 'vue';
    import { 
      NCard, NForm, NFormItemRow, NInput, NButton, NCheckboxGroup, NCheckbox, NSpin, 
      NTable, NThead, NTr, NTh, NTbody, NTd, NText, NTag, NSpace, NAlert, useMessage, useDialog 
    } from 'naive-ui';
    import { Icon } from '@iconify/vue';
    
    // --- 1. 状态定义 ---
    
    // Naive UI 的消息提示和对话框
    const message = useMessage();
    const dialog = useDialog();
    
    // API 凭证和配置
    const apiToken = ref('');
    const zoneId = ref('');
    const baseUri = ref('https://api.cloudflare.com/client/v4'); // 默认 BASE_URI
    
    // DNS 记录相关状态
    const records = ref([]);
    const selectedRecordIds = ref([]);
    const isLoadingRecords = ref(false);
    const isDeleting = ref(false);
    
    // --- 2. API 请求逻辑 ---
    
    // 获取所有 DNS 记录
    const fetchDnsRecords = async () => {
      if (!apiToken.value || !zoneId.value) {
        message.warning('请先填写 API Token 和 Zone ID');
        return;
      }
    
      isLoadingRecords.value = true;
      records.value = [];
      selectedRecordIds.value = [];
    
      try {
        // 使用 baseUri 变量拼接 URL
        const response = await fetch(`${baseUri.value}/zones/${zoneId.value}/dns_records`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken.value}`,
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
    
        if (!response.ok || !data.success) {
          throw new Error(data.errors?.map(e => e.message).join(', ') || '获取记录失败');
        }
    
        records.value = data.result;
        message.success(`成功获取 ${records.value.length} 条 DNS 记录`);
    
      } catch (error) {
        console.error('获取 DNS 记录失败:', error);
        message.error(`获取失败: ${error.message}`);
      } finally {
        isLoadingRecords.value = false;
      }
    };
    
    // 批量删除选中的记录 (核心逻辑已修改)
    const deleteSelectedRecords = async () => {
      if (selectedRecordIds.value.length === 0) {
        message.warning('请至少选择一条要删除的记录');
        return;
      }
    
      // --- 3. 新增：删除前的确认对话框 ---
      dialog.warning({
        title: '确认删除',
        content: `你确定要删除选中的 ${selectedRecordIds.value.length} 条 DNS 记录吗？此操作不可撤销！`,
        positiveText: '确定删除',
        negativeText: '取消',
        onPositiveClick: () => {
          // 用户点击"确定"后，才执行真正的删除逻辑
          performDeletion();
        },
      });
    };
    
    // 新增：将删除逻辑封装成一个独立函数
    const performDeletion = async () => {
      isDeleting.value = true;
      let successCount = 0;
      let failCount = 0;
    
      // 使用 Promise.all 并行删除所有选中的记录
      const deletionPromises = selectedRecordIds.value.map(async (recordId) => {
        // 找到当前记录的信息，用于 Toast 显示
        const currentRecord = records.value.find(r => r.id === recordId);
        const recordName = currentRecord ? currentRecord.name : recordId;
        
        try {
          const response = await fetch(`${baseUri.value}/zones/${zoneId.value}/dns_records/${recordId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${apiToken.value}`,
              'Content-Type': 'application/json',
            },
          });
    
          const data = await response.json();
    
          if (!response.ok || !data.success) {
            throw new Error(data.errors?.map(e => e.message).join(', ') || '删除失败');
          }
          
          // 成功删除单条记录
          successCount++;
          message.success(`成功删除: ${recordName}`);
          return { success: true, recordName, recordId };
        } catch (error) {
          console.error(`删除记录 ${recordId} 失败:`, error);
          failCount++;
          message.error(`删除失败: ${recordName} - ${error.message}`);
          return { success: false, recordName, recordId, error: error.message };
        }
      });
    
      // 等待所有删除请求完成
      await Promise.allSettled(deletionPromises);
    
      // 操作完成后的汇总反馈 - 使用模态对话框而不是消息提示
      const totalDeleted = selectedRecordIds.value.length;
      if (failCount === 0) {
        dialog.success({
          title: '删除成功',
          content: `成功删除了 ${successCount} 条 DNS 记录！`,
          positiveText: '确定',
          onPositiveClick: () => {
            // 重新获取记录列表以更新 UI
            fetchDnsRecords();
          }
        });
      } else {
        dialog.warning({
          title: '操作完成',
          content: `成功删除: ${successCount}, 删除失败: ${failCount}，总共尝试删除: ${totalDeleted}`,
          positiveText: '确定',
          onPositiveClick: () => {
            // 重新获取记录列表以更新 UI
            fetchDnsRecords();
          }
        });
      }
    
      isDeleting.value = false;
    };
    
</script>

<template>
  <div class="cf-dns-tool-container">
    <NCard title="Cloudflare DNS 批量删除">
      <NAlert type="warning" title="危险操作" style="margin-bottom: 20px;">
        此工具将永久删除您选中的 DNS 记录，且此操作无法撤销。请务必谨慎操作。
      </NAlert>

      <!-- API 凭证输入 -->
      <NForm label-placement="left" label-width="120">
        <NFormItemRow label="API Token:">
          <NInput v-model:value="apiToken" type="password" show-password-on="click" placeholder="你的 Cloudflare API Token" />
        </NFormItemRow>
        <NFormItemRow label="Zone ID:">
          <NInput v-model:value="zoneId" placeholder="你的域名 Zone ID" />
        </NFormItemRow>
        <!-- --- 1. 新增：BASE_URI 输入框 --- -->
        <NFormItemRow label="API Base URI:">
          <NInput v-model:value="baseUri" placeholder="API 基础地址 (通常无需修改)" />
        </NFormItemRow>
        <div class="cors-proxy-info">
          <p style="margin: 8px 0; color: #f59e0b; font-size: 14px;">
            <strong>CORS代理提示：</strong>调用此接口需处理跨域。可参考代理地址：https://cors-anywhere.7003410.xyz/proxy/api.cloudflare.com/client/v4（请自行评估安全性）
          </p>
        </div>
        <NFormItemRow>
          <NButton type="primary" @click="fetchDnsRecords" :loading="isLoadingRecords" :disabled="!apiToken || !zoneId">
            <Icon icon="mdi:cloud-download" />
            获取 DNS 记录
          </NButton>
        </NFormItemRow>
      </NForm>

      <!-- 记录列表和操作 -->
      <div v-if="records.length > 0" style="margin-top: 24px;">
        <NSpace justify="space-between" align="center" style="margin-bottom: 16px;">
          <h3>DNS 记录列表 (勾选要删除的记录)</h3>
          <NButton type="error" @click="deleteSelectedRecords" :loading="isDeleting" :disabled="selectedRecordIds.length === 0">
            <Icon icon="mdi:delete-forever" />
            删除选中的 {{ selectedRecordIds.length }} 条记录
          </NButton>
        </NSpace>

        <NCheckboxGroup v-model:value="selectedRecordIds">
          <NTable :single-line="false">
            <NThead>
              <NTr>
                <NTh>选择</NTh>
                <NTh>记录名称</NTh>
                <NTh>类型</NTh>
                <NTh>记录值</NTh>
              </NTr>
            </NThead>
            <NTbody>
              <NTr v-for="record in records" :key="record.id">
                <NTd>
                  <NCheckbox :value="record.id" />
                </NTd>
                <NTd>{{ record.name }}</NTd>
                <NTd>
                  <NTag :type="record.type === 'A' ? 'info' : 'default'" round>
                    {{ record.type }}
                  </NTag>
                </NTd>
                <NTd>
                  <NText depth="3" style="word-break: break-all;">{{ record.content }}</NText>
                </NTd>
              </NTr>
            </NTbody>
          </NTable>
        </NCheckboxGroup>
      </div>

      <!-- 加载中状态 -->
      <NSpin v-if="isLoadingRecords" size="large" style="width: 100%; padding: 40px 0;">
        <template #description>正在获取 DNS 记录...</template>
      </NSpin>

    </NCard>
  </div>
</template>

<style scoped>
.cf-dns-tool-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.cors-proxy-info {
  margin: 8px 0;
}
</style>
