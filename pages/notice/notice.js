// pages/notice/notice.js
Page({

  data: {
    type: -1
  },

  onLoad(options) {
    this.setData({
      type: options.type
    });
    if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: '衣物交易须知'
      });
    }
  }

});
