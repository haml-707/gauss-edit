<script setup lang="ts">
import NotFound from '@/assets/common/404/404.png';
</script>

<template>
  <div class="nofound">
    <img :src="NotFound" class="nofound-img" alt="" />
    <p class="nofound-text">
      页面不存在或无权限访问，<a href="/zh/">返回首页</a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.nofound {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: var(--o-font-size-h6);
  color: var(--o-color-text1);
  padding: var(--o-spacing-h2) 0;
  min-height: calc(100vh - 339px);
  background-color: var(--o-color-bg2);
  .nofound-text {
    margin-top: var(--o-spacing-h5);
    font-size: var(--o-font-size-h7);
  }
  .nofound-img {
    height: 300px;
  }
  @media screen and (max-width: 768px) {
    padding-top: var(--o-spacing-h2);
    font-size: var(--o-font-size-text);
    .nofound-img {
      max-height: 232px;
    }
    .nofound-text {
      margin-top: var(--o-spacing-h6);
      font-size: var(--o-font-size-tip);
    }
  }
}
</style>
