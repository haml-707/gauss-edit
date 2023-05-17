<script lang="ts" setup>
import { inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useI18n } from 'vue-i18n';

import AppFooter from '@/components/AppFooter.vue';

import { getAllDataByPath, getDataByVersion } from '@/api/api-easy-edit';
import { usePageData, useVersionData } from '@/stores';

import imgLogo from '@/assets/common/header/logo.svg';

const { locale } = useI18n();

const route = useRoute();

const sigDetailName = ref(route.params.name as string);

const pathMap: any = {
  sig: `sig/sig-detail/?name=${sigDetailName.value}`,
  event: `summit/${route.params.name}/`,
};

const path = ref(
  `https://opengauss.org/${locale.value}/${pathMap[route.path.split('/')[3]]}`
);

const modeType = inject('modeType');

//获取编辑版本内容数据初始化
getAllDataByPath(path.value).then((res) => {
  usePageData().setPageData(res?.data);
});
// getDataByVersion(path.value, 16).then((res) => {
//   usePageData().setPageData(res?.data);
// });
watch(
  () => useVersionData().activeVersion,
  (val: number) => {
    if (val !== -1) {
      getDataByVersion(path.value, val).then((res) => {
        usePageData().setPageData(res?.data);
      });
    } else {
      getAllDataByPath(path.value).then((res) => {
        usePageData().setPageData(res?.data);
      });
    }
  }
);
</script>
<template>
  <div class="edit-template">
    <div class="app-header">
      <div class="center">
        <img :src="imgLogo" alt="" />
      </div>
    </div>
    <slot></slot>
    <AppFooter />
    <div id="edit-dialog" :class="!modeType ? 'mask' : ''"></div>
  </div>
</template>

<style scoped lang="scss">
.edit-template {
  position: relative;
}
.mask {
  position: absolute;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: rgba($color: #fff, $alpha: 0.72);
}
.app-header {
  height: 80px;
  background-color: var(--o-color-bg2);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .center {
    width: 100%;
    margin: 0 auto;
    max-width: 1504px;
    padding: 0 44px;
    img {
      cursor: pointer;
      width: 139px;
    }
  }
}
</style>
