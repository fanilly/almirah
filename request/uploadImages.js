const app = getApp();
/**
 * [出售商品上传图片]
 * @param  {[Array]} files   [图片临时文件路径集合]
 * @param  {[Number]} goodsID [本次商品生成的ID]
 * @return {[void]}         [无返回值]
 */
module.exports = (files, goodsID) => {
  let i = 0;
  // 使用递归的方式上传多张图片
  const uploadImage = () => {
    wx.uploadFile({
      url: `${app.globalData.api}/goods/uploadGoodsPic`,
      filePath: files[i],
      name: 'test',
      formData: {
        goodsId: goodsID,
        isCover: i == 0 ? 1 : 0 //默认第一张图片为封面图片
      },
      success: res => {
        let result = JSON.parse(res.data);
        console.log(result);
        if (result.status == 1) {
          // 如果当前本次传输完成的不是最后一张图片 继续下一张
          if (i < files.length - 1) {
            i++;
            uploadImage();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功',
              image: '../../assets/success.png',
              duration: 1500
            });
            wx.redirectTo({
              url:'../selling/selling'
            });
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '网络异常',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  };
  uploadImage();
};
