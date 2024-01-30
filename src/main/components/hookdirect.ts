import axios, { AxiosResponse } from 'axios';

interface LoginResponse {
  code: number;
  msg: string;
  data: any;
}

interface HookSettings {
  port: string;
  ip: string;
  url: string;
  timeout: string;
  enableHttp: boolean;
}
// 定义针对hook消息的响应接口
interface HookResponse {
  code: number;
  msg: string;
  data: any;
}
export default class HookDirect {
  static checkLogin = async () => {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        'http://0.0.0.0:19088/api/checkLogin',
      );

      if (response && response.data) {
        return response.data;
      }
      throw new Error('No response from API');
    } catch (error: any) {
      return { error: 'Error connecting to API' };
    }
  };

  static hookMessage = async (
    hookSettings: HookSettings,
  ): Promise<HookResponse | { error: string }> => {
    try {
      // 构造hook请求的body
      const requestBody = {
        port: hookSettings.port,
        ip: hookSettings.ip,
        url: hookSettings.url,
        timeout: hookSettings.timeout,
        enableHttp: hookSettings.enableHttp,
      };

      // 发送POST请求
      const response: AxiosResponse<HookResponse> = await axios.post(
        'http://0.0.0.0:19088/api/hookSyncMsg', // hook的API地址
        requestBody,
      );

      // 检查响应
      if (response && response.data) {
        return response.data;
      }
      throw new Error('No response from API');
    } catch (error: any) {
      return { error: error.message || 'Error connecting to API' };
    }
  };
}
