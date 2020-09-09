// utils/request.ts

import request from 'request'

import { Response } from 'request'

import { CrawlerOptions } from '../models/request'

export default class CrawlerRequest {
  public request: any = request
  constructor() {

  }

  /**
   * get请求
   * @param options
   */
  public get(options: CrawlerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      request.get(options.url, options, (err: any, res: Response, body: any) => {
        console.log(err)
        if (err) {
          reject({ code: 0, msg: err })
        }
        else {
          if (res.statusCode === 200) resolve(body)
          else reject({ code: 10001, msg: res })
        }
      })
    })
  }

  /**
   * post请求
   * @param options
   */
  public post(options: CrawlerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post(options, (err: any, res: Response, body: any) => {
        if (err) reject({ code: 0, msg: err })
        if (res.statusCode === 200) resolve(body)
        else reject({ code: 10001, msg: res })
      })
    })
  }
}