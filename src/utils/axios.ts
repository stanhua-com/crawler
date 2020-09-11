// utils/axios.ts

import axios from 'axios'

import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { CrawlerOptions } from '../models/request'

import uaList from '../data/ua.json'

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
  fetch(options: AxiosRequestConfig) {
    options.headers = Object.assign({}, options.headers, { 'User-Agent': uaList[Math.floor(Math.random() * uaList.length)] })
    console.log(options)
    return axios(options)
  }
}