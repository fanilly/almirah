// pages/qrcode/qrcode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    url: '',
    userInfo: ''
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    this.setData({
      money: app.globalData.commission.money,
      userInfo: app.globalData.userInfo,
      url: `${app.globalData.baseUrl}${app.globalData.commission.rqcode}`
    });
  },

  //提现
  handleTiXian() {
    if (!app.globalData.commission.phone) {
      wx.showModal({
        content: '请先绑定手机号',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url:'../bindphone/bindphone'
            });
          }
        }
      });
    } else {
      if (this.data.money * 1 <= 0) {
        wx.showToast({
          title: '金币不足',
          image: '../../assets/warning.png',
          duration: 1500
        });
      } else {
        wx.request({
          url: `${app.globalData.api}/commission/tixian`,
          data: {
            userId: app.globalData.userID,
            money: this.data.money
          },
          success: res => {
            if (res.data.status == 1) {
              wx.showModal({
                content: '恭喜您，提现成功，提现金额会在24小时之内下发到您的账户，请注意查收',
                showCancel: false
              });
              this.setData({
                money: 0.00
              });
              app.globalData.commission.money = 0.00;
            } else {
              wx.showToast({
                title: '网络异常',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }
          },
          fail() {
            wx.showToast({
              title: '网络异常',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        });
      }
    }

  }
});
