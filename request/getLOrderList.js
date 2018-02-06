const app = getApp();
/**
 * [获取洗衣订单列表的数据]
 * @param  {[Object]} that [app 对象]
 * @return {[void]}      [无返回值]
 */
module.exports = (that,orderMark) => {
  that.setData({
    hasOrderList: 1
  });
  wx.request({
    url: `${app.globalData.api}/order/order_list`,
    data: {
      userId: app.globalData.userID,
      orderMark: orderMark || ''
    },
    success: res => {
      console.log(res);
      if (res.data) {
        that.setData({
          lists: res.data,
          hasOrderList: 2
        });
      } else {
        that.setData({
          hasOrderList: 3
        });
      }
    }
  });
};
