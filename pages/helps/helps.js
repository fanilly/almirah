// pages/helps/helps.js
const app = getApp();
Page({
  data: {
    lists: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // common/articleList
    wx.request({
      url: `${app.globalData.api}/common/articleList`,
      data: {
        type: 2
      },
      success: res => {
        this.setData({
          lists: res.data.data
        });
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '网络繁忙！',
          image: '../../assets/warning.png',
          duration: 2000
        });
      }
    });
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

  //生命周期函数--监听页面初次渲染完成
  onReady: function() {

  },

  //生命周期函数--监听页面显示

  onShow: function() {

  }
});
