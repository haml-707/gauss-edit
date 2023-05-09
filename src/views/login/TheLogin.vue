<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { OButton } from '@/components/button';
import OIcon from '@/components/OIcon.vue';

import { showGuard } from '@/shared/login';

import IconArrowRight from '~icons/app/icon-arrow-right.svg';
import notFoundImg from '@/assets/common/404/404.png';

const { t } = useI18n();
</script>
<template>
  <div class="login">
    <img :src="notFoundImg" alt="" />
    <p>{{ t('edit.VERIFICATION') }}</p>
    <OButton class="login-btn" type="primary" animation @click="showGuard()"
      >{{ t('edit.LOGIN') }}
      <template #suffixIcon>
        <OIcon>
          <IconArrowRight></IconArrowRight>
        </OIcon>
      </template>
    </OButton>
  </div>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  width: 640px;
  padding: 40px;
  background-color: var(--o-color-bg1);
  align-items: center;
  p {
    margin: 24px 0;
  }
  img {
    width: 240px;
    height: 240px;
  }
}
</style>
