import getMGoodsLists from '../../request/getMGoodsLists.js';
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
    if (!app.globalData.isVIP) {
      wx.showModal({
        content: '您现在还不是会员，只有成为会员之后才能使用衣物流通功能哟~',
        confirmText: '成为会员',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../register/register'
            });
          }
        }
      });
    } else {
      wx.switchTab({
        url: '../almirah/almirah'
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
      console.log(getedScene);
      if (app.globalData.userID) {
        console.log(`${app.globalData.api}/user/modify_parentid?userId=${app.globalData.userID}&parentId=${getedScene}`);
        wx.request({
          url: `${app.globalData.api}/user/modify_parentid?userId=${app.globalData.userID}&parentId=${getedScene}`,
          success: res => {
            console.log(res);
            wx.showModal({
              content: res.data.msg,
              showCancel: false
            });
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
    getMGoodsLists(this, currentPageNum);
  },

  //上拉加载更多
  onReachBottom() {
    if (this.data.loadingStatus == -1) {
      if (this.data.allLoadMore) {
        currentPageNum++;
        this.setData({
          isLoadMore: true
        });
        getMGoodsLists(this, currentPageNum);
      }
    }
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止微信默认下拉刷新动画
    currentPageNum = 1;
    //显示刷新动画 清空上次加载的数据
    this.setData({
      startRefresh: true,
      lists: [],
      loadingStatus: -1
    });
    getMGoodsLists(this, currentPageNum);
  },

  //分享
  onShareAppMessage(res) {
    return {
      title: '净衣客',
      path: '/pages/index/index',
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail');
      }
    };
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
