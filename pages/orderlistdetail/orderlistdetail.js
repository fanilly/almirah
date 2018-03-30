// pages/lOrderDetail/lOrderDetail.js
const app = getApp();
let shopId, flag, orderId;
Page({
  data: {
    showTime: false,
    time: '',
    msg: '',
    baseUrl: app.globalData.baseUrl,
    totalGoods: 0,
    loaded: false,
    isvip: app.globalData.isVIP,
    loadingStatus: '努力加载中...',
    content: {}
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      isVIP: app.globalData.isVIP
    });
    wx.request({
      url: `${app.globalData.api}/order/order_info`,
      data: {
        orderId: options.orderId
      },
      success: res => {
        console.log(res);
        if (res.data.status == 1) {
          let data = res.data.data,
            i = 0,
            totalGoods = 0,
            msg = '';
          for (let i = 0; i < data.goodsList.length; i++) {
            totalGoods += parseInt(data.goodsList[i].goodsNums);
          }

          this.setData({
            content: data,
            loaded: true,
            totalGoods,
            msg
          });

          console.log(this.data.content)

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
  }
});
