import { defineStore } from 'pinia';
import _ from 'lodash-es';
import { getReleaseVersion, getDataByVersion } from '@/api/api-easy-edit';
interface FloorData {
  name: string;
  content_type?: string;
  description?: string;
  title: string;
}
interface VersionData {
  version: number;
  publishAt: string;
}

interface VersionDataRes {
  statusCode: number;
  data: VersionData[];
}
// 语言
export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: '',
    };
  },
  actions: {
    setLangStore(val: string) {
      this.lang = val;
    },
  },
});
// 页面数据
export const usePageData = defineStore('edit-data', {
  state: () => {
    return {
      pageData: new Map(),
      // 线上版本内容（用于判断是否有修改）
      laststData: new Map(),
      tempData: new Map(),
    };
  },
  actions: {
    setPageData(data: [FloorData]) {
      if (data?.length) {
        const mapData = new Map();
        for (let i = 0; i < data.length; i++) {
          mapData.set(data[i].name, data[i]);
        }
        this.pageData = mapData;
        this.tempData = _.cloneDeep(mapData);
      } else {
        this.pageData = new Map();
        this.tempData = new Map();
      }
    },
    setLatestData(path: string, val: number) {
      getDataByVersion(path, val).then((res) => {
        const mapData = new Map();
        for (let i = 0; i < res?.data.length; i++) {
          mapData.set(res?.data[i].name, res?.data[i]);
        }
        this.laststData = mapData;
      });
    },
  },
});
export const useVersionData = defineStore('version-data', {
  state: () => {
    return {
      // 当前版本
      activeVersion: -1,
      // 是否允许切换编辑状态
      isCoverLatest: true,
      // 覆盖警示弹窗
      isCoverDialogShown: '',
      // 版本信息
      versionData: [] as VersionData[],
    };
  },
  actions: {
    setActiveVersion(data: number) {
      this.activeVersion = data;
    },
    setCoverData(data: boolean) {
      this.isCoverLatest = data;
    },
    setDialogData(data: string) {
      this.isCoverDialogShown = data;
    },
    // 获取版本信息
    setVersionData(path: string) {
      getReleaseVersion(path).then((res: VersionDataRes) => {
        if (res.statusCode === 200) {
          this.versionData = res.data;
          // if (this.versionData.length) {
          //   usePageData().setLatestData(path, this.versionData[0].version);
          // }
        }
      });
    },
  },
});
