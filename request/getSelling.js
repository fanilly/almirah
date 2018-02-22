const app = getApp();
/**
 * [在洗衣物与在售衣物的数据不同状态数据切换]
 * @param  {[Object]} that [Page 对象]
 * @param  {[Number]} num  [状态码]
 * @param  {[Function]} fn1  [无数据的回调函数]
 * @param  {[Function]} fn2  [有数据的回调函数]
 * @return {[void]}      [无返回值]
 */
module.exports = (that, num, fn1, fn2) => {
  wx.request({
    url: `${app.globalData.api}/goods/goods_list`,
    data: {
      userId: app.globalData.userID,
      goodsMark: num
    },
    success: res => {
      // 隐藏加载动画
      that.setData({
        startRefresh: false
      });
      if (!res.data || res.data.length <= 0) {
        if (fn1) fn1();
      } else {
        if (fn2) fn2(res.data);
      }
    }
  });
};
