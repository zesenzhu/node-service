import axios from "axios";
import { isProduction } from "./utils";

//文章日推
const baseUrl4 = isProduction
  ? "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7a8dbdcc-a22c-4ac2-b7cb-f68bd7ea9691"
  : "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=732aa0d5-32a3-4e3a-9070-bb6d34025b35";
// 掘金链接
const juejinDailyUrl =
  "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed?aid=2608&uuid=6966478186792093187";
// 需要排除的关键字
const needlessWord = ["掘金", "公告", "掘力计划", "「", "」"];
type ArticleType = {
  title: string;
  description: string;
  url: string;
  picurl: string;
};
type ArticlesType = ArticleType[];
// 获取今日推文
export async function getDailyDocument() {
  const result = await axios.post(juejinDailyUrl, {
    client_type: 2608,
    cursor: "0",
    id_type: 1,
    limit: 20,
    sort_type: 200,
  });
  const articles: ArticlesType = [];
  result?.data?.data instanceof Array &&
    result.data.data.some((c: any) => {
      const { item_type, item_info } = c;
      console.log(item_info);
      if (
        item_type === 2 && //为2才是文章
        item_info?.article_info &&
        articles.length <= 4 &&
        // item_info?.article_info?.link_url &&
        // item_info?.article_info?.title &&
        removeUnnecessaryItem(item_info?.article_info?.title)
      ) {
        const {
          brief_content, //文章内容
          title, //标题
          // view_count, //观看数
          // digg_count, //点赞数
          // comment_count, //评论数
          link_url, //链接
          article_id, //文章id
          cover_image, //图片
        } = item_info?.article_info;
        articles.push({
          title,
          description: brief_content || "",
          url: link_url || "https://juejin.cn/post/" + article_id,
          picurl: cover_image || "",
        });
      }
      if (articles.length > 4) {
        return true;
      }
      return false;
    });
  console.log(articles);
  if (articles.length > 0) {
    await axios.post(baseUrl4, {
      msgtype: "news",
      news: {
        articles,
      },
    });
  }

  return result.data;
}

function removeUnnecessaryItem(title: string) {
  return !needlessWord.some((c) => !!title?.includes(c));
}
