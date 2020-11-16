// utils/http.ts

import http from 'http'
import https from 'https'
import url from 'url'
import ProxyAgent from 'proxy-agent'

import { ClientRequestArgs } from 'http'

import { CrawlerOptions } from '../models/request'
import uaList from '../data/pcUa.json'

// https://jsonplaceholder.typicode.com/albums/1
// https://api.ipify.org/?format=jso

export default class CrawlerHttp {
  constructor() {
  }

  /**
   * 请求
   * @param options
   */
  static request(options: CrawlerOptions): Promise<any> {
    const endpoint: string = options.url
    if (!endpoint) {
      return Promise.reject({ code: 10001, msg: 'url Can not be empty' })
    }
    const opts: any = url.parse(endpoint)

    opts.method = options.method ? options.method.toUpperCase() : 'GET'
    opts.timeout = options.timeout || 1500

    if (options.proxy) {
      console.log('using proxy server %j', options.proxy)
      opts.agent = new ProxyAgent(options.proxy)
    }

    opts.headers = Object.assign({}, options.headers, { 'Connection': 'keep-alive', 'User-Agent': uaList[Math.floor(Math.random() * uaList.length)] })
    if (opts.protocol === 'http:') return this.httpRequest(opts)
    if (opts.protocol === 'https:') return this.httpsRequest(opts)
  }

  /**
   * http请求
   * @param options
   */
  static httpRequest(options: ClientRequestArgs): Promise<any> {
    console.log(options)
    return new Promise((resolve, reject) => {
      http.request(options, (response: any) => {
        if (response.statusCode === 200) {
          response.setEncoding('utf-8')
          let rawData: string = ''
          response.on('data', (chunk: string) => { rawData += chunk })
          response.on('end', () => {
            try {
              resolve(rawData)
              response.end()
            } catch (e) {
              console.error(e.message);
              reject(e)
            }
          })
        }
        else {
          reject({ code: response.statusCode, mgs: response.statusMessage })
        }
      }).on('error', (e) => {
        console.error(`出现错误: ${e.message}`)
        reject(e)
      })

    })
  }

  /**
   * https请求
   * @param options
   */
  static httpsRequest(options: ClientRequestArgs): Promise<any> {
    return new Promise((resolve, reject) => {
      https.request(options, (response: any) => {
        if (response.statusCode === 200) {
          let rawData: string = ''
          response.on('data', (chunk: string) => { rawData += chunk })
          response.on('end', () => {
            try {
              resolve(rawData)
            } catch (e) {
              console.error(e.message);
              reject(e)
            }
          })
        }
        else {
          reject({ code: response.statusCode, mgs: response.statusMessage })
        }
      }).on('error', (e) => {
        console.error(`出现错误: ${e.message}`)
        reject(e)
      })
    })
  }
}