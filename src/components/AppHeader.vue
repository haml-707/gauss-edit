<script setup lang="ts">
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';

import { useLangStore } from '@/stores';

import OIcon from '@/components/OIcon.vue';

import { showGuard, logout, getUserAuth, useStoreData } from '@/shared/login';
import communityLogoWhite from '@/assets/common/header/openeuler-logo.png';
import IconLogin from '~icons/app/icon-login.svg';

const { t } = useI18n();

const lang = computed(() => {
  return useLangStore().lang;
});
const { token } = getUserAuth();
const { guardAuthClient } = useStoreData();

const jumpToUserZone = () => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  const origin = import.meta.env.VITE_LOGIN_ORIGIN;
  window.open(`${origin}/${language}/profile`, '_black');
};
</script>

<template>
  <header class="app-header">
    <div class="wrap">
      <div class="header-logo">
        <router-link to="/zh/">EasyEditor</router-link>
        <span class="line"></span>
        <a target="_blank" :href="`https://www.openeuler.org/${lang}/`"
          ><img class="community-logo" :src="communityLogoWhite"
        /></a>
      </div>
      <div class="opt-user">
        <div v-if="token">
          <div class="opt-info">
            <img
              v-if="guardAuthClient.photo"
              :src="guardAuthClient.photo"
              class="opt-img"
            />
            <div v-else class="opt-img"></div>
            <p class="opt-name" :title="guardAuthClient?.username">
              {{ guardAuthClient.username }}
            </p>
          </div>
          <ul class="menu-list">
            <li @click="jumpToUserZone()">{{ t('common.USER_CENTER') }}</li>
            <li @click="logout()">{{ t('common.LOGOUT') }}</li>
          </ul>
        </div>
        <div v-else class="login" @click="showGuard()">
          <OIcon class="icon">
            <IconLogin />
          </OIcon>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  .wrap {
    display: flex;
    padding: 0 44px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    max-width: 1504px;
    height: 80px;
    // @media (max-width: 1680px) {
    //   max-width: 1300px;
    // }
    .new-issue {
      flex-shrink: 0;
      .o-button {
        font-size: var(--o-font-size-h8);
        color: var(--o-color-text2);
        border: 1px solid #fff;
      }
    }
    .out-box {
      width: 100%;
      height: 100%;
    }
    .language {
      display: flex;
      justify-content: flex-end;
      margin-right: 40px;
      width: 100px;
      text-align: right;
      .el-dropdown {
        color: var(--o-color-text2);
        cursor: pointer;
        &-link {
          display: flex;
          color: var(--o-color-text2);
        }

        .o-icon {
          margin-left: 5px;
        }
      }
    }
  }
  &.isabout {
    background: #000;
  }
}

.header-logo {
  display: flex;
  align-items: center;
  font-weight: 300;
  font-size: var(--o-font-size-h5);
  line-height: var(--o-line-height-h5);
  color: var(--o-color-text2);

  .line {
    height: 24px;
    background: #fff;
    margin: 0 12px;
    display: block;
    width: 1px;
  }
  a {
    display: flex;
    align-items: center;
    color: var(--o-color-text2);
    font-family: Futura-Medium, Futura;
    font-weight: 500;
    .community-logo {
      height: 32px;
    }
  }
  .quickissue-logo {
    height: 32px;
  }
}
.opt-user {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  .opt-info {
    display: flex;
    align-items: center;
    .opt-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      vertical-align: middle;
      @media (max-width: 1100px) {
        width: 28px;
        height: 28px;
      }
    }
    .opt-name {
      color: var(--o-color-text2);
      margin-left: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 72px;
      line-height: var(--o-line-height-h8);
      @media (max-width: 1100px) {
        display: none;
      }
    }
  }
  &:hover {
    .menu-list {
      display: block;
    }
  }
  .menu-list {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    @media (max-width: 1100px) {
      top: 48px;
      left: -60px;
    }
    background: var(--o-color-bg2);
    cursor: pointer;
    z-index: 999;
    box-shadow: var(--o-shadow-l1);
    min-width: 78px;
    li {
      line-height: var(--o-line-height-h3);
      text-align: center;
      font-size: var(--o-font-size-text);
      color: var(--o-color-text1);
      border-bottom: 1px solid var(--o-color-division1);
      padding: 0 var(--o-spacing-h5);
      white-space: nowrap;
      &:last-child {
        border-bottom: 0 none;
      }

      &:hover {
        background: var(--o-color-brand1);
        color: var(--o-color-text2);
      }
      &.active {
        color: var(--o-color-brand1);
        background: none;
        cursor: default;
      }
    }
  }
}
.login {
  .icon {
    font-size: var(--o-font-size-h6);
    color: var(--o-color-text2);
    cursor: pointer;
  }
}
</style>
