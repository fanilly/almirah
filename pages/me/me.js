// pages/me/me.js
const app = getApp();
Page({
  data: {
    isVip:app.globalData.isVip,
    commission:app.globalData.commission,
    hasNewMsg: app.globalData.hasNewMsg,
    nickName: '',
    avatarUrl: ''
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl
    });
  },

  // 生命周期函数--监听页面显示
  onShow() {
    this.setData({
      hasNewMsg: app.globalData.hasNewMsg
    });
  },

  //跳转至分享二维码页面
  handleGoToQRcode(){
    wx.navigateTo({
      url:'../qrcode/qrcode'
    });
  },

  //联系客服
  handleServices(){
    wx.showLoading();
    wx.request({
      url: `${app.globalData.api}/common/about`,
      data:{
        type:2
      },
      success: res => {
        wx.hideLoading();
        wx.makePhoneCall({
          phoneNumber: res.data.data.articleContent
        });
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '客服繁忙！',
          image: '../../images/warning.png',
          duration: 2000
        });
      }
    });
  }
});
