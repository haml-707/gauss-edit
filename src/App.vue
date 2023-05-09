<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { watch, computed, ref, provide } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { useRoute } from 'vue-router';

import { useLangStore } from '@/stores';
import EditHeader from '@/views/edit/EditHeader.vue';
import EditFooter from '@/views/edit/EditFooter.vue';
import EditTextTitle from '@/views/edit/EditTextTitle.vue';
import { refreshInfo, tokenFailIndicateLogin } from '@/shared/login';
import { isUserActive } from '@/shared/utils';
import { router } from './routers';
import { ElMessage } from 'element-plus';

refreshInfo();
isUserActive(refreshInfo, tiemOutloginOut);

const { t, locale } = useI18n();
const route = useRoute();
const langStore = useLangStore();
const isEditPage = computed(() => {
  return route.path.includes('edit');
});
const isPreviewMode = ref<boolean>(false);
function getModeType(val: boolean) {
  isPreviewMode.value = val;
}
function tiemOutloginOut() {
  tokenFailIndicateLogin();
  router.push({
    path: '/zh/login',
    query: { redirect: route.fullPath },
  });
  ElMessage({
    message: '长时间未操作页面，自动退出登陆',
    type: 'warning',
    showClose: true,
    duration: 0,
  });
}
provide('modeType', isPreviewMode);
watch(
  () => langStore.lang,
  (val) => {
    locale.value = val;
  }
);
</script>

<template>
  <header><AppHeader /></header>
  <main :class="[isEditPage ? 'edit-page' : '', locale]">
    <component
      :is="isEditPage ? EditHeader : EditTextTitle"
      :title="t('edit.TITLE')"
      @change-switch="getModeType"
    ></component>
    <div class="content">
      <RouterView class="router-view" :mode-type="isPreviewMode"></RouterView>
    </div>
    <EditFooter v-if="isEditPage" />
  </main>
  <footer>
    <AppFooter v-show="!isEditPage" />
  </footer>
</template>

<style lang="scss">
#app {
  background-position: center top;
  background-size: 100% auto;
  background-repeat: repeat;
  background-color: var(--o-color-bg1);
  background-image: url(./assets/common/bg/bg.jpg);
}

main {
  position: relative;
  margin: 0 auto 0;
  max-width: 1416px;
  width: calc(100% - 88px);
  height: 100%;
  min-height: calc(100vh - 80px);
  overflow: hidden;

  @media (max-width: 1100px) {
    margin-top: 48px;
  }
}
.edit-page {
  max-width: 100%;
  width: 100%;
  > .content {
    background-color: var(--o-color-bg1);
    .router-view {
      margin: 0 auto;
    }
  }
}
</style>
