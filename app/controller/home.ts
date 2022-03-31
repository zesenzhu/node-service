import { Controller } from 'egg';
// 获取当前目录
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    // const file = require("fs");
    // const path = require("path");
    // ctx.body = file.readFileSync(
    //   path.join(__dirname, "../view/canvas/index.html"),
    //   "utf-8"
    // );
    ctx.body = '小宝测试';
    ctx.status = 200;
  }
}
