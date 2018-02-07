const app = getApp();
module.exports = (that, num, type) => {
  wx.request({
    url: `${app.globalData.api}/goods/goodslist`,
    data: {
      p: 1
    },
    success: res => {
      console.log(res);
    }
  });
};
