// models/request.ts

import { CoreOptions } from 'request'

export interface CrawlerOptions extends CoreOptions {
  /**
   * 网址
   */
  url?: string;
  /**
   * 请求类型(GET,POST)
   */
  method?: string;
  /**
   * IP代理
   */
  proxy?: any;
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * 请求头部信息
   */
  headers?: any
}