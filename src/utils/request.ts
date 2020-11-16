// utils/request.ts

import request from 'request'

import { Response } from 'request'

import { CrawlerOptions } from '../models/request'

import uaList from '../data/mUa.json'

// https://jsonplaceholder.typicode.com/albums/1
// https://api.ipify.org/?format=jso

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
      const url: string = options.url
      if (!url) {
        reject({ code: 10001, msg: 'url Can not be empty' })
        return
      }
      delete options.url

      options.headers = Object.assign({}, options.headers, { 'User-Agent': uaList[Math.floor(Math.random() * uaList.length)] })

      request.get(url, options, (err: any, res: Response, body: any) => {
        if (err) {
          console.log(err)
          reject({ code: 10001, msg: err })
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
      const url: string = options.url
      if (!url) {
        reject()
        return
      }
      delete options.url

      options.headers = Object.assign({}, options.headers, { 'User-Agent': uaList[Math.floor(Math.random() * uaList.length)] })

      request.post(url, options, (err: any, res: Response, body: any) => {
        if (err) reject({ code: 0, msg: err })
        if (res.statusCode === 200) resolve(body)
        else reject({ code: 10001, msg: res })
      })
    })
  }
}