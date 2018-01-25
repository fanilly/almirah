// pages/search/search.js
let searchKeyWord = ''; //保存搜索的关键词
Page({

  data: {
    quickSearchKeyWord: '', //快捷搜索关键词
    startSearch: false, //是否开始搜索
    isStartSearch: false, //是否开始搜索 控制历史是否显示
    hasHistorys: true, //是否存在历史记录
    historys: [] //记录历史搜索记录
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
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

  //搜索
  search(keyWord) {
    //隐藏搜索历史并显示加载动画
    this.setData({
      startSearch: true,
      isStartSearch: true
    });
  },

  //记录输入的关键词
  handleRecordSearchKeyWord(e) {
    searchKeyWord = e.detail.value;
  },

  //点击搜索按钮事件
  handleStartSearch() {
    if (searchKeyWord != '') {
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
    }
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
