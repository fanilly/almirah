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
    }else if(options.type == 3){
      wx.setNavigationBarTitle({
        title: '衣物流通须知'
      });
    }else if(options.type == 4){
      wx.setNavigationBarTitle({
        title: '衣物储存须知'
      });
    }
  }

});
