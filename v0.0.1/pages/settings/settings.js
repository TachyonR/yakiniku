// settings.js

const app = getApp()

Page({
  data: {
    nickname: '',
    checkboxItems: [],
    numberOfChecked: 0
  },
  bindSwitchChange: function (e) {
    var index = e.currentTarget.dataset.index
    var _checkbox = this.data.checkboxItems
    _checkbox[index].checked = e.detail.value
    var _numberOfChecked = this.data.numberOfChecked + (e.detail.value ? 1 : -1)
    this.setData({
      checkboxItems: _checkbox,
      numberOfChecked: _numberOfChecked
    })
  },
  bindConfirm: function () {
    if (this.data.nickname == '') {
      qq.showToast({
        title: '请填写昵称',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    if (!this.data.numberOfChecked) {
      qq.showToast({
        title: '请选择职务',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    app.globalData.currentGroup.nickname = this.data.nickname

    app.globalData.currentGroup.jobs = this.data.checkboxItems

    var _groupList = qq.getStorageSync('groups')
    if (_groupList) {
      var groupList = JSON.parse(_groupList)
      var nameList = groupList.map(token => {
        return token.name
      })
      var index = nameList.indexOf(app.globalData.currentGroup.name)
      groupList[index] = app.globalData.currentGroup
      qq.setStorageSync('groups', JSON.stringify(groupList))
    }
    
    qq.showToast({
      title: '设置修改成功',
      icon: 'success',
      duration: 2000
    })

    qq.navigateBack({
      delta: 1
    })
  },
  bindNicknameInput: function (e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  onLoad: function() {
    qq.setNavigationBarTitle({
      title: '个人设置'
    })

    if (app.globalData.currentGroup.jobs) {
      var _numberOfChecked = 0
      for (var i = 0; i < app.globalData.currentGroup.jobs.length; i++) {
        if (app.globalData.currentGroup.jobs[i].checked) _numberOfChecked++
      }
      this.setData({
        nickname: app.globalData.currentGroup.nickname,
        checkboxItems: app.globalData.currentGroup.jobs,
        numberOfChecked: _numberOfChecked
      })
    }
    else {
      this.setData({
        nickname: '',
        checkboxItems: [
          {name: 'edit', value: '剪辑', checked: false},
          {name: 'timing', value: '时轴', checked: false},
          {name: 'translation', value: '翻译', checked: true},
          {name: 'proofread', value: '校对', checked: false},
          {name: 'thumbnail', value: '封面', checked: false},
          {name: 'postProcess', value: '后期', checked: false},
        ],
        numberOfChecked: 1
      })
    }
  }
})