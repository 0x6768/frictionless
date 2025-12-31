<script setup>
    import { ref, computed } from 'vue';
    import { NCard, NTable, NCheckbox, NSpace, NInput, NText, NTag } from 'naive-ui';
    import { Icon } from '@iconify/vue';
    
    // --- 1. 状态定义 ---
    
    // 核心权限状态：用一个对象来管理 3x3 网格的选中状态
    // 这个结构非常清晰，方便在模板中循环和绑定
    const permissions = ref({
      owner: { read: false, write: false, execute: false },
      group: { read: false, write: false, execute: false },
      other: { read: false, write: false, execute: false },
    });
    
    // 特殊权限状态
    const specialPermissions = ref({
      suid: false, // Set User ID
      sgid: false, // Set Group ID
      sticky: false, // Sticky Bit
    });
    
    
    // --- 2. 计算逻辑 ---
    
    // 使用 computed 属性，当 permissions 变化时自动重新计算
    // 计算八进制表示 (e.g., 755)
    const octalNotation = computed(() => {
      const calculateOctal = (perms) => {
        // 读=4, 写=2, 执行=1
        let sum = 0;
        if (perms.read) sum += 4;
        if (perms.write) sum += 2;
        if (perms.execute) sum += 1;
        return sum;
      };
    
      const ownerOctal = calculateOctal(permissions.value.owner);
      const groupOctal = calculateOctal(permissions.value.group);
      const otherOctal = calculateOctal(permissions.value.other);
    
      // 拼接特殊权限位
      let specialOctal = 0;
      if (specialPermissions.value.suid) specialOctal += 4;
      if (specialPermissions.value.sgid) specialOctal += 2;
      if (specialPermissions.value.sticky) specialOctal += 1;
    
      // 如果有特殊权限，则加在前面，否则直接返回三位数
      return specialOctal > 0 ? `${specialOctal}${ownerOctal}${groupOctal}${otherOctal}` : `${ownerOctal}${groupOctal}${otherOctal}`;
    });
    
    // 计算符号式表示 (e.g., rwxr-xr-x)
    const symbolicNotation = computed(() => {
      const getSymbol = (perms) => {
        return `${perms.read ? 'r' : '-'}${perms.write ? 'w' : '-'}${perms.execute ? 'x' : '-'}`;
      };
    
      let result = getSymbol(permissions.value.owner) + getSymbol(permissions.value.group) + getSymbol(permissions.value.other);
    
      // 处理特殊权限在符号式中的显示
      // SUID: 如果所有者有执行权限，显示 's'，否则显示 'S'
      if (specialPermissions.value.suid) {
        result = permissions.value.owner.execute ? result.substring(0, 2) + 's' + result.substring(3) : result.substring(0, 2) + 'S' + result.substring(3);
      }
      // SGID: 如果所属组有执行权限，显示 's'，否则显示 'S'
      if (specialPermissions.value.sgid) {
        result = permissions.value.group.execute ? result.substring(0, 5) + 's' + result.substring(6) : result.substring(0, 5) + 'S' + result.substring(6);
      }
      // Sticky: 如果其他用户有执行权限，显示 't'，否则显示 'T'
      if (specialPermissions.value.sticky) {
        result = permissions.value.other.execute ? result.substring(0, 8) + 't' : result.substring(0, 8) + 'T';
      }
    
      return result;
    });
    
    // --- 3. 辅助函数 ---
    
    // 一键设置常用权限
    const setPreset = (owner, group, other) => {
      permissions.value = {
        owner: { read: owner[0] === 'r', write: owner[1] === 'w', execute: owner[2] === 'x' },
        group: { read: group[0] === 'r', write: group[1] === 'w', execute: group[2] === 'x' },
        other: { read: other[0] === 'r', write: other[1] === 'w', execute: other[2] === 'x' },
      };
      // 清除特殊权限
      specialPermissions.value = { suid: false, sgid: false, sticky: false };
    };
    </script>
    
    <template>
      <div class="permission-calculator-container">
        <NCard title="Unix 权限计算器 (chmod)">
          <!-- 第一部分：3x3 权限网格 -->
          <h3>基础权限</h3>
          <p>为所有者、所属组和其他用户设置读、写、执行权限。</p>
          <NTable :single-line="false" class="permission-table">
            <thead>
              <tr>
                <th></th>
                <th>
                  <Icon icon="mdi:account" /> 所有者
                </th>
                <th>
                  <Icon icon="mdi:account-group" /> 所属组
                </th>
                <th>
                  <Icon icon="mdi:account-arrow-right" /> 其他
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Icon icon="mdi:file-document-outline" /> 读
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.owner.read" />
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.group.read" />
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.other.read" />
                </td>
              </tr>
              <tr>
                <td>
                  <Icon icon="mdi:pencil" /> 写
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.owner.write" />
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.group.write" />
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.other.write" />
                </td>
              </tr>
              <tr>
                <td>
                  <Icon icon="mdi:play-circle-outline" /> 执行
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.owner.execute" />
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.group.execute" />
                </td>
                <td class="checkbox-cell">
                  <NCheckbox v-model:checked="permissions.other.execute" />
                </td>
              </tr>
            </tbody>
          </NTable>
    
          <!-- 第二部分：特殊权限 -->
          <h3 style="margin-top: 24px;">特殊权限</h3>
          <p>设置 SUID, SGID, Sticky Bit 等高级权限。</p>
          <NSpace :size="24">
            <NCheckbox v-model:checked="specialPermissions.suid">
              <NText strong>SUID (4)</NText>
              <NText depth="3" style="margin-left: 8px;">以文件所有者身份运行</NText>
            </NCheckbox>
            <NCheckbox v-model:checked="specialPermissions.sgid">
              <NText strong>SGID (2)</NText>
              <NText depth="3" style="margin-left: 8px;">以文件所属组身份运行/继承目录组</NText>
            </NCheckbox>
            <NCheckbox v-model:checked="specialPermissions.sticky">
              <NText strong>Sticky Bit (1)</NText>
              <NText depth="3" style="margin-left: 8px;">仅文件所有者可删除/重命名</NText>
            </NCheckbox>
          </NSpace>
    
          <!-- 第三部分：计算结果 -->
          <h3 style="margin-top: 24px;">计算结果</h3>
          <NSpace vertical :size="12">
            <div class="result-item">
              <label for="octal-result">八进制表示:</label>
              <NInput id="octal-result" :value="octalNotation" readonly placeholder="例如: 755" />
              <NTag type="info" size="small">用于 `chmod {{ octalNotation }} file.txt`</NTag>
            </div>
            <div class="result-item">
              <label for="symbolic-result">符号式表示:</label>
              <NInput id="symbolic-result" :value="symbolicNotation" readonly placeholder="例如: rwxr-xr-x" />
              <NTag type="success" size="small">`ls -l` 命令显示的格式</NTag>
            </div>
          </NSpace>
    
          <!-- 第四部分：快捷预设 -->
          <h3 style="margin-top: 24px;">快捷预设</h3>
          <NSpace :size="12">
            <NTag @click="setPreset('rwx', 'r-x', 'r-x')" style="cursor: pointer;" round>
              755 (rwxr-xr-x) - 常规文件/目录
            </NTag>
            <NTag @click="setPreset('rw-', 'r--', 'r--')" style="cursor: pointer;" round>
              644 (rw-r--r--) - 常规文件
            </NTag>
            <NTag @click="setPreset('rwx', 'rwx', 'rwx')" style="cursor: pointer;" round>
              777 (rwxrwxrwx) - 完全开放
            </NTag>
            <NTag @click="setPreset('rwx', '---', '---')" style="cursor: pointer;" round>
              700 (rwx------) - 仅所有者
            </NTag>
          </NSpace>
    
        </NCard>
      </div>
    </template>
    
    <style scoped>
    .permission-calculator-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .permission-table {
      margin-top: 16px;
      text-align: center;
    }
    
    .permission-table th,
    .permission-table td {
      padding: 12px !important;
    }
    
    .permission-table th {
      background-color: var(--n-th-color);
      font-weight: bold;
    }
    
    .checkbox-cell {
      vertical-align: middle;
    }
    
    .result-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .result-item label {
      min-width: 100px;
      font-weight: bold;
    }
    
    .result-item .n-input {
      max-width: 250px;
    }
    </style>