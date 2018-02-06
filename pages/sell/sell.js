// pages/sell/sell.js
const app = getApp();
import { formatDate } from '../../utils/util.js';
let goodsID,ID;
Page({

  data: {
    descLen: 0, //商品描述长度
    endTime: '', //买入时间的最大可选时间
    buyTime: '', //买入时间
    delIndex: -1, //当前显示删除按钮的图片在files数组中的索引
    files: [] //商品图片
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    //设置买入时间的最大可选范围
    this.setData({
      endTime: formatDate(new Date())
    });
    goodsID = options.goodsID;
    ID=options.ID;
  },

  //选择买入时间
  handleDateChange(e) {
    this.setData({
      buyTime: e.detail.value
    });
  },

  //商品描述信息
  handleGoodsDesc(e) {
    //记录商品描述长度
    this.setData({
      descLen: e.detail.value.length
    });
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },

  //提交
  handleFormSubmit(e) {
    let datas = e.detail.value;
    if (!datas.goodsname) {
      this.showMsg('请输入商品名称');
    } else if(!this.data.buyTime){
      this.showMsg('请选择买入时间');
    }else if (!datas.size) {
      this.showMsg('请输入商品尺码');
    } else if (!datas.color) {
      this.showMsg('请输入商品颜色');
    } else if (!datas.oldprice) {
      this.showMsg('请输入商品原价');
    } else if (!datas.nowprice) {
      this.showMsg('请输入商品现价');
    }else if(!datas.desc){
      this.showMsg('请输入商品描述');
    }else if(this.data.files.length<1){
      this.showMsg('请至少上传一张商品图片');
    }else{
      console.log(goodsID,ID,datas.goodsname,datas.size,datas.color,datas.oldprice,datas.nowprice,this.data.buyTime,datas.desc,JSON.stringify(this.data.files))
      wx.request({
        method:'POST',
        header: {
          'content-type':'application/x-www-form-urlencoded'
        },
        url:`${app.globalData.api}/order/putup`,
        data:{
          id:ID,
          goodsCat:goodsID,
          goodsName:datas.goodsname,
          goodsSize:datas.size,
          goodsColor:datas.color,
          originalPrice:datas.oldprice,
          presentPrice:datas.nowprice,
          buyTime:this.data.buyTime,
          goodsDesc:datas.desc,
          goodsImage:JSON.stringify(this.data.files)
        }
      });
    }
  },

  //长按选择删除图片
  handleShowDelImage(e) {
    this.setData({
      delIndex: e.currentTarget.id
    });
  },

  //点击删除按钮下的遮罩层 隐藏删除按钮
  handleHideDelImage() {
    this.setData({
      delIndex: -1
    });
  },

  //点击按钮删除图标
  handleDelImage() {
    let temp = this.data.files;
    temp.splice(this.data.delIndex, 1);
    this.setData({
      delIndex: -1,
      files: temp
    });
  },

  //选择图片
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          files: this.data.files.concat(res.tempFilePaths)
        });
        console.log(this.data.files);
        if (this.data.files.length >= 8) {
          let temp = this.data.files;
          temp.splice(8);
          this.setData({
            files: temp
          });
        }
      }
    });
  },

  //预览图片
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    });
  }
});

