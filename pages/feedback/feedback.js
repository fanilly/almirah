// pages/feedback/feedback.js
const app = getApp();
let textareaValue = ''; //记录文本域输入的内容
Page({

  //
  data: {
    focus: false, //文本域是否获取焦点
    textareaValueLen: 0, //记录当前文本域输入内容的长度
    curIndex: 2, //当前聚焦的单选框索引
    radioItems: ['功能异常：功能故障或不可用', '产品建议：用的不爽，我有建议', '其他问题']
  },

  //单选事件
  handleCheckout(e) {
    this.setData({
      curIndex: e.currentTarget.id
    });
  },

  //记录输入内容
  handleQuestionContent(e) {
    textareaValue = e.detail.value;
    this.setData({
      textareaValueLen: textareaValue.length
    });
  },

  //点击提交反馈按钮事件
  handleConfrimFeedback() {
    //如果用户输入字符小于15 弹框提示用户 并自动获取焦点
    if (this.data.textareaValueLen < 15) {
      wx.showModal({
        content: '请补充详细问题或意见,不得小于15个字符',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            this.setData({
              focus:true
            });
          }
        }
      });
    }else{
      //在这里添加提交反馈的业务
      wx.showLoading({title:'提交中'});
      wx.request({
        url:`${app.globalData.api}/user/callback`,
        data:{
          userId:app.globalData.userID,
          questionType:this.data.curIndex+1, //问题类型
          content:textareaValue
        },
        success:res=>{
          wx.hideLoading();
          if(res.data.status == 1){
            wx.showModal({
              title:'提交成功',
              content:'您反馈的问题我们会及时整理并改进，客户的满意是我们永恒的追求，祝您生活愉快！',
              showCancel: false
            });
          }else{
            wx.showToast({
              title:'网络异常',
              image:'../../assets/warning.png',
              duration:1500
            });
          }
        }
      });
    }
  }
});
