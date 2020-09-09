// models/request.ts

import { CoreOptions } from 'request'

export interface CrawlerOptions extends CoreOptions {
  url: string;
  proxy?: any;
  timeout?: number;
  headers?: Headers;
}