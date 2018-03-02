const app = getApp();
/**
 * [首页及搜索页列表数据请求]
 * @param  {[Object]} that [page对象]
 * @param  {[Number]} num  [当前页数]
 * @param  {String} type [搜索关键字]
 * @return {[void]}      [无返回值]
 */
module.exports = (that, num, type = '') => {
  // 获取商城商品列表数据
  // 不允许同时发送多次请求
  that.setData({
    allLoadMore: false
  });
  wx.request({
    url: `${app.globalData.api}/goods/goodslist`,
    data: {
      recom: type != '' ? 0 : 1, //热门推荐传1 搜索传0
      p: num, //当前请求的页数
      goodsname: type //当前请求的关键字 如果为空请求为热门推荐
    },
    success: res => {
      console.log(res);
      //记录本次请求到的数据及之前请求到的数据
      let lists = res.data.goodslist,
        tempList = that.data.lists;

      //记录最大允许加载次数
      that.setData({
        countPageNum: res.data.page_sum
      });

      //如果最大加载次数小于等于当前加载的页面 显示到底了
      if (that.data.countPageNum <= num) {
        that.setData({
          loadingStatus: 1
        });
      }

      //如果当前是第一页并没有请求到列表数据
      if (num == 1 && (!lists || !lists.length || lists.length == 0)) {
        that.setData({
          loadingStatus: 2
        });
      }

      //记录列表数据
      console.log(123)
      if (lists) {
        tempList.push(...lists);
      }
      console.log(456)
      that.setData({
        lists: tempList
      });

      //修改加载状态
      that.setData({
        allLoadMore: true,
        isLoadMore: false,
        startSearch: false,
        startRefresh: false
      });
    }
  });
};
