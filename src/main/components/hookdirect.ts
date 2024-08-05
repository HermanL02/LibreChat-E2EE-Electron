import axios, { AxiosResponse } from 'axios';
import * as sudo from 'sudo-prompt';
import * as path from 'path';
import { getInjectorPath } from '../util';

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

interface HookResponse {
  code: number;
  msg: string;
  data: any;
}

interface SendMsgHookSettings {
  wxid: string;
  msg: string;
}

interface SendMsgHookResponse {
  code: number;
  msg: string;
  data: object | null;
}

export default class HookDirect {
  static injectWeChat = async () => {
    const options = {
      name: 'Libre Chat WeChat',
    };
    const injectorPath = getInjectorPath();
    const inject1 = path.join(injectorPath, 'Injector32.exe');
    // const inject2 = path.join(injectorPath, 'Injectorx64.exe');
    // const inject3 = path.join(injectorPath, 'Injectora64.exe');
    const dllpath = path.join(injectorPath, 'wxhelper39223.dll');

    const commands = [
      `${inject1} --process-name WeChat.exe -i ${dllpath}`,
      // `${inject2} --process-name WeChat.exe -i ${dllpath}`,
      // `${inject3} --process-name WeChat.exe -i ${dllpath}`,
    ];

    async function executeCommands(index: number): Promise<void> {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        if (index >= commands.length) {
          resolve();
          return;
        }
        const command = commands[index];
        sudo.exec(command, options, (error, stdout, stderr) => {
          console.log(`Executing command ${index + 1}: ${command}`);
          if (stdout) {
            console.log(`stdout: ${stdout}`);
            resolve();
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }
          if (error) {
            console.error(`Error: ${error}`);
            executeCommands(index + 1)
              .then(resolve)
              .catch(reject);
          } else {
            executeCommands(index + 1)
              .then(resolve)
              .catch(reject);
          }
        });
      });
    }
    await executeCommands(0);
  };

  static checkLogin = async () => {
    try {
      await this.injectWeChat();
      const response: AxiosResponse<LoginResponse> = await axios.post(
        'http://0.0.0.0:19088/api/?type=0',
      );

      if (response && response.data) {
        return response.data;
      }
      throw new Error('No response from API');
    } catch (error: any) {
      console.log('Error Connection');
      return { error: 'Error connecting to API' };
    }
  };

  static hookMessage = async (
    hookSettings: HookSettings,
  ): Promise<HookResponse | { error: string }> => {
    try {
      // Construct Request Body
      const requestBody = {
        port: hookSettings.port,
        ip: hookSettings.ip,
        url: hookSettings.url,
        timeout: hookSettings.timeout,
        enableHttp: hookSettings.enableHttp,
      };
      // Send POST request
      const response: AxiosResponse<HookResponse> = await axios.post(
        'http://0.0.0.0:19088/api/?type=9', // Hook API Address
        requestBody,
      );

      // Check Response
      if (response && response.data) {
        return response.data;
      }
      throw new Error('No response from API');
    } catch (error: any) {
      return { error: error.message || 'Error connecting to API' };
    }
  };

  static sendMsg = async (
    messageinfo: SendMsgHookSettings,
  ): Promise<SendMsgHookResponse | { error: string }> => {
    try {
      // Construct Body
      const requestBody = {
        wxid: messageinfo.wxid,
        msg: messageinfo.msg,
      };

      const response: AxiosResponse<SendMsgHookResponse> = await axios.post(
        'http://0.0.0.0:19088/api/?type=2',
        requestBody,
      );

      // Check Response
      if (response && response.data) {
        return response.data;
      }
      throw new Error('No response from API');
    } catch (error: any) {
      return { error: error.message || 'Error connecting to API' };
    }
  };
}
