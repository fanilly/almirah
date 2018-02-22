// pages/messages/messages.js
const app = getApp();
let flag = false;
Page({

  data: {
    lists:[],
    loadingStatus:'正在加载中...'
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.request({
      url: `${app.globalData.api}/message/get_message`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        console.log(res);
        if (res.data.data) {
          this.setData({
            lists: res.data.data,
            loadingStatus:'没有更多消息了'
          });
          flag = true;
        }
      }
    });
  },

  onUnload(){
    console.log(1);
    app.globalData.hasNewMsg = false;
    wx.request({
      url: `${app.globalData.api}/message/read_message`,
      data: {
        userId: app.globalData.userID
      },
      success:res=>{
        console.log('--------------');
        console.log(res);
      }
    });
  }


});
