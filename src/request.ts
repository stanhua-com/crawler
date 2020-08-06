import fs from 'fs';
import https from 'https';
import querystring from 'querystring';

import { TicketParam, TrainParam } from './types';

// https://kyfw.12306.cn/otn/leftTicket/queryA?leftTicketDTO.train_date=2020-01-13&leftTicketDTO.from_station=CSQ&leftTicketDTO.to_station=XUG&purpose_codes=ADULT
// https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=6i0000G63408&from_station_telecode=IOQ&to_station_telecode=XBG&depart_date=2019-12-18
// https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?train_no=6i0000G63409&from_station_no=01&to_station_no=11&seat_types=OM9&train_date=2020-01-16
// https://www.12306.cn/index/otn/zwdch/queryCC (post:train_station_code)
// https://www.12306.cn/index/script/core/json/weather_station.json

export default class Request {
  constructor() {}

  /**
   * get请求
   * @param path url地址
   */
  get(path: string) {
    console.log(path);
    return new Promise((resolve, reject) => {
      https
        .get(
          {
            hostname: 'kyfw.12306.cn',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
              Host: 'kyfw.12306.cn',
              Connection: 'keep-alive',
              Referer: 'https://kyfw.12306.cn/otn/leftTicket/init',
              'If-Modified-Since': 0,
              'X-Requested-With': 'XMLHttpRequest',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36',
              Cookie:
                'JSESSIONID=D479D6D949976BEB46B4D754A53A05D7; _jc_save_wfdc_flag=dc; RAIL_EXPIRATION=1576763178328; RAIL_DEVICEID=BR4Oxd61S0WWuRxJFaTx8KBGyt6vdVNBc6jETQjmQLL5eWzFrZyj6-GU4fDOCdGDguTp4OyFKYHQ2XX8MmyLYog2-eeMc3lhDK6i0I1PuLWn-4f63ONWqp67QeJdmZWbP4RMmcewmyWbiwsRu-EjgFjdzCwiIebm; _jc_save_toStation=%u65B0%u4F59%2CXUG; BIGipServerotn=2698445066.64545.0000; BIGipServerpassport=937951498.50215.0000; route=9036359bb8a8a461c164a04f8f50b252; _jc_save_fromStation=%u6DF1%u5733%2CSZQ; _jc_save_toDate=2019-12-17; BIGipServerportal=3084124426.16671.0000; _jc_save_fromDate=2019-12-18'
            }
          },
          res => {
            let data = '';
            res.on('data', function(buff) {
              data += buff;
            });
            res.on('end', () => {
              resolve(data ? JSON.parse(data) : '');
            });
          }
        )
        .on('error', e => {
          reject(e);
        });
    });
  }

  /**
   * oost请求
   * @param data
   */
  post(data?: any) {
    console.log(data);
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'www.12306.cn',
          port: 443,
          path: '/index/otn/zwdch/queryCC',
          method: 'POST',
          headers: {
            Host: 'www.12306.cn',
            Connection: 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            Referer: 'https://kyfw.12306.cn/otn/leftTicket/init',
            'If-Modified-Since': 0,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36',
            Cookie:
              'JSESSIONID=D479D6D949976BEB46B4D754A53A05D7; _jc_save_wfdc_flag=dc; RAIL_EXPIRATION=1576763178328; RAIL_DEVICEID=BR4Oxd61S0WWuRxJFaTx8KBGyt6vdVNBc6jETQjmQLL5eWzFrZyj6-GU4fDOCdGDguTp4OyFKYHQ2XX8MmyLYog2-eeMc3lhDK6i0I1PuLWn-4f63ONWqp67QeJdmZWbP4RMmcewmyWbiwsRu-EjgFjdzCwiIebm; _jc_save_toStation=%u65B0%u4F59%2CXUG; BIGipServerotn=2698445066.64545.0000; BIGipServerpassport=937951498.50215.0000; route=9036359bb8a8a461c164a04f8f50b252; _jc_save_fromStation=%u6DF1%u5733%2CSZQ; _jc_save_toDate=2019-12-17; BIGipServerportal=3084124426.16671.0000; _jc_save_fromDate=2019-12-18'
          }
        },
        res => {
          res.on('data', function(buff) {
            resolve(JSON.parse(buff.toString()));
          });
        }
      );

      req.on('error', e => {
        reject(e);
      });
      req.write(querystring.stringify(data));
      req.end();
    });
  }

  /**
   * 查询票列表
   * @param options 票参数
   */
  queryTicket(options: TicketParam) {
    return new Promise((resolve, reject) => {
      this.get(
        `/otn/leftTicket/queryA?leftTicketDTO.train_date=${options.train_date}&leftTicketDTO.from_station=${options.from_station}&leftTicketDTO.to_station=${options.to_station}&purpose_codes=${options.purpose_codes}`
      )
        .then((json: any) => {
          if (json.httpstatus === 200) {
            resolve(
              json.data.result.map((l: string) => {
                let s = l.split('|');
                return {
                  train_secret: s[0],
                  train_state: s[1],
                  train_no: s[2],
                  station_train_code: s[3],
                  start_station_telecode: s[4],
                  end_station_telecode: s[5],
                  from_station_telecode: s[6],
                  form_station_name: json.data.map[s[6]],
                  to_station_telecode: s[7],
                  to_station_name: json.data.map[s[7]],
                  start_time: s[8],
                  arrive_time: s[9],
                  use_time: s[10],
                  canWebBuy: s[11],
                  yp_info: s[12],
                  start_train_date: s[13],
                  train_seat_feature: s[14],
                  location_code: s[15],
                  from_station_no: s[16],
                  to_station_no: s[17],
                  is_support_card: s[18],
                  controlled_train_flag: s[19],

                  gg_num: s[20] ? s[20] : '--',
                  // 高级软卧
                  gr_num: s[21] ? s[21] : '--',
                  // 其他
                  qt_num: s[22] ? s[22] : '--',
                  // 软卧
                  rw_num: s[23] ? s[23] : '--',
                  // 软座
                  rz_num: s[24] ? s[24] : '--',
                  tz_num: s[25] ? s[25] : '--',
                  // 无座
                  wz_num: s[26] ? s[26] : '--',
                  yb_num: s[27] ? s[27] : '--',
                  // 硬卧
                  yw_num: s[28] ? s[28] : '--',
                  // 硬座
                  yz_num: s[29] ? s[29] : '--',
                  // 二等座
                  ze_num: s[30] ? s[30] : '--',
                  // 一等座
                  zy_num: s[31] ? s[31] : '--',
                  // 商务座
                  swz_num: s[32] ? s[32] : '--',
                  // 动卧
                  srrb_num: s[33] ? s[33] : '--',
                  yp_ex: s[34],
                  seat_types: s[35],
                  exchange_train_flag: s[36],
                  train_date: options.train_date
                };
              })
            );
            return;
          }
          resolve([]);
        })
        .catch(err => {
          reject(err);
          console.log(err);
        });
    });
  }

  /**
   * 查询车次列表
   * @param options 车次参数
   */
  queryByTrainNo(options?: TrainParam) {
    return new Promise((resolve, reject) => {
      this.get(
        `/otn/czxx/queryByTrainNo?train_no=${options.train_no}&from_station_telecode=${options.from_station_telecode}&to_station_telecode=${options.to_station_telecode}&depart_date=${options.depart_date}`
      )
        .then((res: any) => {
          if (res.httpstatus === 200) {
            resolve(res.data.data);
            return;
          }
          resolve([]);
        })
        .catch(err => {
          reject(err);
          console.log(err);
        });
    });
  }

  /**
   * 查询座位金额
   * @param options 车次参数
   */
  queryTicketPrice(options?: TrainParam) {
    return new Promise((resolve, reject) => {
      this.get(
        `/otn/leftTicket/queryTicketPrice?train_no=6i0000G63409&from_station_no=01&to_station_no=11&seat_types=OM9&train_date=2020-01-16`
      )
        .then((res: any) => {
          if (res.httpstatus === 200) {
            resolve(res.data);
            return;
          }
          resolve([]);
        })
        .catch(err => {
          reject(err);
          console.log(err);
        });
    });
  }
}
