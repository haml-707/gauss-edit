import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';

interface Params {
  title: string;
  description: string;
  content: string;
  contentType: string;
  name: string;
  path: string;
  type: string;
  locale: string;
  isPrivate: boolean;
}

function getHeaderConfig() {
  const { token } = getUserAuth();
  const headersConfig = token
    ? {
        headers: {
          token,
        },
      }
    : {};
  return headersConfig;
}

/**
 * 创建页面
 * @name createPage
 * @return {Array}
 */
export function createPage(params: Params) {
  const url = '/api-edit/page';
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}

/**
 * 创建页面
 * @name getPageData
 * @return {Array}
 */

export function getPageData(id: number) {
  const url = `/api-edit/page/${id}`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 更新页面数据
 * @name modifyPageData
 * @return {Array}
 */

export function modifyFloorData(params: Params) {
  const url = `/api-edit/page?path=${params.path}&name=${params.name}`;
  const { headers } = getHeaderConfig();
  return request
    .put(url, params, { headers, $ignoreLoading: true })
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 获取单个楼层数据
 * @name getSingleFloorData
 * @return {Array}
 */

export function getSingleFloorData(path: string, name: string) {
  const url = `/api-edit/page?path=${path}&name=${name}`;
  const { headers } = getHeaderConfig();
  return request
    .get(url, { headers, $ignoreLoading: true })
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}

export function publishPage(path: string, publisher: string, version: string) {
  const url = '/api-edit/publish';
  const params = {
    path,
    publisher,
    version,
  };
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 查询可编辑的页面
 * @name profileData
 * @return {Array}
 */

export function profileData(params: { siteName: string; type: string }) {
  const url = `/api-edit/page/profile?name=${params.siteName}&type=${params.type}`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 查询path 下的所有 组件 (编辑版本)
 * @name profileData
 * @return {Array}
 */
export function getAllDataByPath(path: string) {
  const { headers } = getHeaderConfig();

  const url = `/api-edit/page/all?path=${path}`;
  return request
    .get(url, { headers })
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 删除单个页面
 * @name delFloor
 */
export function deleteFloor(path: string, name: string) {
  const url = `/api-edit/page?path=${path}&name=${name}`;
  return request
    .delete(url, getHeaderConfig())
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 查询某个页面可回退的发布版本
 * @name getReleaseVersion
 */
export function getReleaseVersion(path: string) {
  const url = `/api-edit/publish/versions?path=${path}`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 查询某个网页的某个发布版本内容
 * @name getDataByVersion
 */
export function getDataByVersion(path: string, version: number) {
  const url = `/api-edit/publish?path=${path}&version=${version}`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 查询某个网页的某个发布版本内容
 * @name getDataByVersion
 */
export function getDataByVersion1() {
  const url = `/api-edit/publish/latest?path=https://www.openeuler.org/zh/interaction/summit-list/devday2023/`;
  return request
    .get(url)
    .then((res: AxiosResponse) => res?.data)
    .catch((e: any) => {
      console.error(e);
    });
}
