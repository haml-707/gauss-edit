<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { OButton } from '@/components/button';
import OIcon from '@/components/OIcon.vue';

import IconCancel from '~icons/app/icon-close.svg';
import IconWarn from '~icons/edit/icon-warn.svg';

import { useVersionData } from '@/stores';

const route = useRoute();
const { locale, t } = useI18n();

const sigDetailName = ref(route.params.name as string);
const versionData = computed(() => {
  return useVersionData().versionData;
});

const pathMap: any = {
  sig: `sig/sig-detail/?name=${sigDetailName.value}`,
  event: `interaction/summit-list/${route.params.name}/`,
};

const path = ref(
  `https://www.openeuler.org/${locale.value}/${
    pathMap[route.path.split('/')[3]]
  }`
);

const isDialogVisiable = ref(false);

function getVersionData() {
  useVersionData().setVersionData(path.value);
}
getVersionData();
const activeVersion = ref(-1);

const emit = defineEmits(['change-switch', 'change-select']);
const isPreviewMode = ref(false);

function handleChangeSwitch() {
  emit('change-switch', isPreviewMode.value);
}

function handleChangeSelect() {
  useVersionData().setActiveVersion(activeVersion.value);
  if (activeVersion.value !== -1) {
    isPreviewMode.value = true;
    handleChangeSwitch();
    useVersionData().setCoverData(false);
  } else {
    useVersionData().setCoverData(true);
  }
}

function beforeChange() {
  if (!useVersionData().isCoverLatest) {
    useVersionData().setDialogData('header');
    return false;
  } else {
    return true;
  }
}
function toggleCoverDlg(val: boolean) {
  useVersionData().setDialogData(val ? 'header' : '');
  isDialogVisiable.value = val;
}

// function confirmCover() {
//   useVersionData().setCoverData(true);
//   if (useVersionData().isCoverDialogShown === 'header') {
//     isPreviewMode.value = false;
//     handleChangeSwitch();
//   }
//   toggleCoverDlg(false);
// }

handleChangeSwitch();

watch(
  () => useVersionData().isCoverDialogShown,
  (val) => {
    isDialogVisiable.value = val ? true : false;
  }
);
</script>
<template>
  <div class="edit-dispaly-zone">
    <div class="empty"></div>
    <div class="control-box">
      <div class="edit-switch">
        <span :class="!isPreviewMode ? 'active-switch' : ''">编辑模式</span
        ><el-switch
          v-model="isPreviewMode"
          :before-change="beforeChange"
          @change="handleChangeSwitch"
        ></el-switch
        ><span :class="isPreviewMode ? 'active-switch' : ''">预览模式</span>
      </div>
      <div class="revision-history">
        <span class="label">历史版本回退</span>
        <el-select
          v-model="activeVersion"
          placeholder="Latest"
          @change="handleChangeSelect"
        >
          <el-option label="Latest" :value="-1">
            <div class="customer-option">
              <span class="version">Latest</span>
            </div>
          </el-option>
          <el-option
            v-for="item in versionData"
            :key="item.version"
            :label="`Version ${item.version}`"
            :value="item.version"
          >
            <div class="customer-option">
              <span class="version">{{ `Version ${item.version}` }}</span>
              <span class="time">{{ item.publishAt }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="edit-close">
      <router-link to="/">
        <OButton
          >退出编辑
          <template #suffixIcon>
            <OIcon>
              <IconCancel />
            </OIcon>
          </template>
        </OButton>
      </router-link>
      <p>退出编辑将不保存任何修改</p>
    </div>
    <el-dialog
      v-model="isDialogVisiable"
      class="cover-dialog"
      :show-close="false"
      width="640"
      @close="toggleCoverDlg(false)"
    >
      <template #header>
        <OIcon>
          <IconWarn />
        </OIcon>
      </template>
      <!-- <h3>该操作将使所选版本内容覆盖当前Latest版本内容</h3> -->
      <h3>当前历史版本不支持编辑，如需回退至此版本请点击底部“发布页面”</h3>
      <template #footer>
        <!-- <o-button size="small" @click="toggleCoverDlg(false)">{{
          t('edit.CANCEL')
        }}</o-button> -->
        <o-button size="small" type="primary" @click="toggleCoverDlg(false)">{{
          t('edit.CONFIRM')
        }}</o-button>
        <!-- <o-button size="small" type="primary" @click="confirmCover()">{{
          t('edit.CONFIRM')
        }}</o-button> -->
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.edit-dispaly-zone {
  display: flex;
  padding: 0 44px;
  max-width: 1504px;
  margin: 20px auto 26px;
  justify-content: space-between;
  .empty {
    width: 154px;
  }
  .control-box {
    .revision-history {
      margin-top: 16px;
      display: flex;
      align-items: center;
      color: var(--o-color-white);
      .label {
        margin-right: 8px;
      }
      .el-select {
        width: 288px;
        .el-input__wrapper {
          padding: 3px 16px;
        }
      }
    }
    .edit-switch {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--o-color-info3);
      span {
        transition: color 0.3;
      }
      .el-switch {
        margin: 0 8px;
        --el-switch-on-color: #e5e8f0;
        --el-switch-off-color: #feb32a;
      }
    }
    .active-switch {
      color: var(--o-color-text2);
    }
  }
  .edit-close {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-size: var(--o-font_size-tip1);
    color: var(--o-color-text2);
    .o-button {
      color: var(--o-color-white);
      border-color: var(--o-color-white);
    }
    p {
      margin-top: 8px;
    }
  }
}
</style>
<style lang="scss">
.customer-option {
  padding: 0 8px;
  display: flex;
  .version {
    min-width: 96px;
  }
  .time {
    padding-left: 16px;
    color: #999;
    font-size: var(--o-font-size-tip);
  }
}
.cover-dialog {
  .el-dialog__header {
    margin-right: 0;
    text-align: center;
    font-size: 48px;
    color: var(--o-color-major1);
    .o-icon {
      display: inline-block;
    }
  }
  .el-dialog__body {
    text-align: center;
    h3 {
      padding: 16px 0;
      font-weight: 400;
      color: var(--o-color-text1);
      font-size: var(--o-font_size-h1);
      line-height: var(--o-line_height-h1);
    }
    p {
      margin-top: 24px;
      color: var(--o-color-neutral5);
      span {
        color: var(--o-color-text1);
      }
    }
    .el-input {
      margin-top: 8px;
      .el-input__inner {
        text-align: center;
      }
    }
  }
  .el-dialog__footer {
    display: flex;
    gap: 0 16px;
    justify-content: center;
  }
}
</style>
