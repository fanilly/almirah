// pages/about/about.js
const app = getApp();
Page({

  data: {
    settings: null
  },

  onLoad(options) {
    this.setData({
      settings: app.globalData.SETTINGS
    });
    console.log(app.globalData.SETTINGS)
  },
  //分享
  onShareAppMessage(res) {
    return {
      title: '净衣客',
      path: `/pages/index/index?recommendId=${app.globalData.userID}`,
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail');
      }
    };
  },
})
