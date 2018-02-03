//app.js
import login from 'scripts/login';
import updateUserInfo from 'scripts/updateUserInfo';
App({
  onLaunch: function() {
    wx.showLoading();
    login(this.globalData.api,(user,userInfo) => {
      wx.hideLoading();
      this.globalData.userInfo = userInfo;
      console.log(user,userInfo);
      // updateUserInfo(userInfo, this.globalData.api, user);
    },(user)=>{
      wx.hideLoading();
      console.log(user);
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

  // 登录
  login() {
    const api = this.globalData.api;
    wx.login({
      success: res => {
        //向后台发送res.code 换取openid
        wx.request({
          method: 'GET',
          url: `${api}/user/get_openid`,
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            console.log(res);
            // this.globalData.userID = res.data;
            // wx.hideLoading();
            // this.getUserInfo();
          }
        });
      }
    });
  },

  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        let userInfo = res.userInfo,
          api = this.globalData.api,
          userID = this.globalData.userID;
        //保存用户信息
        this.globalData.userInfo = userInfo;
        if (userID) {
          updateUserInfo(userInfo, api, userID);
          console.log(userID);
        }
      },
      fail() {
        console.log('getUserInco fail');
      }
    });
  },

  globalData: {
    userID:'',
    api: 'https://ybh.hohu.cc/index.php/api',
    baseUrl: 'https://ybh.hohu.cc/',
    userInfo: {
      nickName: '卮言',
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/ywFvlKF6uhng0HAv4Aa53NHfrxStvT9ftibFCSeOP1zxmLq9iaTVSDgkCdtD3taQIGibibhMl03Xz08EDTy7f4w5rw/0"
    }
  }
});
