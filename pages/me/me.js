// pages/me/me.js
const app = getApp();
Page({
  data: {
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

  handleServices(){
    wx.request({
      url:`${app.globalData.api}/common/about`,
      data:{
        type:2
      },
      success:res=>{
        console.log(res);
      }
    });
  }
});
