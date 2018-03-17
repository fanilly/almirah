const app = getApp();
module.exports = (that, index, params) => {
  wx.showModal({
    content: `确认删除`,
    success: (res) => {
      if (res.confirm) {
        wx.showLoading({ title: '请稍后', mask: true });
        let cIndex = that.data.currentIndex,
          listsAll = that.data.listsAll;
        console.log(listsAll[cIndex].lists[index].goodsId);
        wx.request({
          url: `${app.globalData.api}/goods/goodsDelete`,
          data: {
            goodsId: listsAll[cIndex].lists[index].goodsId
          },
          success: res => {
            console.log(res);
            wx.hideLoading();
            if (res.data == 1) {
              wx.showToast({
                title: `删除成功`,
                icon: 'success',
                duration: 1500
              });
              listsAll[cIndex].lists.splice(index, 1);
              if (listsAll[cIndex].lists.length <= 0) {
                listsAll[cIndex].listsStatus = params.msg[cIndex];
              }
              that.setData({ listsAll });
            } else {
              wx.showToast({
                title: `删除失败`,
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
      }
    }
  });
};
