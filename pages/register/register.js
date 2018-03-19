const app = getApp();
Page({
  data: {
    isVIP: true
  },

  onLoad(options) {
    this.setData({
      isVIP: app.globalData.isVIP
    });
    console.log(app.globalData);
  },

  //表单提交事件
  handlePayment(e) {
    if (!this.data.isVIP) {
      wx.showLoading({
        title: '提交中'
      });
      wx.request({
        url: `${app.globalData.api}/vip/buy`,
        data: {
          userId: app.globalData.userID
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
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
                  image: '../../assets/success.png',
                  duration: 1500
                });
                app.globalData.isVIP = true;
                //获取用户信息
                wx.showLoading({
                  title: '状态更新'
                });
                wx.request({
                  url: `${app.globalData.api}/user/user_info`,
                  data: {
                    userId: app.globalData.userID
                  },
                  success: res => {
                    wx.hideLoading();
                    app.globalData.commission = res.data.data;
                    //跳转到首页
                    wx.switchTab({
                      url: '/pages/index/index'
                    });
                  }
                });
              }
            },
            fail: res => {
              console.log(res);
              if (res.errMsg == 'requestPayment:fail cancel') {
                wx.showToast({
                  title: '取消支付',
                  image: '../../assets/warning.png',
                  duration: 1500
                });
              }
            }
          });
        }
      });
    }

  }
});
