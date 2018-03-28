// pages/me/me.js
const app = getApp();
Page({
  data: {
    isVip: app.globalData.isVIP,
    commission: app.globalData.commission,
    hasNewMsg: app.globalData.hasNewMsg,
    nickName: '',
    avatarUrl: ''
  },

  handleGoBusinessAdmin() {
    if (app.globalData.business.isLogin) {
      wx.navigateTo({
        url: '../businessAdmin/businessAdmin'
      });
    }else{
      wx.navigateTo({
        url: '../businessLogin/businessLogin'
      });
    }
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    console.log(app.globalData.commission);
    console.log(app.globalData.isVIP);
    this.setData({
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      isVip: app.globalData.isVIP,
      commission: app.globalData.commission,
      hasNewMsg: app.globalData.hasNewMsg
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止下拉刷新
    wx.showLoading({ title: '正在刷新' });
    wx.request({
      url: `${app.globalData.api}/user/user_info`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        app.globalData.commission = res.data.data;
        this.setData({
          commission: app.globalData.commission
        });
        wx.hideLoading();
      }
    });
  },

  //去购买会员
  handleBuyVip() {
    // console.log(app.globalData.isVIP);
    // if (app.globalData.isVIP) {
    //   wx.showModal({
    //     content: '您已经是会员啦！',
    //     showCancel: false
    //   });
    // } else {
    wx.navigateTo({
      url: '../register/register'
    });
    // }
  },

  // 生命周期函数--监听页面显示
  onShow() {
    this.setData({
      commission: app.globalData.commission,
      hasNewMsg: app.globalData.hasNewMsg
    });
  },

  //跳转至分享二维码页面
  handleGoToQRcode() {
    if (app.globalData.isVIP) {
      wx.navigateTo({
        url: '../qrcode/qrcode'
      });
    } else {
      wx.showModal({
        content: '您现在还不是会员，只有成为会员之后才能去通过分享二维码赚取佣金哟！',
        confirmText: '成为会员',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../register/register'
            });
          }
        }
      });
    }
  },

  //联系客服
  handleServices() {
    wx.showLoading();
    wx.request({
      url: `${app.globalData.api}/common/about`,
      data: {
        type: 2
      },
      success: res => {
        wx.hideLoading();
        wx.makePhoneCall({
          phoneNumber: res.data.data.articleContent
        });
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '客服繁忙！',
          image: '../../images/warning.png',
          duration: 2000
        });
      }
    });
  }
});
