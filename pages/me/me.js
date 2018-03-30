// pages/me/me.js
const app = getApp();
Page({
  data: {
    startRefresh: false,
    isVip: app.globalData.isVIP,
    commission: app.globalData.commission,
    hasNewMsg: app.globalData.hasNewMsg,
    nickName: '',
    avatarUrl: ''
  },

  handleGoBusinessAdmin() {
    if (app.globalData.business.isLogin) {
      if (app.globalData.business.identity == 1) {
        wx.redirectTo({
          url: '../businessAdmin/businessAdmin'
        });
      } else if (app.globalData.business.identity == 2) {
        wx.redirectTo({
          url: `../jingge/jingge?userId=${app.globalData.business.userId}`
        });
      } else {
        wx.redirectTo({
          url: `../copartner/copartner?userId=${app.globalData.business.userId}`
        });
      }
    } else {
      wx.navigateTo({
        url: '../businessLogin/businessLogin'
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
    this.setData({
      startRefresh: true
    });
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
        this.setData({
          startRefresh: false
        });
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

    wx.makePhoneCall({
      phoneNumber: app.globalData.SETTINGS.phoneNo
    });
  }
});
