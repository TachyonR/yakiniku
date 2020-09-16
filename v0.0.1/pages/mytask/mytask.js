// mytask.js

const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const tasks = db.collection('tasks')

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Page({
  data: {
    useStartDate: false,
    startDate: '',
    useEndDate: false,
    endDate: '',
    myNickname: '',
    currentStatus: false,
    jobList: [],
    currentJob: '',
    taskList: []
  },
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value,
      currentJob: '',
      taskList: []
    })
  },
  bindToggleStartDate(e) {
    this.setData({
      useStartDate: e.detail.value,
      currentJob: '',
      taskList: []
    })
  },
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value,
      currentJob: '',
      taskList: []
    })
  },
  bindToggleEndDate(e) {
    this.setData({
      useEndDate: e.detail.value,
      currentJob: '',
      taskList: []
    })
  },
  bindToggleStatus: function (e) {
    this.setData({
      currentStatus: e.detail.value,
      currentJob: '',
      taskList: []
    })
  },
  bindSearchTasks: function (e) {
    if (this.data.useStartDate && this.data.useEndDate && this.data.startDate > this.data.endDate) {
      qq.showToast({
        title: '起止日期交叉',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    var index = e.currentTarget.dataset.index
    
    qq.showLoading({
      title: '查询中',
    })

    var translationCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      'block.translation': app.globalData.currentGroup.nickname,
      'block.translationStatus': this.data.currentStatus
    }

    var timingCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      'block.timing': app.globalData.currentGroup.nickname,
      'block.timingStatus': this.data.currentStatus
    }

    var proofreadCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      'block.proofread': app.globalData.currentGroup.nickname,
      'block.proofreadStatus': this.data.currentStatus
    }

    if (this.data.useStartDate && !this.data.useEndDate) {
      translationCriteria['sources.date'] = timingCriteria['sources.date'] = proofreadCriteria[['sources.date']] = db.command.gte(this.data.startDate)
    }
    if (this.data.useEndDate && !this.data.useStartDate) {
      translationCriteria['sources.date'] = timingCriteria['sources.date'] = proofreadCriteria[['sources.date']] = db.command.lte(this.data.endDate)
    }
    if (this.data.useStartDate && this.data.useEndDate) {
      translationCriteria['sources.date'] = timingCriteria['sources.date'] = proofreadCriteria[['sources.date']] = db.command.gte(this.data.startDate).and(db.command.lte(this.data.endDate))
    }

    switch (this.data.jobList[index].name) {
      case 'translation':
        tasks
        .where(translationCriteria)
        .get()
        .then(res => {
          this.setData({
            taskList: res,
            currentJob: this.data.jobList[index].name
          })
          qq.hideLoading()
        })
        break
      case 'timing':
        tasks
        .where(timingCriteria)
        .get()
        .then(res => {
          this.setData({
            taskList: res,
            currentJob: this.data.jobList[index].name
          })
          qq.hideLoading()
        })
        break
      case 'proofread':
        tasks
        .where(proofreadCriteria)
        .get()
        .then(res => {
          this.setData({
            taskList: res,
            currentJob: this.data.jobList[index].name
          })
          qq.hideLoading()
        })
        break
    }
  },
  bindChangeStatus: function (e) {
    var that = this

    qq.showActionSheet({
      itemList: this.data.currentStatus ? ['未完成'] : ['已完成'],
      itemColor: this.data.currentStatus ? 'red' : '#04BE02',
      success(res) {
        var index = e.currentTarget.dataset.index
        var indexI = index[0]
        var indexJ = index[1]
        var _task = that.data.taskList.data[indexI]
        switch (that.data.currentJob) {
          case 'translation':
            _task.block[indexJ].translationStatus = !_task.block[indexJ].translationStatus
            break
          case 'timing':
            _task.block[indexJ].timingStatus = !_task.block[indexJ].timingStatus
            break
          case 'proofread':
            _task.block[indexJ].proofreadStatus = !_task.block[indexJ].proofreadStatus
            break
        }
        _task.accomplished = that.checkTask(_task)
        tasks
        .doc(_task._id)
        .update({
          data: {
            [`block.${indexJ}`]: _task.block[indexJ],
            accomplished: _task.accomplished
          }
        })
        .then(res => {
          that.setData({
            taskList: []
          })
          qq.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  onLoad: function () {
    qq.setNavigationBarTitle({
      title: '我的稿件'
    })

    var _jobList = []
    for (var i = 0; i < app.globalData.currentGroup.jobs.length; i++) {
      switch (app.globalData.currentGroup.jobs[i].name) {
        case 'translation':
        case 'timing':
        case 'proofread':
          _jobList.push(app.globalData.currentGroup.jobs[i])
          break
      }
    }
    this.setData({
      myNickname: app.globalData.currentGroup.nickname,
      jobList: _jobList
    })

    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var dateString = [year, month, day].map(formatNumber).join('-')

    this.setData({
      startDate: dateString,
      endDate: dateString
    })
  },
  checkTask: function (task) {
    if (task.thumbnailStatus) {
      if (task.block.every(token => {return token.proofreadStatus})){
        return true
      }
    }
    else {
      return false
    }
  }
})