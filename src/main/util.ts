/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import * as isDev from 'electron-is-dev';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}
export function getInjectorPath() {
  const basePath = isDev
    ? path.resolve(__dirname, '../../assets/tools')
    : path.join(process.resourcesPath, 'assets/tools');
  return basePath;
}
