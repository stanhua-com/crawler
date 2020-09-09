// index.ts

import cheerio, { html } from 'cheerio'

import CrawlerRequest from './utils/request'

class App {
  constructor() {

  }

  async start() {
    let list: Array<string> = new Array()
    for (let i = 1; i < 10; i++) {
      const body: string = await new CrawlerRequest().get({
        url: `https://ip.jiangxianli.com/?page=${i}`,
        proxy:'http://83.97.23.90:18080'
      })

      const $: any = cheerio.load(body)
      let $list: any = $('#paginate').prev('.layui-form').children('.layui-table').children('tbody').children('tr')
      if ($list.length) {
        $list.each((i: number) => {
          list.push($list.eq(i).children('td').eq(10).children('button').eq(1).attr('data-url'))
        })
      }
    }
    console.log(list)
  }
}

new App().start()