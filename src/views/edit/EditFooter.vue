<script lang="ts" setup>
import { ref, reactive, computed, inject, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useStoreData } from '@/shared/login';
import { useVersionData } from '@/stores';

import { useRoute } from 'vue-router';

import { publishPage } from '@/api/api-easy-edit';

import { OButton } from '@/components/button';
import OIcon from '@/components/OIcon.vue';

import IconArrowRight from '~icons/app/icon-arrow-right.svg';
import IconWarn from '~icons/edit/icon-warn.svg';

import { ElMessage } from 'element-plus';

import type { FormInstance } from 'element-plus';

const { t, locale } = useI18n();
const { guardAuthClient } = useStoreData();
const route = useRoute();
const modeType = inject('modeType') as Ref<boolean>;

const sigDetailName = ref(route.params.name as string);

const pathMap: any = {
  sig: `sig/sig-detail/?name=${sigDetailName.value}`,
  event: `summit/${route.params.name}/`,
};

const path = ref(
  `https://opengauss.org/${locale.value}/${pathMap[route.path.split('/')[3]]}`
);

const userName = computed(() => {
  return guardAuthClient?.value.username;
});

const isDialogVisiable = ref(false);
const formRef = ref<FormInstance>();
const ruleForm = reactive({
  name: '',
});
const rules: any = reactive({
  name: [
    {
      required: true,
      message: t('edit.REQUIRED'),
      trigger: 'blur',
    },
    {
      validator: checkName,
      message: t('edit.PATTERN_RIGHT'),
      trigger: 'blur',
    },
  ],
});

function checkName(rule: any, value: string, callback: any) {
  if (!value) {
    return callback(new Error(t('edit.REQUIRED')));
  }
  if (ruleForm.name === userName.value) {
    callback();
  } else {
    callback(new Error(t('edit.PATTERN_RIGHT')));
  }
}

function toggleDelDlg(val: boolean) {
  ruleForm.name === userName.value;
  isDialogVisiable.value = val;
}
function confirmPublish(verify: FormInstance | undefined) {
  if (!verify) {
    return;
  }
  verify.validate(async (res: boolean) => {
    if (res) {
      publishPage(
        path.value,
        ruleForm.name,
        useVersionData().activeVersion === -1
          ? 'latest'
          : useVersionData().activeVersion.toString()
      ).then((res) => {
        if (res.statusCode === 200) {
          ElMessage({
            type: 'success',
            message: '发布成功',
          });
          useVersionData().setVersionData(path.value);
          toggleDelDlg(false);
        }
      });
    }
  });
}
</script>
<template>
  <div class="edit-footer">
    <p>
      {{ t('edit.CONFIRE_PUBLISH') }}
    </p>
    <OButton
      class="post-edit"
      :class="[modeType ? '' : 'disabled']"
      :animation="modeType"
      @click="modeType ? toggleDelDlg(true) : ''"
      >{{ t('edit.PUBLISH_PAGE') }}
      <template #suffixIcon>
        <OIcon>
          <IconArrowRight></IconArrowRight>
        </OIcon>
      </template>
    </OButton>
    <el-dialog
      v-model="isDialogVisiable"
      class="publish-dialog"
      :show-close="false"
      width="640"
      @close-click="toggleDelDlg(false)"
    >
      <template #header>
        <OIcon>
          <IconWarn />
        </OIcon>
      </template>
      <h3>
        {{ t('edit.CONFIRM_TEXT1') }}
        <span class="major1">{{ t('edit.CONFIRM_TEXT2') }}</span>
        {{ t('edit.CONFIRM_TEXT3') }}
      </h3>
      <!-- TODO: 用户名 -->
      <p>
        {{ t('edit.CONFIRM_TEXT4') }}
        <span class="user-name">{{ userName }}</span>
        {{ t('edit.CONFIRM_TEXT5') }}
      </p>
      <el-form ref="formRef" :model="ruleForm" :rules="rules" @submit.prevent>
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <o-button size="small" @click="toggleDelDlg(false)">{{
          t('edit.CANCEL')
        }}</o-button>
        <o-button
          size="small"
          type="primary"
          @click="confirmPublish(formRef)"
          >{{ t('edit.CONFIRM') }}</o-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.major1 {
  color: var(--o-color-major1);
}
.edit-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 64px 0;
  font-size: var(--o-font_size-tip1);
  color: var(--o-color-text2);
  .post-edit {
    margin-top: 8px;
    border: transparent;
    background-color: var(--o-color-major1);
    color: var(--o-color-text1);
  }
  .disabled {
    cursor: not-allowed;
    color: var(--o-color-white);
    background-color: var(--o-color-info3);
  }
}
</style>

<style lang="scss">
.publish-dialog {
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
