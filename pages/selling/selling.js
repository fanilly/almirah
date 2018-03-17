// pages/selling/selling.js
import getSelling from '../../request/getSelling.js';
import deleteGoods from '../../request/deleteGoods.js';
const app = getApp(),
  params = {
    num: [100, 0, 1, 2],
    msg: ['暂无出售商品', '暂无待审核商品', '暂无在售商品', '暂无已售出商品']
  },
  switchStatus = {
    UserDelete: '删除',
    Pulloff: '下架',
    Putup: '上架',
    Recovery: '收回'
  };

Page({

  data: {
    btns: ['全部', '待审核', '在售', '已售出'],
    baseUrl: app.globalData.baseUrl,
    listsAll: [{
      lists: [],
      listsStatus: '努力加载中...'
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }],
    currentIndex: 0,
    startRefresh: false
  },

  //跳转至编辑页面
  handleEdit(e){
    console.log(e);
    console.log(this.data.listsAll[0]);
    wx.navigateTo({
      url:`../edit/edit?id=${e.currentTarget.id}`
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  //跳转至详情
  handleGoDetail(e) {
    console.log(e.currentTarget.id);
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${e.currentTarget.id}&self=1`
    });
  },

  //下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    let listsAll = this.data.listsAll,
      startRefresh = true;
    //显示刷新动画 清楚视图中数据 重新发起请求
    listsAll[this.data.currentIndex].listsStatus = 1;
    listsAll[this.data.currentIndex].lists = [];
    this.setData({ listsAll, startRefresh });
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  //删除
  handleDelete(e) {
    deleteGoods(this, e.currentTarget.id, params);
  },

  // 商品类型切换
  handleCheckout(e) {
    console.log(this.data.listsAll[0].lists);
    let index = parseInt(e.currentTarget.id);
    this.setData({
      currentIndex: index
    });
    //如果listsStatus的值为努力加载中 代表当前选项的数据未被加载过
    //加载过的数据不进行二次加载 刷新时重新加载当前选项的数据
    if (this.data.listsAll[index].listsStatus == '努力加载中...' || this.data.startRefresh) {
      getSelling(3,this, params.num[index], () => {
        let listsAll = this.data.listsAll;
        listsAll[index].listsStatus = params.msg[index];
        this.setData({ listsAll });
      }, (res) => {
        let listsAll = this.data.listsAll;
        listsAll[index].listsStatus = 1;
        listsAll[index].lists = res;
        this.setData({ listsAll });
      });
    }
  }
});
