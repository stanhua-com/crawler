// index.ts

import fs from 'fs'
import cheerio from 'cheerio'

import CrawlerRequest from './utils/request'
import CrawlerAxios from './utils/axios'
// /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g
// 多行注释:  /(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g
// 单行注释:  /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g

import Proxy from './proxy'

class App {
  constructor() {

  }

  async start() {
    // await new Proxy().start()
    // const body: any = await new CrawlerRequest().get({
    //   url: `https://api.ipify.org/?format=jso`,
    //   proxy: 'http://163.177.151.76:80',
    //   timeout: 2000,
    // })
    // console.log(body)

    const body: any = await new CrawlerAxios().fetch({
      url: `http://www.tuling123.com/help/h_cent_webapi.jhtml?nav=doc`,
      timeout: 2000,
      proxy: {
        protocol: 'http',
        host: '163.177.151.76',
        port: 80
      }
    })
    console.log(body)

  }
}
new App().start()