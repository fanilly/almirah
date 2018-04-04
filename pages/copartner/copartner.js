// pages/copartner/copartner.js
const app = getApp();
let userID, startTime, endTime;
Page({
  data: {
    startTime: '',
    endTime: '',
    list: []
  },

  handleGo(e) {
    let index = e.target.dataset.index,
      item = this.data.list[index];
    if (item.num * 1 > 0) {
      if (startTime) {
        wx.navigateTo({
          url: `../jingge/jingge?userId=${item.userId}&startTime=${startTime}&endTime=${endTime}`
        });
      } else {
        wx.navigateTo({
          url: `../jingge/jingge?userId=${item.userId}`
        });
      }
    }
  },

  kindToggle(e) {

  },

  handleStartSearch() {
    if (!this.data.startTime) {
      wx.showModal({
        content: '请选择开始日期',
        showCancel: false
      });
    } else if (!this.data.endTime) {
      wx.showModal({
        content: '请选择截止日期',
        showCancel: false
      });
    } else {
      let startTimeStamp = new Date(this.data.startTime).getTime(),
        endTimeStamp = new Date(this.data.endTime).getTime();
      if (startTimeStamp > endTimeStamp) {
        wx.showModal({
          content: '开始日期不得大于截止日期',
          showCancel: false
        });
      } else {
        this.setData({
          list: []
        });
        wx.showLoading({
          title: '加载中',
          mask: true
        });
        startTime = this.data.startTime;
        endTime = this.data.endTime;
        wx.request({
          url: `${app.globalData.api}/admin/csparter`,
          data: {
            userId: userID,
            startTime: this.data.startTime,
            endTime: this.data.endTime
          },
          success: res => {
            wx.hideLoading();
            let datas = res.data;
            this.setData({
              list: datas.data.list
            });
            console.log(this.data.list);
          }
        });
      }
    }
  },

  handleDateChange(e) {
    if (e.currentTarget.dataset.rel == 'end') {
      this.setData({
        endTime: e.detail.value
      });
    } else {
      this.setData({
        startTime: e.detail.value
      });
    }
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
    userID = options.userId;
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: `${app.globalData.api}/admin/csparter`,
      data: {
        userId: userID
      },
      success: res => {
        wx.hideLoading();
        let datas = res.data;
        this.setData({
          list: datas.data.list
        });
        console.log(this.data.list);
      }
    });
  }
});
