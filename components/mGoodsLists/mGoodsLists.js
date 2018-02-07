// components/mGoodsLists/mGoodsLists.js
const app = getApp();

Component({
  properties: {
    // 列表数据
    lists: {
      type: Array,
      value: []
    },

    //数据加载状态
    loadingStatus: {
      type: Number,
      value: -1 //1 到底了 2 未加载到商品
    }
  },

  data: {
    baseUrl: app.globalData.baseUrl
  },

  created() {
    console.log(this.data);
  }
});
