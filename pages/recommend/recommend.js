// pages/recommend/recommend.js
const app = getApp();
Page({

  data: {
    loadingStatus: 1, //1加载中 2无数据 3加载完成
    lists: []
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

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.request({
      url: `${app.globalData.api}/user/myChildLevel`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        console.log(res);
        if (!res.data.data) {
          this.setData({
            loadingStatus: 2
          });
        } else {
          this.setData({
            loadingStatus: 3,
            lists: res.data.data
          });
        }
      }
    });
  }
});
