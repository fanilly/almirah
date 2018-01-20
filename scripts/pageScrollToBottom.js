/**
 * 页面滚动至底部
 * @return {[void]} [无返回值]
 */
module.exports = function() {
  wx.createSelectorQuery().select('#page').boundingClientRect(function(rect) {
    // 使页面滚动到底部
    wx.pageScrollTo({
      scrollTop: rect.bottom
    });
  }).exec();
};