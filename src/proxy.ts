// index.ts

import fs from 'fs'
import cheerio from 'cheerio'

import { ProxyModel } from './models/proxy'
import CrawlerRequest from './utils/request'
// /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g
// 多行注释:  /(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g
// 单行注释:  /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g
// https://www.kuaidaili.com/free/

export default class Proxy {
  constructor() {

  }

  /**
   * 开启
   */
  async start() {
    await this.fetch89ip()
    await this.fetchXiladaili('http')
    await this.fetchXiladaili('https')
    await this.fetchJiangxianli()

    this.separate()
  }

  /**
   * http和https分开
   */
  separate() {
    const proxys: any = fs.readFileSync('./src/data/proxy.json')
    let list: Array<ProxyModel> = JSON.parse(proxys)
    let http: Array<ProxyModel> = []
    let https: Array<ProxyModel> = []

    list.forEach((l: ProxyModel) => {
      if (l.type === 'HTTPS')
        https.push(l)
      else
        http.push(l)
    })

    fs.writeFileSync('./src/data/pHttp.json', JSON.stringify(http))
    fs.writeFileSync('./src/data/pHttps.json', JSON.stringify(https))
  }

  async fetchJiangxianli() {
    const proxys: any = fs.readFileSync('./src/data/proxy.json')
    let list: Array<ProxyModel> = JSON.parse(proxys)

    try {
      for (let i = 1; i < 6; i++) {
        const url: string = `https://ip.jiangxianli.com/?page=${i}`
        const body: string = await new CrawlerRequest().get({ url })

        const $: any = cheerio.load(body)
        let $list: any = $('#paginate').prev('.layui-form').children('.layui-table').children('tbody').children('tr')
        if ($list.length) {
          $list.each((i: number) => {
            const $td = $list.eq(i).children('td')
            let proxyModel: any = new Object()

            proxyModel.ip = $td.eq(0).text().trim()
            proxyModel.port = $td.eq(1).text().trim()
            if (list.findIndex((l: ProxyModel) => l.ip !== proxyModel.ip && l.port === proxyModel.port) === -1) {
              proxyModel.anonymity = $td.eq(2).text().trim()
              proxyModel.type = $td.eq(3).text().trim()
              proxyModel.loaction = $td.eq(4).text().trim()
              proxyModel.country = $td.eq(5).text().trim()
              proxyModel.operator = $td.eq(6).text().trim()
              proxyModel.speed = $td.eq(7).text().trim()
              proxyModel.surviveTime = $td.eq(8).text().trim()
              proxyModel.verificationTime = $td.eq(9).text().trim()

              list.push(proxyModel)
            }
          })
        }

        console.log(`request ${url} complete.`)
      }
      fs.writeFileSync('./src/data/proxy.json', JSON.stringify(list))

    } catch (error) {
      fs.writeFileSync('./src/data/proxy.json', JSON.stringify(list))
    }
  }

  async fetch89ip() {
    const proxys: any = fs.readFileSync('./src/data/proxy.json')
    let list: Array<ProxyModel> = JSON.parse(proxys)

    try {
      for (let i = 1; i < 31; i++) {
        const url: string = `https://www.89ip.cn/index_${i}.html`
        const body: string = await new CrawlerRequest().get({ url })

        const $: any = cheerio.load(body)
        let $list: any = $('.layui-table').children('tbody').children('tr')

        if ($list.length) {
          $list.each((i: number) => {
            const $td = $list.eq(i).children('td')
            let proxyModel: any = new Object()

            proxyModel.ip = $td.eq(0).text().trim()
            proxyModel.port = $td.eq(1).text().trim()
            if (list.findIndex((l: ProxyModel) => l.ip !== proxyModel.ip && l.port === proxyModel.port) === -1) {
              proxyModel.anonymity = '透明'
              proxyModel.type = 'HTTP'
              proxyModel.loaction = $td.eq(2).text().trim()
              proxyModel.country = '中国'
              proxyModel.operator = $td.eq(3).text().trim()
              proxyModel.verificationTime = $td.eq(4).text().trim()

              list.push(proxyModel)
            }
          })
        }

        console.log(`request ${url} complete.`)
      }

      fs.writeFileSync('./src/data/proxy.json', JSON.stringify(list))
    } catch (error) {
      fs.writeFileSync('./src/data/proxy.json', JSON.stringify(list))
    }
  }

  async fetchXiladaili(type: string) {
    const proxys: any = fs.readFileSync('./src/data/proxy.json')
    let list: Array<ProxyModel> = JSON.parse(proxys)

    try {
      for (let i = 1; i < 31; i++) {
        const url: string = `http://www.xiladaili.com/${type}/${i}/`
        const body: string = await new CrawlerRequest().get({ url })

        const $: any = cheerio.load(body)
        let $list: any = $('.table-responsive').children('table').children('tbody').children('tr')
        if ($list.length) {
          $list.each((i: number) => {
            const $td = $list.eq(i).children('td')
            let proxyModel: any = new Object()
            let ip: Array<string> = $td.eq(0).text().trim().split(':')
            proxyModel.ip = ip[0]
            proxyModel.port = ip[1]
            if (list.findIndex((l: ProxyModel) => l.ip !== proxyModel.ip && l.port === proxyModel.port) === -1) {
              let loaction: Array<string> = $td.eq(3).text().trim().split(' ')
              proxyModel.anonymity = $td.eq(2).text().trim().replace('代理服务', '')
              proxyModel.type = type.toUpperCase()
              proxyModel.country = loaction.shift()
              proxyModel.operator = loaction.pop()
              proxyModel.loaction = loaction.join(' ')
              proxyModel.speed = $td.eq(4).text().trim() + '秒'
              proxyModel.surviveTime = $td.eq(5).text().trim()
              proxyModel.verificationTime = $td.eq(6).text().trim()

              list.push(proxyModel)
            }
          })
        }

        console.log(`request ${url} complete.`)
      }

      fs.writeFileSync('./src/data/proxy.json', JSON.stringify(list))
    } catch (error) {
      fs.writeFileSync('./src/data/proxy.json', JSON.stringify(list))
    }
  }
}