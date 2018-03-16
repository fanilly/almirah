Page({
  data: {
    msg:'',
    type:''
  },
  onLoad(options) {
    if (options.type == 'laundry') {
      this.setData({
        type: options.type,
        msg: '支付失败'
      });
    } else {
      this.setData({
        type: options.type,
        msg: '交易交易'
      });
      // `../productDetail/productDetail?id=${e.currentTarget.id}&self=1`
    }
  },
  handleGoIndex() {
    wx.redirectTo({
      url: '../index/index'
    });
  }
});
