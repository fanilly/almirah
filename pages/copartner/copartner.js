// pages/copartner/copartner.js
const app = getApp();

Page({


  data: {
    list: []
  },

  kindToggle(e) {

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
    wx.showLoading({ title: '加载中', mask: true });
    //登陆
    wx.request({
      url: `${app.globalData.api}/admin/csparter`,
      data: {
        userId: 44
      },
      success: res => {
        wx.hideLoading();
        let datas = res.data;
        this.setData({
          list: datas.data.list
        });
        console.log(this.data.list)
      }
    });

  }
});
