import { Subscription } from "egg";
import robot from "../service/Robot";
export default class robotSub extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: "2m", // 2 分钟间隔
      type: "worker", // 指定一个 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    robot();
  }
}
