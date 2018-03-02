// components/lorder/lorder.js
import changeOrderStatus from '../../request/changeOrderStatus.js';
const app = getApp();
let shopId;
Component({
  properties: {
    // 订单列表渲染状态
    hasOrderList: {
      type: Number,
      value: 1 //1.加载中 2.隐藏 3.无订单数据
    },

    isvip: {
      type: Boolean,
      value: false
    },

    //订单列表数据
    lists: {
      type: Array,
      value: []
    },

    //页面导航条标题
    navTitle: {
      type: String,
      value: '衣橱'
    }
  },

  data: {
    chooseList: [], //选择出售的订单列表
    isShowChooseGoods: false //是否显示选择出售
  },

  methods: {
    //阻止冒泡
    handleStopPropagation() {
      console.log('stop propagation');
    },

    //确认收货
    handleConfirm(e) {
      wx.showModal({
        content: '确认收货',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading();
            let id = e.currentTarget.id;
            changeOrderStatus(this, id, 2);
          }
        }
      });
    },

    //点击删除按钮删除订单
    handleDelOrder(e) {
      wx.showModal({
        content: '删除订单',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading();
            let id = e.currentTarget.id;
            changeOrderStatus(this, id, 1);
          }
        }
      });
    },

    // 点击商品跳转出售页面
    handleGoToSell(e) {
      let id = e.currentTarget.id,
        item = this.data.chooseList[id],
        goodsID = item.goodsId,
        ID = item.id;
      wx.navigateTo({
        url: `../sell/sell?goodsID=${goodsID}&ID=${ID}&shopID=${shopId}`
      });
    },

    //点击出售时改变标题栏标题
    handleCloseChooseGoods() {
      wx.setNavigationBarTitle({
        title: this.data.navTitle
      });
      this.setData({
        isShowChooseGoods: false
      });
    },

    //选择衣物进行出售
    handleCheckSell(e) {
      let id = e.currentTarget.id,
        list = this.data.lists[id].list;
      //api工程师要求需要shopId
      shopId = this.data.lists[id].shopId;
      //改变标题栏
      wx.setNavigationBarTitle({
        title: '选择出售商品'
      });
      //记录选择出售的数据
      this.setData({
        chooseList: list,
        isShowChooseGoods: true
      });
    },
  }
});
