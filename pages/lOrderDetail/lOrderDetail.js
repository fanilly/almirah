// pages/lOrderDetail/lOrderDetail.js
const app = getApp();
Page({
  data: {
    totalGoods: 0,
    loaded: false,
    loadingStatus: '努力加载中...',
    content: {}
  },

  //打电话给商家
  handleCallTel(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.content.shopTel
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      isVIP:app.globalData.isVIP
    });
    console.log(options.orderId);
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
            totalGoods = 0;
          for (let i = 0; i < data.goodsList.length; i++) {
            totalGoods += parseInt(data.goodsList[i].goodsNums);
          }
          this.setData({
            content: res.data.data,
            loaded: true,
            totalGoods
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
