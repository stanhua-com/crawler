// utils/axios.ts

import axios from 'axios'
import tunnel from 'tunnel'

import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { AxiosModel } from '../models/axios'

import pcUaList from '../data/pcUa.json'
import mUaList from '../data/mUa.json'

import pHttpList from '../data/pHttp.json'
import pHttpsList from '../data/pHttps.json'

// https://jsonplaceholder.typicode.com/albums/1
// https://api.ipify.org/?format=jso

export default class CrawlerAxios {

  constructor() {
    // http request 拦截器
    axios.interceptors.request.use((config: AxiosRequestConfig) => {
      config.withCredentials = true
      return config
    }, (err) => {
      return Promise.reject(err)
    })

    // http response 拦截器
    axios.interceptors.response.use((res: AxiosResponse) => {
      if (res.status === 200) {
        return res.data
      }
      return Promise.reject(res.data)
    }, (err) => {
      return Promise.reject(err)
    })

  }


  /**
   * 请求
   */
  fetch(options: AxiosRequestConfig, otherOptions?: AxiosModel) {
    let count = Math.random()
    let uaList = pcUaList

    if (otherOptions) {
      if (otherOptions.device === 'h5')
        uaList = mUaList

      // 开启代理
      if (otherOptions.proxy) {
        options.timeout = 3000

        if (options.url && options.url.toLowerCase().indexOf('https://') > -1) {
          const proxy: any = pHttpsList[Math.floor(count * pHttpsList.length)]
          console.log(proxy)

          options.httpsAgent = tunnel.httpsOverHttps({
            proxy: {
              host: proxy.ip,
              port: proxy.port,
              headers: {
                'User-Agent': uaList[Math.floor(count * uaList.length)]
              }
            }
          })
        }
        else {
          const proxy: any = pHttpsList[Math.floor(count * pHttpsList.length)]

          console.log(proxy)

          options.httpsAgent = tunnel.httpOverHttps({
            proxy: {
              host: proxy.ip,
              port: proxy.port,
              headers: {
                'User-Agent': uaList[Math.floor(count * uaList.length)]
              }
            }
          })
        }
      }
    }

    options.headers = Object.assign({}, options.headers, { 'User-Agent': uaList[Math.floor(count * uaList.length)] })

    return axios(options)
  }
}