// index.ts

import fs from 'fs'
import cheerio from 'cheerio'

import CrawlerRequest from './utils/request'
// /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g
// 多行注释:  /(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g
// 单行注释:  /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g

export default class Proxy {
  constructor() {

  }

  async start() {
    let list: Array<string> = new Array()
    for (let i = 1; i < 10; i++) {
      const body: string = await new CrawlerRequest().get({
        url: `https://ip.jiangxianli.com/?page=${i}`
      })

      const $: any = cheerio.load(body)
      let $list: any = $('#paginate').prev('.layui-form').children('.layui-table').children('tbody').children('tr')
      if ($list.length) {
        $list.each((i: number) => {
          const url = $list.eq(i).children('td').eq(10).children('button').eq(1).attr('data-url')
          if (!list.includes(url))
            list.push(url)
        })
      }
    }
    fs.writeFileSync('./src/data/proxy.json', JSON.stringify(list))
  }
}