// pages/commission/commission.js
const app = getApp();
Page({

  data: {
    loadingStatus: 1, //1加载中 2无数据 3加载完成
    lists: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.request({
      url: `${app.globalData.api}/user/commissionFrom`,
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
