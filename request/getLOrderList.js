const app = getApp();
/**
 * [获取洗衣订单列表的数据]
 * @param  {[Object]} that [app 对象]
 * @return {[void]}      [无返回值]
 */
module.exports = (that, orderMark, fn1, fn2) => {
  let data = {
    userId: app.globalData.userID
  };
  if (orderMark) data.orderMark = orderMark;
  wx.request({
    url: `${app.globalData.api}/order/order_list`,
    data,
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
