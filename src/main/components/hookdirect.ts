/* eslint-disable promise/no-promise-in-callback */
import axios, { AxiosResponse } from 'axios';
import * as sudo from 'sudo-prompt';
import * as path from 'path';
import fs from 'fs';
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
  hookOrUnhook: boolean;
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
interface SendImageHookSettings {
  wxid: string;
  imagePath: string;
}
interface SendMsgHookResponse {
  code: number;
  result: string;
}
interface SendImageHookResponse {
  code: number;
  result: string;
}
interface getMsgAttachmentHookResponse {
  code: number;
  result: string;
}

interface Contact {
  customAccount: string;
  delFlag: number;
  type: number;
  userName: string;
  verifyFlag: number;
  wxid: string;
}

interface ContactResponse {
  code: number;
  data: Contact[];
}
async function executeCommands(
  index: number,
  commands: string[],
  options: { name: string },
): Promise<void> {
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
        executeCommands(index + 1, commands, options)
          .then(resolve)
          .catch(reject);
      } else {
        executeCommands(index + 1, commands, options)
          .then(resolve)
          .catch(reject);
      }
    });
  });
}
export default class HookDirect {
  static installWeChat = async () => {
    const options = {
      name: 'Libre Chat WeChat',
    };
    const injectorPath = getInjectorPath();
    const WeChatInstallCommand = path.join(injectorPath, 'WeChat39223.exe');
    const commands = [WeChatInstallCommand];
    await executeCommands(0, commands, options);
  };

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

    await executeCommands(0, commands, options);
  };

  static antiWeChatUpgrade = async () => {
    const options = {
      name: 'Libre Chat WeChat',
    };
    const injectorPath = getInjectorPath();
    const antiUpgradeBatPath = path.join(injectorPath, 'antiUpgrade.bat');
    const startupPath =
      'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup';
    const antiUpgradeDestinationPath = path.join(
      startupPath,
      'antiUpgrade.bat',
    );
    const commands = [
      // `cmd /c "${antiUpgradeBatPath}"`,
      `copy /Y "${antiUpgradeBatPath}" "${antiUpgradeDestinationPath}"`,
      // `${inject2} --process-name WeChat.exe -i ${dllpath}`,
      // `${inject3} --process-name WeChat.exe -i ${dllpath}`,
    ];
    if (!fs.existsSync(antiUpgradeDestinationPath)) {
      await executeCommands(0, commands, options);
      return { result: true };
    }
    return { result: true };
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

  static sendImage = async (
    messageinfo: SendImageHookSettings,
  ): Promise<SendImageHookResponse | { error: string }> => {
    try {
      // Encrypt Image

      const requestBody = {
        wxid: messageinfo.wxid,
        filePath: messageinfo.imagePath,
      };
      console.log(requestBody);
      const response: AxiosResponse<SendImageHookResponse> = await axios.post(
        'http://0.0.0.0:19088/api/?type=6',
        requestBody,
      );
      console.log(response);
      // Check Response
      if (response && response.data) {
        return response.data;
      }

      throw new Error('No response from API');
    } catch (error: any) {
      return { error: error.message || 'Error connecting to API' };
    }
  };

  static getMsgAttachment = async (
    msgId: string,
  ): Promise<getMsgAttachmentHookResponse | { error: string }> => {
    try {
      // Construct Body
      const requestBody = {
        msgId,
      };
      console.log(requestBody);
      const response: AxiosResponse<getMsgAttachmentHookResponse> =
        await axios.post('http://0.0.0.0:19088/api/?type=56', requestBody);
      console.log(response);
      // Check Response
      if (response && response.data) {
        return response.data;
      }

      throw new Error('No response from API');
    } catch (error: any) {
      return { error: error.message || 'Error connecting to API' };
    }
  };

  static hookMessage = async (
    hookSettings: HookSettings,
  ): Promise<HookResponse | { error: string }> => {
    if (hookSettings.hookOrUnhook) {
      try {
        // Construct Request Body
        const requestBody = {
          port: hookSettings.port,
          ip: hookSettings.ip,
          url: hookSettings.url,
          timeout: hookSettings.timeout,
          enableHttp: hookSettings.enableHttp,
        };
        console.log(requestBody);
        // Send POST request
        const response: AxiosResponse<HookResponse> = await axios.post(
          'http://0.0.0.0:19088/api/?type=9', // Hook API Address
          requestBody,
        );

        // Check Response
        if (response && response.data) {
          console.log(response.data);
          return response.data;
        }

        throw new Error('No response from API');
      } catch (error: any) {
        return { error: error.message || 'Error connecting to API' };
      }
    } else {
      try {
        const requestBody = {};
        const response: AxiosResponse<HookResponse> = await axios.post(
          'http://0.0.0.0:19088/api/?type=10', // Hook API Address
          requestBody,
        );
        if (response && response.data) {
          return response.data;
        }
        throw new Error('No response from API');
      } catch (error: any) {
        return { error: error.message || 'Error connecting to API' };
      }
    }
  };

  static sendMsg = async (
    messageinfo: SendMsgHookSettings,
  ): Promise<SendMsgHookResponse | { error: string }> => {
    try {
      // Construct Body
      const requestBody = {
        wxid: messageinfo.wxid,
        msg: messageinfo.msg.toString(),
      };
      console.log(requestBody);
      const response: AxiosResponse<SendMsgHookResponse> = await axios.post(
        'http://0.0.0.0:19088/api/?type=2',
        requestBody,
      );
      console.log(response);
      // Check Response
      if (response && response.data) {
        return response.data;
      }

      throw new Error('No response from API');
    } catch (error: any) {
      return { error: error.message || 'Error connecting to API' };
    }
  };

  static getContactList = async (): Promise<
    ContactResponse | { error: string }
  > => {
    try {
      // Construct Body
      const requestBody = {};

      const response: AxiosResponse<ContactResponse> = await axios.post(
        'http://0.0.0.0:19088/api/?type=46',
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

  static getLoginInfo = async (): Promise<
    ContactResponse | { error: string }
  > => {
    try {
      // Construct Body
      const requestBody = {};

      const response: AxiosResponse<ContactResponse> = await axios.post(
        'http://0.0.0.0:19088/api/?type=1',
        requestBody,
      );
      console.log('Hook Login Info:', response);
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
