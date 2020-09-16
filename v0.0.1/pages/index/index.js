//index.js
//获取应用实例
const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const groups = db.collection('groups')
const tasks = db.collection('tasks')
const $ = db.command.aggregate

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: qq.canIUse('button.open-type.getUserInfo'),
    buttonText: "测试按钮",
    groupList: [],
    addGroup: false,
    currentPassword: '',
    groupEntered: false,
    myJobs: {
      edit: false,
      postProcess: false,
      translation: false,
      timing: false,
      proofread: false,
      thumbnail: false
    }
  },
  //事件处理函数
  bindViewTap: function () {
    qq.navigateTo({
      url: '../logs/logs'
    })
  },
  bindTestButton: function () {
    this.setData({
      buttonText: "修改成功"
    })
  },
  bindSettings: function () {
    qq.navigateTo({
      url: '../settings/settings'
    })
  },
  bindStats: function () {
    qq.navigateTo({
      url: '../stats/stats'
    })
  },
  bindAddSource: function () {
    qq.navigateTo({
      url: '../addsource/addsource'
    })
  },
  bindAddTask: function () {
    qq.navigateTo({
      url: '../addtask/addtask'
    })
  },
  bindEditSource: function () {
    qq.navigateTo({
      url: '../editsource/editsource'
    })
  },
  bindEditTask: function () {
    qq.navigateTo({
      url: '../edittask/edittask'
    })
  },
  bindChooseTask: function () {
    qq.navigateTo({
      url: '../choosetask/choosetask'
    })
  },
  bindTaskStatus: function () {
    qq.navigateTo({
      url: '../taskstatus/taskstatus'
    })
  },
  bindMyTask: function () {
    qq.navigateTo({
      url: '../mytask/mytask'
    })
  },
  bindAddThumbnail: function () {
    qq.navigateTo({
      url: '../addthumbnail/addthumbnail'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      qq.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var _groupList = qq.getStorageSync('groups')
    if (_groupList) {
      this.setData({
        groupList: JSON.parse(_groupList)
      })
    }   
  },
  onShow: function () {
    if (app.globalData.currentGroup) {
      this.getAvailableButtons()
    }
  },
  bindAddGroup: function () {
    this.setData({
      addGroup: true
    })
  },
  bindPasswordInput: function(e) {
    this.setData({
      currentPassword: e.detail.value
    })
  },
  bindPasswordConfirm: function(e) {
    groups
    .where({
      password: this.data.currentPassword
    })
    .get()
    .then(res => {
      if (res.data.length) {
        var _list = this.data.groupList
        var _nameList = _list.map(token => {
          return token.name
        })
        if (!_nameList.includes(res.data[0].name)) {
          _list.push({
            name: res.data[0].name,
            password: res.data[0].password,
            nickname: null,
            jobs: null
          })
          this.setData({
            groupList: _list
          })
        }
        else {
          console.log('repeated character!')
        }
        qq.setStorageSync('groups', JSON.stringify(this.data.groupList))
      }
      this.setData({
        addGroup: false
      })
    })
  },
  bindEnterGroup: function (e) {
    var index = e.currentTarget.dataset.index
    app.globalData.currentGroup = this.data.groupList[index]

    qq.setNavigationBarTitle({
      title: app.globalData.currentGroup.name
    })

    this.setData({
      groupEntered: true,
      myJobs: {
        edit: false,
        postProcess: false,
        translation: false,
        timing: false,
        proofread: false,
        thumbnail: false
      }
    })
    this.getAvailableButtons()
  },
  bindExitGroup: function() {
    qq.setNavigationBarTitle({
      title: '任务清单'
    })

    this.setData({
      groupEntered: false,
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getAvailableButtons: function () {
    var _myJobs = this.data.myJobs
    var _jobs = app.globalData.currentGroup.jobs

    if (!_jobs) return

    for (var i = 0; i < _jobs.length; i++) {
      var checked = _jobs[i].checked
      switch (_jobs[i].name) {
        case 'edit': _myJobs.edit = checked; break;
        case 'translation': _myJobs.translation = checked; break;
        case 'timing': _myJobs.timing = checked; break;
        case 'proofread': _myJobs.proofread = checked; break;
        case 'thumbnail': _myJobs.thumbnail = checked; break;
        case 'postProcess': _myJobs.postProcess = checked; break;
      }
    }
    this.setData({
      myJobs: _myJobs
    })
  }
})
