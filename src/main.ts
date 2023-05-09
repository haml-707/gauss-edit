import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './routers';
import i18n from './i18n';

import 'element-plus/theme-chalk/el-loading.css';
import '@/shared/styles/base.scss';
// import '@/shared/styles/o-theme/index.scss';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';

import App from './App.vue';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(VueMarkdownEditor);

app.mount('#app');
