//choosetask.js

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
    jobList: [],
    currentJob: '',
    taskList: [],
    taskDetail: false,
    currentTask: {},
    subtaskDetail: false,
    currentSubtaskBlock: {},
    currentSubtaskBlockIndex: -1,
    currentTimeRange: {
      prevHour: '',
      prevMinute: '',
      prevSecond: '',
      thisHour: '',
      thisMinute: '',
      thisSecond: ''
    },
    chosenSubtaskList: []
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
  bindAvailableTasks: function (e) {
    if (this.data.useStartDate && this.data.useEndDate && this.data.startDate > this.data.endDate) {
      qq.showToast({
        title: '起止日期交叉',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    var index = e.currentTarget.dataset.index

    var translationCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      'block.translationStatus': false
    }
    var timingCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      'block.timingStatus': false
    }
    var proofreadCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      'block.proofreadStatus': false
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
    
    qq.showLoading({
      title: '查询中',
    })
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
  bindTaskDetail: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      taskDetail: true,
      currentTask: this.data.taskList.data[index],
      chosenSubtaskList: this.data.taskList.data[index].block.map(_ => {return false})
    })
  },
  bindDetailBack: function () {
    this.setData({
      taskDetail: false
    })
  },
  bindDetailConfirm: function () {
    for (var i = 0; i < this.data.chosenSubtaskList.length; i++) {
      if (this.data.chosenSubtaskList[i]) {
        tasks
        .doc(this.data.currentTask._id)
        .update({
          data: {
            [`block.${i}.${this.data.currentJob}`]: this.data.currentTask.block[i][this.data.currentJob]
          }
        })
        .then()
      }
    }
    this.setData({
      taskDetail: false
    })
  },
  bindSubtitle: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      subtaskDetail: true,
      currentSubtaskBlock: this.data.currentTask.block[index],
      currentSubtaskBlockIndex: index,
      prevHour: index ? formatNumber(this.data.currentTask.timeRange[index-1].hour) : '00',
      prevMinute: index ? formatNumber(this.data.currentTask.timeRange[index-1].minute) : '00',
      prevSecond: index ? formatNumber(this.data.currentTask.timeRange[index-1].second) : '00',
      thisHour: formatNumber(this.data.currentTask.timeRange[index].hour),
      thisMinute: formatNumber(this.data.currentTask.timeRange[index].minute),
      thisSecond: formatNumber(this.data.currentTask.timeRange[index].second),
    })

  },
  bindUpdateName: function () {
    // this switch here can be changed into [this.data.currentJob] 
    switch (this.data.currentJob) {
      case 'translation':
        var _block = this.data.currentSubtaskBlock
        _block.translation = app.globalData.currentGroup.nickname
        this.setData({
          currentSubtaskBlock: _block
        })
        break
      case 'timing':
        var _block = this.data.currentSubtaskBlock
        _block.timing = app.globalData.currentGroup.nickname
        this.setData({
          currentSubtaskBlock: _block
        })
        break
      case 'proofread':
        var _block = this.data.currentSubtaskBlock
        _block.proofread = app.globalData.currentGroup.nickname
        this.setData({
          currentSubtaskBlock: _block
        })
        break
    }
    var _chosenIndex = 'chosenSubtaskList[' + this.data.currentSubtaskBlockIndex + ']'
    this.setData({
      [_chosenIndex]: true
    })
  },
  bindSubtaskBack: function () {
    var _task = this.data.currentTask
    _task.block[this.data.currentSubtaskBlockIndex] = this.data.currentSubtaskBlock
    this.setData({
      currentTask: _task,
      subtaskDetail: false,
      currentSubtaskBlock: {},
      currentSubtaskBlockIndex: -1,
    })
  },
  onLoad: function () {
    qq.setNavigationBarTitle({
      title: '选择稿件'
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
  }
})