//editsource.js

const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const source = db.collection('source')

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const _ = db.command

Page({
  data: {
    sourceFound: false,
    sourceList: [],
    useStartDate: false,
    startDate: '',
    useEndDate: false,
    endDate: '',
    themeList: [],
    characterList: [],
    sourceElement: {},
    sourceDetail: false
  },
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindToggleStartDate(e) {
    this.setData({
      useStartDate: e.detail.value
    })
  },
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  bindToggleEndDate(e) {
    this.setData({
      useEndDate: e.detail.value
    })
  },
  addSearchTheme: function () {
    var _list = this.data.themeList;
    _list.push('');
    this.setData({
       themeList: _list
    })
  },
  delSearchTheme: function (e) {
    var _list = this.data.themeList;
    _list.splice(e.currentTarget.dataset.index,1);
    this.setData({
        themeList: _list
    })
  },
  bindAddSearchTheme: function (e) {
    var _list = this.data.themeList;
    _list[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({
      themeList: _list
    })
  },
  addSearchCharacter: function () {
    var _list = this.data.characterList;
    _list.push('');
    this.setData({
       characterList: _list
    })
  },
  delSearchCharacter: function (e) {
    var _list = this.data.characterList;
    _list.splice(e.currentTarget.dataset.index,1);
    this.setData({
        characterList: _list
    })
  },
  bindAddSearchCharacter: function (e) {
    var _list = this.data.characterList;
    _list[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({
      characterList: _list
    })
  },
  bindSearch: function () {
    if (this.data.useStartDate && this.data.useEndDate && this.data.startDate > this.data.endDate) {
      qq.showToast({
        title: '起止日期交叉',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    if (this.data.themeList.indexOf('') != -1 || this.data.characterList.indexOf('') != -1) {
      qq.showToast({
        title: '条件不可为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    qq.showLoading({
      title: '查询中',
    })

    var sourceCriterion = {'characterList': _.eq(app.globalData.currentGroup.name)}

    if (this.data.themeList.length) {
      sourceCriterion['themeList'] = _.in(this.data.themeList)
    }
    if (this.data.characterList.length) {
      sourceCriterion['characterList'] = _.and([_.in(this.data.characterList), _.eq(app.globalData.currentGroup.name)])
    }
    if (this.data.useStartDate && !this.data.useEndDate) {
      sourceCriterion['date'] = db.command.gte(this.data.startDate)
    }
    if (this.data.useEndDate && !this.data.useStartDate) {
      sourceCriterion['date'] = db.command.lte(this.data.endDate)
    }
    if (this.data.useStartDate && this.data.useEndDate) {
      sourceCriterion['date'] = db.command.gte(this.data.startDate).and(db.command.lte(this.data.endDate))
    }

    source
    .where(sourceCriterion)
    .get()
    .then(res => {
      qq.hideLoading()
      this.setData({
          sourceList: res.data.map(singleSource => {
            return {
              _id: singleSource._id,
              date: singleSource.date, 
              title: singleSource.title,
              themeList: singleSource.themeList,
              characterList: singleSource.characterList,
              suspended: singleSource.suspended,
              uploaded: singleSource.uploaded,
              comment: singleSource.comment
            }
          })
      })
      this.setData({
        sourceFound: true
      })
    })
  },
  bindIndividualSource: function (e) {
    this.setData({
      sourceElement: this.data.sourceList[e.currentTarget.dataset.index],
      sourceDetail: true
    })
  },
  bindBack: function () {
    this.setData({
      sourceFound: false
    })
  },
  bindChangeTitle: function (e) {
      var _newElement = this.data.sourceElement
      _newElement.title = e.detail.value
      this.setData({
        sourceElement: _newElement
      })
  },
  bindDetailBack: function () {
    this.setData({
      sourceFound: true,
      sourceDetail: false
    })
    this.bindSearch()
  },
  bindDateChange(e) {
    this.setData({
      'sourceElement.date': e.detail.value
    })
  },
  addTheme: function () {
    var _list = this.data.sourceElement.themeList;
    _list.push('');
    this.setData({
       'sourceElement.themeList': _list
    })
  },
  delTheme: function (e) {
    var _list = this.data.sourceElement.themeList;
    _list.splice(e.currentTarget.dataset.index,1);
    this.setData({
      'sourceElement.themeList': _list
    })
  },
  bindAddTheme: function (e) {
    var _list = this.data.sourceElement.themeList;
    _list[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({
      'sourceElement.themeList': _list
    })
  },
  addCharacter: function () {
    var _list = this.data.sourceElement.characterList;
    _list.push('');
    this.setData({
      'sourceElement.characterList': _list
    })
  },
  delCharacter: function (e) {
    var _list = this.data.sourceElement.characterList;

    if (_list.length == 1) {
      qq.showToast({
        title: '角色不能为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    _list.splice(e.currentTarget.dataset.index,1);
    this.setData({
      'sourceElement.characterList': _list
    })
  },
  bindAddCharacter: function (e) {
    var _list = this.data.sourceElement.characterList;
    _list[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({
      'sourceElement.characterList': _list
    })
  },
  bindSuspended: function (e) {
    this.setData({
      'sourceElement.suspended': e.detail.value
    })
  },
  bindUploaded: function (e) {
    this.setData({
      'sourceElement.uploaded': e.detail.value
    })
  },
  bindComment: function (e) {
    this.setData({
      'sourceElement.comment': e.detail.value
    })
  },
  bindDetailDelete: function () {
    var that = this

    qq.showActionSheet({
      itemList: ['确认删除'],
      itemColor: 'red',
      success(res) {
        source
        .doc(that.data.sourceElement._id)
        .remove()
        .then(res => {
          that.setData({
            sourceDetail: false
          })
          that.bindSearch()
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  bindDetailConfirm: function() {
    if (this.data.sourceElement.title == '') {
      qq.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }
    
    source
    .doc(this.data.sourceElement._id)
    .update({
      data: {
        date: this.data.sourceElement.date, 
        title: this.data.sourceElement.title,
        themeList: this.data.sourceElement.themeList,
        characterList: this.data.sourceElement.characterList,
        suspended: this.data.sourceElement.suspended,
        uploaded: this.data.sourceElement.uploaded,
        comment: this.data.sourceElement.comment
      }
    })
    .then(res => {
      this.setData({
        sourceDetail: false
      })
      this.bindSearch()
    })
  },
  onLoad: function() {
    qq.setNavigationBarTitle({
      title: '编辑源信息'
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