import pageScrollToBottom from '../../scripts/pageScrollToBottom.js';
const app = getApp();

Page({
  data: {
    windowWidth: '',
    windowHeight: '',
    swiperHeight: '',
    isLoadMore: false
  },

  getHotLists(){
    console.log(1);
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
    //获取轮播图数据
    wx.request({
      url:`${app.globalData.api}/common/index_banner`,
      success:res=>{
        console.log(res)
      }
    });

    // 获取热门推荐数据
    this.getHotLists();
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
      wx.stopPullDownRefresh(); //停止下拉刷新
    setTimeout(() => {
      wx.hideNavigationBarLoading(); //完成停止加载
    }, 5000);
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
    console.log(swiperHeight);
  },
});
