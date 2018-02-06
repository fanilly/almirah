// pages/washRecord/washRecord.js
const app = getApp();
Page({

  data: {
    hasOrderList: 1, //1.加载中 2.隐藏 3.无订单数据
    lists: []
  },


  // 生命周期函数--监听页面加载

  onLoad(options) {
    wx.request({
      url: `${app.globalData.api}/order/order_list`,
      data: {
        userId: app.globalData.userID,
        orderMark: 2
      },
      success: res => {
        console.log(res);
        if (res.data) {
          this.setData({
            lists: res.data,
            hasOrderList: 2
          });
        } else {
          this.setData({
            hasOrderList: 3
          });
        }
      }
    });
  },

  //删除订单
  handleDelOrder(){

  },

  // 生命周期函数--监听页面显示
  onShow() {

  }
});
