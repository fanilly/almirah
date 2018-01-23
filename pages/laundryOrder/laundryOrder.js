// pages/laundryOrder/laundryOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    datas: ['上装服饰', '下装服饰', '服饰配件', '鞋靴护理', '家居坐垫', '皮具护理', '增补插价']
  },

  // 头部按钮点击事件
  handleTap(e) {
    this.setData({
      curIndex: parseInt(e.target.id)
    });
  },

  // 产品列表中的加号点击事件
  handleAddProduct(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  }
});
