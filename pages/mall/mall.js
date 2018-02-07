import pageScrollToBottom from '../../scripts/pageScrollToBottom.js';
const app = getApp();
let allLoadMore = true, //允许加载更多
  currentPageNum = 1, //当前加载的次数
  countPageNum = 5; //共可以加载的次数
Page({
  data: {
    baseUrl: '',
    carouselImgs: [], //轮播图
    windowWidth: '',
    windowHeight: '',
    swiperHeight: '',
    isLoadMore: false, //显示加载动画
    loadingStatus: -1, //1 到底了 2 未加载到商品
    lists: [] //列表数据
  },

  // 获取人们推荐列表数据
  getHotLists() {
    this.setData({
      isLoadMore: true
    });
    // pageScrollToBottom();
    //不允许同时发送多次请求
    allLoadMore = false;
    wx.request({
      url: `${app.globalData.api}/goods/goodslist`,
      data: {
        p: currentPageNum
      },
      success: res => {
        console.log(res);
        let lists = res.data.goodslist,
          tempList = this.data.lists;

        //记录最大允许加载次数
        countPageNum = res.data.page_sum;

        //如果最大加载次数小于等于当前加载的页面 显示到底了
        if (countPageNum <= currentPageNum) {
          this.setData({
            loadingStatus: 1
          });
        }

        //如果当前是第一页并没有请求到列表数据
        if (currentPageNum == 1 && !lists) {
          this.setData({
            loadingStatus: 2
          });
        }

        //记录列表数据
        tempList.push(...lists);
        this.setData({
          lists: tempList
        });

        //修改加载状态
        allLoadMore = true;

        this.setData({
          isLoadMore: false
        });

      }
    });
  },

  onLoad: function() {

    //记录根路径
    this.setData({
      baseUrl: app.globalData.baseUrl
    });

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
      url: `${app.globalData.api}/common/index_banner`,
      success: res => {
        this.setData({
          carouselImgs: res.data
        });
      }
    });

    // 获取热门推荐数据
    this.getHotLists();
  },

  //上拉加载更多
  onReachBottom() {
    if (this.data.loadingStatus == -1) {
      if (allLoadMore) {
        currentPageNum++;
        this.getHotLists();
      }
    }
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
  }
});
