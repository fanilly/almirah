//app.js
import login from 'scripts/login';
import updateUserInfo from 'scripts/updateUserInfo';
App({
  //登陆成功之后立即执行
  loginAfter(user) {
    //获取用户信息
    wx.request({
      url: `${this.globalData.api}/user/user_info`,
      data: {
        userId: user.userId
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        this.globalData.commission = res.data.data;
      }
    });
    //如果存在parentID 需要记录
    if (this.globalData.parentID) {
      wx.request({
        url: `${this.globalData.api}/user/modify_parentid?userId=${user.userId}&parentId=${this.globalData.parentID}`,
        success: res => {
          // wx.showModal({
          //   content: res.data.msg,
          //   showCancel: false
          // });
        }
      });
      if (this.globalData.isVIP) {
        wx.showModal({
          title: '温馨提示！',
          content: '您已是衣随行会员，无需重复操作！感谢您的支持，祝您生活愉快！',
          showCancel: false
        });
      } else {
        wx.navigateTo({
          url: '/pages/register/register'
        });
      }
    }
  },
  loginIn() {
    login(this.globalData.api, (user, userInfo) => {
      //登陆成功 隐藏加载动画 并记录返回数据
      if (this.loginSuccessCallback) this.loginSuccessCallback(user);

      this.globalData.userInfo = userInfo;
      this.globalData.userID = user.userId;
      this.globalData.isVIP = user.isVip == 1 ? true : false;
      this.globalData.hasNewMsg = user.newMessages == 1 ? true : false;
      console.log(user, userInfo);
      updateUserInfo(userInfo, this.globalData.api, user.userId);
      this.loginAfter(user);
    }, (user) => {
      //登陆成功 隐藏加载动画 并记录用户id及是否为vip
      //由于 是网络请求，可能会在 Page.onLoad 之后才返回
      //// 所以此处加入 callback 以防止这种情况
      if (this.loginSuccessCallback) this.loginSuccessCallback(user);
      this.globalData.userID = user.userId;
      this.globalData.isVIP = user.isVip == 1 ? true : false;
      this.globalData.hasNewMsg = user.newMessages == 1 ? true : false;
      console.log(user);
      this.loginAfter(user);
      //必须授权
      wx.openSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            this.loginIn();
          }
        }
      });
    });
  },
  onLaunch() {
    wx.showLoading({ title: '加载中', mask: true });
    this.loginIn();

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
  },

  globalData: {
    userID: '',
    updateAlmirah: false, //如果为真 显示衣橱页面是重新获取数据
    updateWashRecord: false, //如果为真 显示衣橱存储页面时重新获取数据
    isVIP: null,
    hasNewMsg: false, //是否存在新消息
    totalTrolleyLen: 0, //商城购物车物品数量
    takeAddress: null, //取衣地址
    giveAddress: null, //送衣地址
    receiptAddress: null, //商城买衣地址
    buyGoodsLists: [], //结算时选中的商品
    api: 'https://xiyi.honghuseo.cn/index.php/api',
    baseUrl: 'https://xiyi.honghuseo.cn/',
    commission: null,
    userInfo: null
  }
});
