// pages/laundrySettlement/laundrySettlement.js
import {formatDate} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prefetchingTime:'-- 请选择 --',
    startTime:'',
    remarks:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      startTime: formatDate(new Date())
    });
  },

  // 日期选择
  handleDateChange(e){
    this.setData({
      prefetchingTime:e.detail.value
    });
  },

  //备注
  bindTextAreaBlur(e){
    this.setData({
      remarks:e.detail.value
    });
  }
});
