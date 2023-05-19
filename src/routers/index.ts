import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore } from '@/stores';
import { getUserAuth } from '@/shared/login';
import { getUrlParam } from '@/shared/utils';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/zh/' },
  {
    path: '/zh/',
    name: 'home',
    alias: '/en/',
    component: () => import('@/views/TheEdit.vue'),
  },
  {
    path: '/zh/login',
    name: 'login',
    alias: '/en/login',
    component: () => import('@/views/login/TheLogin.vue'),
  },
  {
    path: '/zh/edit/event/:name',
    name: 'sig-event',
    alias: '/en/edit/event/:name',
    component: () => import('@/views/summit/TheSummit.vue'),
  },
  {
    path: '/zh/404',
    name: '404',
    alias: '/en/404',
    component: () => import('@/NotFound.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/zh/404',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  // 设置语言
  const langStore = useLangStore();
  langStore.lang = to.fullPath.includes('/en/') ? 'en' : 'zh';
  // 权限校验
  if (getUserAuth().token) {
    if (to.fullPath.includes('login')) {
      next({
        path: getUrlParam('redirect')?.includes('404')
          ? '/'
          : getUrlParam('redirect') || '/',
      });
    } else {
      next();
    }
  } else {
    if (to.fullPath.includes('login')) {
      next();
    } else {
      next({
        path: `/${langStore.lang}/login`,
        query: { redirect: to.fullPath },
      });
    }
  }
});
