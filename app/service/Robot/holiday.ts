import axios from './axios';
import * as moment from 'moment';

const FORMATDAY = 'YYYYMMDD';
export default class Holiday {
  date = {};

  async getData(day: any = moment().format(FORMATDAY)) {
    //https://www.mxnzp.com/doc/detail?id=1
    //    {
    //     "code": 1,
    //     "msg": "数据返回成功",
    //     "data": {
    //         "date": "2018-11-21",
    //         "weekDay": 3,
    //         "yearTips": "戊戌",
    //         "type": 0,
    //         "typeDes": "工作日",
    //         "chineseZodiac": "狗",
    //         "solarTerms": "立冬后",
    //         "avoid": "嫁娶.安葬",
    //         "lunarCalendar": "十月十四",//农历日期
    //         "suit": "破屋.坏垣.祭祀.余事勿取",
    //         "dayOfYear": 325,
    //         "weekOfYear": 47,
    //         "constellation": "天蝎座",
    //         "indexWorkDayOfMonth": 1,//如果当前是工作日 则返回是当前月的第几个工作日，否则返回0 如果ignoreHoliday参数为true，这个字段不返回
    //     }
    // }
    const res: any = await axios.get(
      'https://www.mxnzp.com/api/holiday/single/' + day
    );

    this.date[day] = res?.data?.data;
    Object.keys(res.data.data).forEach((d) => {
      console.log('节假日数据:' + d + '====' + res.data.data[d]);
    });
  }
}
