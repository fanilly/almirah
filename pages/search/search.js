// pages/search/search.js
import getMGoodsLists from '../../request/getMGoodsLists.js';
const app = getApp();
let currentPageNum = 1, //当前加载的次数
  searchKeyWord = ''; //保存搜索的关键词

Page({

  data: {
    countPageNum: 5, //共可以加载的次数
    allLoadMore: true, //允许加载更多
    isLoadMore: false, //显示加载动画
    loadingStatus: -1, //1 到底了 2 未加载到商品
    lists: [], //列表数据
    quickSearchKeyWord: '', //快捷搜索关键词
    startSearch: false, //是否开始搜索
    isStartSearch: false, //是否开始搜索 控制历史是否显示
    hasHistorys: true, //是否存在历史记录
    historys: [] //记录历史搜索记录
  },

  //上拉加载更多
  onReachBottom() {
    if (this.data.loadingStatus == -1) {
      if (this.data.allLoadMore) {
        currentPageNum++;
        this.setData({
          isLoadMore: true
        });
        getMGoodsLists(this, currentPageNum, searchKeyWord);
      }
    }
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止微信默认下拉刷新动画
    this.handleStartSearch();
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    this.getHistoricalSearch();
  },

  //搜索
  search(keyWord) {
    //清楚上次搜索状态及数据 重新开始本次搜索
    currentPageNum = 1;
    this.setData({
      startSearch: true,
      isStartSearch: true,
      loadingStatus: -1,
      lists: []
    });
    getMGoodsLists(this, currentPageNum, searchKeyWord);
  },

  //记录输入的关键词
  handleRecordSearchKeyWord(e) {
    searchKeyWord = e.detail.value;
  },

  //点击搜索按钮事件
  handleStartSearch() {
    if (searchKeyWord.trim() != '') {
      //仅保留二十条历史数据
      //当点击搜索按钮时 判断是否输入关键字
      //如果关键字存在，将关键字添加进历史数组的头部
      //并将数组转换为字符串 保存到storage
      let historyKeyWords = this.data.historys;
      historyKeyWords.unshift(searchKeyWord);
      if (historyKeyWords.length > 20) {
        historyKeyWords.pop();
      }
      historyKeyWords = historyKeyWords.join(',');
      wx.setStorage({
        key: 'searchHistorys',
        data: historyKeyWords
      });
      //开始搜索
      this.search(searchKeyWord);
    } else {
      //没有输入关键词进行搜索时显示历史搜索记录 并刷新历史记录
      this.setData({
        startSearch: false,
        isStartSearch: false,
        loadingStatus: -1,
        lists: [],
        historys:[]
      });
      this.getHistoricalSearch();
    }
  },

  //从缓存中获取历史记录
  getHistoricalSearch() {
    //从storage中获取历史搜索记录
    //将历史搜索记录转换为数组并存入数据模型中
    wx.getStorage({
      key: 'searchHistorys',
      success: res => {
        let historyKeyWords = res.data,
          temp = this.data.historys;
        //将historyKeyWords转换为数组并进行去重复操作
        temp.push(...Array.from(new Set(historyKeyWords.split(','))));
        this.setData({
          historys: temp
        });
      },
      fail: res => {
        //如果不存在历史记录 显示暂无历史 并隐藏清空按钮
        this.setData({
          hasHistorys: false
        });
      }
    });
  },

  //当点击历史搜索记录时以点击历史的内容为关键词 进行快捷搜索
  handleQuickSearch(e) {
    let quickKeyWord = this.data.historys[e.target.id];
    searchKeyWord = quickKeyWord;
    this.setData({
      quickSearchKeyWord: quickKeyWord
    });
    this.handleStartSearch();
  },

  //点击历史旁边的垃圾桶 清空历史记录
  handleClearHistorysSearch() {
    wx.showModal({
      content: '您确定要清空搜索历史吗？搜索历史一旦被清空将无法找回',
      success: res => {
        //如果点击确定 清楚缓存并清楚数据模型中的数据
        if (res.confirm) {
          this.setData({
            historys: []
          });
          wx.removeStorage({
            key: 'searchHistorys',
            success: res => {
              //隐藏删除按钮
              this.setData({
                hasHistorys: false
              });
              //弹出提示
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              });
            }
          });
        }
      }
    });
  }
});
