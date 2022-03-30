import axios from 'axios';
import * as moment from 'moment';
import { getDailyDocument } from './acticle';
import Holiday from './holiday';
import { isProduction } from './utils';

// 部门机器人
const baseUrl =
  'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=732aa0d5-32a3-4e3a-9070-bb6d34025b35';
//日报机器人
const baseUrl2 = isProduction
  ? 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=800ac227-1193-4719-bc8d-b680e3c8cdd3'
  : baseUrl;
// 周报机器人
const baseUrl3 = isProduction
  ? 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=9c2b6bd8-9a5c-47f0-8af5-4d94060dd5be'
  : baseUrl;
// 起始日期，都是小周
const beginDate = '2021-10-20';
// 周几
const week = ['日', '一', '二', '三', '四', '五', '六'];
const HolidayInstance = new Holiday();
//日报
async function bookDaily() {
  const result = await axios.post(baseUrl2, {
    msgtype: 'text',
    text: {
      content: '亲，写日报和更新项目中心任务！12点截至哦！',
      mentioned_list: ['@all'], // 提醒所有人
    },
  });

  return result.data;
}
//
async function bookDailyEnd() {
  const result = await axios.post(baseUrl2, {
    msgtype: 'text',
    text: {
      content: '亲，请及时处理更新今天的项目中心任务哦！',
      mentioned_list: ['@all'], // 提醒所有人
    },
  });

  return result.data;
}
//
async function bookDailyOver() {
  const result = await axios.post(baseUrl2, {
    msgtype: 'text',
    text: {
      content: '亲，还有30分钟截止日报统计哦！',
      mentioned_list: ['@all'], // 提醒所有人
    },
  });

  return result.data;
}
async function bookLunch() {
  const result = await axios.post(baseUrl, {
    msgtype: 'text',
    text: {
      content: '大佬，订午餐啦！',
      mentioned_list: ['@all'], // 提醒所有人
    },
  });

  return result.data;
}

async function bookTaxi() {
  const result = await axios.post(baseUrl, {
    msgtype: 'text',
    text: {
      content: '[爱心]辛苦了，早点回家休息吧。9点打车可以报销哦。',
      mentioned_list: ['@all'],
    },
  });

  return result.data;
}

async function remindWeeklyReport(day) {
  const dayStr = week[day];
  const result = await axios.post(baseUrl3, {
    msgtype: 'text',
    text: {
      content:
        '亲，周' +
        dayStr +
        '了，记得写周报和增加项目中心饱和度，看看你这周有没偷懒！注意事项:周报需要有思考，收获，建议，复盘，风险点,请在5点前提交',
      mentioned_list: ['@all'],
    },
  });

  return result.data;
}

async function remindGoHome() {
  const result = await axios.post(baseUrl, {
    msgtype: 'text',
    text: {
      content: '11点半了，早点休息吧！',
    },
  });

  return result.data;
}

// 大小周
// day为小周
function isBigWeek() {
  const beginDay = moment(beginDate);
  const currentDay = moment(moment().format('YYYY-MM-DD'));
  const bday = beginDay.day() > 0 ? beginDay.day() : 7;
  return (
    Math.ceil(
      currentDay.diff(beginDay.subtract(bday - 1, 'days')) /
        (1000 * 60 * 60 * 24) /
        7
    ) %
      2 ===
    0
  );
}
// 是否周五/周六
function isFriday(day) {
  const friday = 5;
  // 没大小周了
  // if (isBigWeek()) {
  //   friday = 6;
  // }

  return day === friday;
}

// 是否工作日
function isWeekDay(day) {
  return (
    !isProduction ||
    (!isHoliday() && day > 0 && (isBigWeek() ? day <= 6 : day < 6))
  );
}

// 是否30分，多预留1分钟以防云函数延迟启动或执行
function isHalfHour(min) {
  return !isProduction || (min >= 30 && min <= 31);
}

// 是否正点，多预留1分钟以防云函数延迟启动或执行
function isSharp(min) {
  return !isProduction || (min >= 0 && min <= 1);
}
// 判断是否是节假日
function isHoliday() {
  const momentDate = moment().format('YYYYMMDD');
  return (
    !isProduction ||
    HolidayInstance?.date[momentDate]?.indexWorkDayOfMonth === 0
  );
}

export default async () => {
  const d = new Date(); // js 时间对象
  const day = d.getDay(); // 获取今天是星期几，0 表示周日
  const hour = d.getHours(); // 获取当前的 时
  const min = d.getMinutes(); // 获取当前的 分

  const hourGap = 8; // 咱们在东8区
  // hour += hourGap; // 获取当前准确的时间数

  // 打一下 log 看看具体时间
  console.log(
    `day: ${day} hour: ${hour} min: ${min} hourGap: ${hourGap}` + isProduction
  );
  const momentDate = moment().format('YYYYMMDD');
  if (!HolidayInstance.date[momentDate]) {
    await HolidayInstance.getData();
  }

  // 每周五3点到3点半通知写周报
  if (isFriday(day) && hour === 15 && isSharp(min)) {
    return await remindWeeklyReport(day);
  }
  //工作日每天10点提醒写日报
  if (isWeekDay(day) && hour === 10 && isSharp(min)) {
    return await bookDaily();
  }
  //工作日每天12点提醒日报截至
  if (isWeekDay(day) && hour === 11 && min >= 30 && min <= 31) {
    return await bookDailyOver();
  }
  //工作日每天5.30点提醒项目中心任务
  if (isWeekDay(day) && hour === 17 && isHalfHour(min)) {
    return await bookDailyEnd();
  }

  // 工作日每天10.30点提醒订餐
  if (isWeekDay(day) && hour === 10 && isHalfHour(min)) {
    return await bookLunch();
  }

  // 工作日每天晚上6点提醒打车可以报销
  if (isWeekDay(day) && hour === 18 && isSharp(min)) {
    return await bookTaxi();
  }

  // 工作日每天晚上11点半提醒休息
  if (isWeekDay(day) && hour === 23 && isHalfHour(min)) {
    return await remindGoHome();
  }
  // 每天晚上8点半推文
  if (hour === 8 && isHalfHour(min)) {
    return await getDailyDocument();
  }
  // await getDailyDocument();
  return 'hi tuya!';
};
