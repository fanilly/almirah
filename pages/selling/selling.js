// pages/selling/selling.js
const app = getApp(),
  params = {
    num: [1, 2, 3, 0, 4],
    msg: ['暂无已上架商品', '暂无已下架商品', '暂无已收回商品', '暂无待审核商品', '暂无已售出商品']
  },
  switchStatus = {
    UserDelete: '删除',
    Pulloff: '下架',
    Putup: '上架',
    Recovery: '收回'
  };

Page({

  data: {
    btns: ['已上架', '已下架', '已收回', '待审核', '已售出'],
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
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }],
    currentIndex: 0,
    startRefresh: false
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  //跳转至详情
  handleGoDetail(e) {
    console.log(e.currentTarget.id)
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

  //下架
  handlePulloff(e) {
    this.changeStatus(e.currentTarget.id, 'Pulloff');
  },

  //上架
  handlePutup(e) {
    this.changeStatus(e.currentTarget.id, 'Putup');
  },

  //收回
  handleRecovery(e) {
    this.changeStatus(e.currentTarget.id, 'Recovery');
  },

  //删除
  handleDelete(e) {
    this.changeStatus(e.currentTarget.id, 'UserDelete');
  },

  //改变状态
  changeStatus(index, type) {
    wx.showLoading({ title: '请稍后', mask: true });
    let cIndex = this.data.currentIndex,
      listsAll = this.data.listsAll;
    console.log(listsAll[cIndex].lists[index].goodsId)
    wx.request({
      url: `${app.globalData.api}/goods/goods_status`,
      data: {
        goodsId: listsAll[cIndex].lists[index].goodsId,
        goodsMark: type
      },
      success: res => {
        wx.hideLoading();
        if (res.data == 1) {
          wx.showToast({
            title: `${switchStatus[type]}成功`,
            icon: 'success',
            duration: 1500
          });
          listsAll[cIndex].lists.splice(index, 1);
          if (listsAll[cIndex].lists.length <= 0) {
            listsAll[cIndex].listsStatus = params.msg[cIndex];
          }
          this.setData({ listsAll });
        } else {
          wx.showToast({
            title: `${switchStatus[type]}失败`,
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络异常',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  },

  // 商品类型切换
  handleCheckout(e) {
    let index = parseInt(e.currentTarget.id);
    this.setData({
      currentIndex: index
    });
    //如果listsStatus的值为努力加载中 代表当前选项的数据未被加载过
    //加载过的数据不进行二次加载 刷新时重新加载当前选项的数据
    if (this.data.listsAll[index].listsStatus == '努力加载中...' || this.data.startRefresh) {
      this.checkout(params.num[index], () => {
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
  },

  //数据切换
  checkout(num, fn1, fn2) {
    wx.request({
      url: `${app.globalData.api}/goods/goods_list`,
      data: {
        userId: app.globalData.userID,
        goodsMark: num
      },
      success: res => {
        // 隐藏加载动画
        this.setData({
          startRefresh: false
        });
        if (!res.data || res.data.length <= 0) {
          if (fn1) fn1();
        } else {
          if (fn2) fn2(res.data);
        }
      }
    });
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady() {

  },

  // 生命周期函数--监听页面显示
  onShow() {

  },

  //生命周期函数--监听页面隐藏
  onHide() {

  }
});
