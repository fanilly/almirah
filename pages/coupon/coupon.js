const app = getApp();
Page({
  data: {
    hasCoupon: true,
    listData: []
  },
  onLoad() {
    let total = parseInt(app.globalData.commission.freeWash),
      listData = [];
    if (total <= 0) {
      this.setData({ hasCoupon: false });
    } else {
      for (let i = 0; i < total; i++) {
        listData.push('test')
      }
      this.setData({ listData, hasCoupon: true });
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

});
