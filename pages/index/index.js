const app = getApp();
let currentPageNum = 1; //当前加载的次数

Page({
  data: {
    hasNewMsg: app.globalData.hasNewMsg,
    allLoadMore: true, //允许加载更多
    countPageNum: 5, //共可以加载的次数
    baseUrl: app.globalData.baseUrl,
    startRefresh: false, // 是否开始下拉刷新
    carouselImgs: [], //轮播图
    totalTrolleyLen: 0, //购物车商品数量
    windowWidth: '',
    windowHeight: '',
    swiperHeight: '',
    isLoadMore: false, //显示加载动画
    loadingStatus: -1, //1 到底了 2 未加载到商品
    lists: [] //列表数据
  },

  //去购买会员
  handleBuyVip() {
    console.log(app.globalData.isVIP);
    if (app.globalData.isVIP) {
      wx.showModal({
        content: '您已经是会员啦！',
        showCancel: false
      });
    } else {
      wx.navigateTo({
        url: '../register/register'
      });
    }
  },

  onShow() {
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen,
      hasNewMsg: app.globalData.hasNewMsg
    });
  },

  onLoad: function(options) {
    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    });

    //扫码进入
    if (options.scene) {
      let getedScene = decodeURIComponent(options.scene);
      if (app.globalData.userID) {
        wx.request({
          url: `${app.globalData.api}/user/modify_parentid?userId=${app.globalData.userID}&parentId=${getedScene}`,
          success: res => {
            console.log(res);
          }
        });
      } else {
        app.globalData.parentID = getedScene;
      }
    }

    //登陆成功的回调函数
    app.loginSuccessCallback = res => {
      this.setData({
        hasNewMsg: res.newMessages == 1 ? true : false
      });
    };

    //获取轮播图数据
    wx.request({
      url: `${app.globalData.api}/common/index_banner`,
      success: res => {
        console.log(res)
        this.setData({
          carouselImgs: res.data
        });
      }
    });

    // 获取热门推荐数据
    this.setData({
      isLoadMore: true
    });
  },

  //banner图片加载
  imageLoad(e) {
    //获取图片真实宽度
    let imgwidth = e.detail.width,
      imgheight = e.detail.height,
      swiperHeight = this.data.windowWidth / imgwidth * imgheight;
    this.setData({
      swiperHeight: swiperHeight
    });
  }
});
