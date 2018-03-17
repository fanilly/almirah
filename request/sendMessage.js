const app = getApp();
module.exports = (that, index, type) => {
  wx.showLoading({ title: '催促中', mask: true });
  let cIndex = that.data.currentIndex,
    listsAll = that.data.listsAll,
    msgContent = '';
  if (type == 'storage') {
    msgContent = `用户编号：${app.globalData.userID}催促编号为：${listsAll[cIndex].lists[index].goodsId}的商品速度存储`;
    console.log(msgContent);
  } else if (type == 'delivery') {
    msgContent = `用户编号：${app.globalData.userID}催促编号为：${listsAll[cIndex].lists[index].goodsId}的商品速度发货`;
  } else if (type == 'express') {
    msgContent = `用户编号：${app.globalData.userID}催促编号为：${listsAll[cIndex].lists[index].goodsId}的商品速度流通`;
  }
  wx.request({
    url: `${app.globalData.api}/message/send_message`,
    data: {
      userId: app.globalData.userID,
      shopId: listsAll[cIndex].lists[index].shopId,
      msgContent: msgContent
    },
    success: res => {
      console.log(res);
      wx.hideLoading();
      if (res.data.status == 1) {
        wx.showToast({
          title: `催促成功`,
          icon: 'success',
          duration: 1500
        });
      } else {
        wx.showToast({
          title: `催促失败`,
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
};
