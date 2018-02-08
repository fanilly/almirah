//app.js
import login from 'scripts/login';
import updateUserInfo from 'scripts/updateUserInfo';
App({
  onLaunch: function() {
    wx.showLoading({ title: '加载中' });
    login(this.globalData.api, (user, userInfo) => {
      //登陆成功 隐藏加载动画 并记录返回数据
      wx.hideLoading();
      this.globalData.userInfo = userInfo;
      this.globalData.userID = user.userId;
      this.globalData.isVIP = user.isVip * 1 == 1 ? true : false;
      console.log(user, userInfo);
      updateUserInfo(userInfo, this.globalData.api, user.userId);
    }, (user) => {
      //登陆成功 隐藏加载动画 并记录用户id及是否为vip
      wx.hideLoading();
      this.globalData.userID = user.userId;
      this.globalData.isVIP = user.isVip * 1 == 1 ? true : false;
      console.log(user);
    });

    // 记录商城购物车商品个数
    wx.getStorage({
      key: 'mallTrolley',
      success: res => {
        let mallTrolley = res.data ? JSON.parse(res.data) : [];
        this.globalData.totalTrolleyLen = mallTrolley.length;
      },
      fail: err => {
        this.globalData.totalTrolleyLen = 0;
      }
    });
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // });
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res);
    //           }
    //         }
    //       });
    //     }
    //   }
    // });
    // this.login();
  },

  globalData: {
    userID: 2,
    isVIP: null,
    totalTrolleyLen: 0,
    takeAddress: null, //取衣地址
    giveAddress: null, //送衣地址
    api: 'https://ybh.hohu.cc/index.php/api',
    baseUrl: 'https://ybh.hohu.cc/',
    userInfo: {
      nickName: '卮言',
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/ywFvlKF6uhng0HAv4Aa53NHfrxStvT9ftibFCSeOP1zxmLq9iaTVSDgkCdtD3taQIGibibhMl03Xz08EDTy7f4w5rw/0"
    }
  }
});
