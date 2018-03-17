Page({
  data: {
    type: '',
    msg: '',
    orderId: '',
    createTime: ''
  },
  onLoad(options) {
    if (options.type == 'laundry') {
      this.setData({
        type: options.type,
        msg: '支付成功',
        orderId: options.orderId,
        createTime: options.createTime
      });
    } else {
      this.setData({
        type: options.type,
        msg: '交易成功',
        orderId: options.goodsId,
        createTime: options.createTime
      });
      // `../productDetail/productDetail?id=${e.currentTarget.id}&self=1`
    }
  },
  handleGoDetail() {
    if (this.data.type == 'laundry') {
      wx.redirectTo({
        url: `../lOrderDetail/lOrderDetail?orderId=${this.data.orderId}`
      });
    } else {
      wx.redirectTo({
        url: `../productDetail/productDetail?id=${this.data.orderId}&self=1`
      });
    }
  },
  handleGoIndex() {
    wx.switchTab({
      url: '../index/index'
    });
  }
});
