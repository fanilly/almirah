// pages/lOrderDetail/lOrderDetail.js
const app = getApp();
Page({
  data: {
    loaded: false,
    loadingStatus: '努力加载中...',
    content: {}
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    wx.request({
      url: `${app.globalData.api}/order/order_info`,
      data: {
        orderId: options.orderId
      },
      success: res => {
        console.log(res);
        if (res.data.status == 1) {
          this.setData({
            content: res.data.data,
            loaded: true
          });
        } else {
          this.setData({
            loadingStatus: '网络异常~~'
          });
        }
      },
      fail: () => {
        this.setData({
          loadingStatus: '网络异常~~'
        });
      }
    });
  },

  //生命周期函数--监听页面显示
  onShow: function() {

  }
});
