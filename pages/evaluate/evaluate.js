// pages/evaluate/evaluate.js
const app = getApp();
let orderId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarks: '',
    remarksLen: 0,
    score: 5
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    orderId = options.orderId;
  },

  evaluate(e) {
    this.setData({
      score: Number(e.currentTarget.id)
    });
  },

  //备注
  bindTextAreaBlur(e) {
    this.setData({
      remarks: e.detail.value,
      remarksLen: e.detail.value.length
    });
  },

  //提交评论
  handleSubmitEvaluate() {
    wx.request({
      url: `${app.globalData.api}/order/appraise`,
      data: {
        orderId: orderId,
        appraise: this.data.remarks,
        score: this.data.score
      },
      success: res => {
        console.log(orderId, this.data.remarks, this.data.score);
        if (res.data.status == 1) {
          app.globalData.updateAlmirah = true;
          wx.showToast({
            title: '评价成功',
            image: '../../assets/success.png',
            duration: 1000
          });
          setTimeout(() => {
            wx.switchTab({
              url: '../almirah/almirah'
            });
          }, 800);
        } else {
          wx.showToast({
            title: '评价失败',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      }
    });
  }

});
