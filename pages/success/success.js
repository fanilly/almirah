let isAlmirah;
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
        createTime: options.createTime,
        shopName: options.shopName,
        shopTel: options.shopTel,
        shopAddress: options.shopAddress
      });
    } else {
      this.setData({
        type: options.type,
        msg: '交易成功',
        orderId: options.orderId,
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
        url: `../orderDetail/orderDetail?orderId=${this.data.orderId}`
      });
    }
  },
  handleGoIndex() {
    wx.switchTab({
      url: '../index/index'
    });
  }
});
