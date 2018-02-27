const app = getApp();
Page({
  data: {
  },

  onLoad(options) {

  },

  //表单提交事件
  handlePayment(e) {
    wx.showLoading({
      title: '提交中'
    });
    wx.request({
      url: `${app.globalData.api}/vip/buy`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        let data = res.data;
        wx.requestPayment({
          timeStamp: data.timeStamp.toString(),
          nonceStr: data.nonceStr,
          paySign: data.paySign,
          package: data.package,
          signType: 'MD5',
          success: res => {
            console.log(res);
            if (res.errMsg == 'requestPayment:ok') {
              wx.showToast({
                title: '成功',
                image: '../../images/success.png',
                duration: 1500
              });
            }
          },
          fail: res => {
            console.log(res);
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '取消支付',
                image: '../../images/warning.png',
                duration: 1500
              });
              this.handleHideBuyLayer();
            }
          }
        });
      }
    });
  }
});
