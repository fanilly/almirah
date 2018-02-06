const app = getApp();
/**
 * [改变订单状态]
 * @param  {[Object]} that [app对象]
 * @param  {[Number]} index   [索引]
 * @param  {[Number]} type [1:删除 2:确认收货]
 * @return {[void]}      [无返回值]
 */
module.exports = (that, index, type) => {

  // 确认收货
  const confirmOrder = (res) => {

      if (res.data == 1) {  // 收货成功
        //隐藏加载层并提示收货成功
        wx.hideLoading();
        wx.showToast({
          title: '已收货',
          image: '../../assets/success.png',
          duration: 1500
        });

        //在特定场景 更新客户端页面渲染的数据
        //在洗衣物页面删除视图中的订单项
        //衣橱页面改变显示状态
        if (that.data.navTitle != '衣橱') {
          let lists = that.data.lists;
          lists.splice(index, 1);
          that.setData({
            lists: lists
          });
        } else {
          let lists = that.data.lists;
          lists[index].isOver = 1;
          lists[index].orderStatus = '订单完成';
          that.setData({
            lists: lists
          });
        }

        //如果当前列表数据为空 显示下单按钮
        if (that.data.lists.length <= 0) {
          that.setData({
            hasOrderList: 3
          });
        }
      } else { //收货失败
        //收货失败 隐藏加载动画并提示收货失败
        wx.hideLoading();
        wx.showToast({
          title: '收货失败',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    },
    deleteOrder = (res) => {
      if (res.data == 1) { //删除成功
        //隐藏加载层并提示删除成功
        wx.hideLoading();
        wx.showToast({
          title: '删除成功',
          image: '../../assets/success.png',
          duration: 1500
        });

        //更新客户端页面渲染的数据
        let lists = that.data.lists;
        lists.splice(index, 1);
        that.setData({
          lists: lists,
          hasOrderList: that.data.lists.length <= 0 ? 3 : 2
        });

      } else {
        //删除失败 隐藏加载动画并提示删除失败
        wx.hideLoading();
        wx.showToast({
          title: '删除失败',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    };

  wx.request({
    url: `${app.globalData.api}/order/order_status`,
    data: {
      orderId: that.data.lists[index].orderId,
      orderMark: type == 1 ? 'Delete' : 'Confirm'
    },
    success: res => {
      switch (type) {
        //删除订单
        case 1:
          deleteOrder(res);
          break;
          //确认收货
        default:
          confirmOrder(res);
          break;
      }
    },
    fail() {
      //主观认为请求发送失败为网络异常
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        image: '../../assets/warning.png',
        duration: 1500
      });
    }
  });

};
