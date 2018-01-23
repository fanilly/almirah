import pageScrollToBottom from '../../scripts/pageScrollToBottom.js';
const app = getApp();

Page({
  data: {
    windowWidth: '',
    windowHeight: '',
    swiperHeight: '',
    isLoadMore: false
  },

  onLoad: function() {
    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    });
  },

  //上拉加载更多
  onReachBottom() {
    console.log('yes');
    this.setData({
      isLoadMore: true
    });
    pageScrollToBottom();
    setTimeout(() => {
      this.setData({
        isLoadMore: false
      });
    }, 5000);
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    //模拟加载
    setTimeout(() => {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 5000);
  },

  //banner图片加载
  imageLoad(e) {
    //获取图片真实宽度
    let imgwidth = e.detail.width,
      imgheight = e.detail.height,
      swiperHeight = this.data.windowWidth / (imgwidth + 30) * imgheight;
    this.setData({
      swiperHeight: swiperHeight
    });
    console.log(swiperHeight);
  },
});
