import fs from 'fs';

import { StationInfo } from './interfaces/StationInfo';

export default class Station {
  list: Array<StationInfo>;
  constructor() {
    this.list = JSON.parse(fs.readFileSync('./station.json', 'utf-8'));
  }

  /**
   * 过滤车站
   * @param  name  拼音
   */
  filter(name: string) {
    if (!name) return this.list;
    return this.list.filter(
      l =>
        l.pinyin.toLowerCase().indexOf(name.toLowerCase()) > -1 ||
        l.short.toLowerCase().indexOf(name.toLowerCase()) > -1
    );
  }
}
