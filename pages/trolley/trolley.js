// pages/trolley/trolley.js
const controlAnimate = wx.createAnimation({
  duration: 520,
  timingFunction: 'ease'
});


Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,
    showMask:{},
    item: {
      checked: true,
      test: false
    }
  },


  handleShowControl() {
    let item = this.data.item;
    item.test = true;
    this.setData({
      item: item
    });

    controlAnimate.opacity(1).step();
    this.setData({
      showMask: controlAnimate
    });
  },

  handleHideControl() {
    let item = this.data.item;
    item.test = !item.test;
    this.setData({
      item: item
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  handleCheckout() {
    let item = this.data.item;
    item.checked = !item.checked;
    this.setData({
      item: item
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
});
