import type { AxiosError } from 'axios';
import { router } from '@/routers';
// import { tokenFailIndicateLogin } from '@/shared/login';

export default (err: AxiosError) => {
  const { response } = err;
  if (response) {
    if (!response.status) {
      err.code = '';
      err.message = '有response但没有response.status的情况';
    }
    err.code = String(response.status);
    const res = err.response?.data as any;
    switch (response?.status) {
      case 200:
        err.message = '错误响应也会有状态码为200的情况';
        break;
      case 400:
        err.message = res?.message || '请求错误(400)';
        break;
      case 401:
        if (
          res === 'authentication failed: token expires' ||
          res?.message.includes('token expires')
        ) {
          // 清除过期token
          // tokenFailIndicateLogin();
          err.message = '您的账号信息已过期，请重新登陆';
          // router.push({
          //   path: '/zh/login',
          // });
        } else if (res.includes('java.net.SocketTimeoutException')) {
        } else {
          err.message = '未授权，或无访问权限(401)';
          router.push({
            path: '/zh/404',
          });
        }
        break;
      case 403:
        err.message =
          `${res?.message}\n ${res?.data}` || res?.message || '拒绝访问(403)';
        break;
      case 404:
        err.message = '请求出错(404)';
        break;
      case 408:
        err.message = '请求超时(408)';
        break;
      case 500:
        err.message = '服务器错误(500)';
        break;
      case 501:
        err.message = '服务未实现(501)';
        break;
      case 502:
        err.message = '网络错误(502)';
        break;
      case 503:
        err.message = res?.data || res?.message || '服务不可用(503)';
        break;
      case 504:
        err.message = '网络超时(504)';
        break;
      case 505:
        err.message = 'HTTP版本不受支持(505)';
        break;
      default:
        err.message = `连接出错，状态码：(${response.status})!`;
    }
  }

  return err;
};
