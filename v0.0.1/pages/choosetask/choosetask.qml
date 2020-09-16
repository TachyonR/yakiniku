<view style="overflow-x: hidden">
  <block qq:if="{{!taskDetail}}">
    <view class="section">
      <view class="divided-container">
        <view class="button-mimic" style="{{useStartDate ? 'color: black' : 'color: grey'}}">
          <switch color="#376df6" bindchange="bindToggleStartDate" checked="{{useStartDate}}"/>
          <picker
            disabled="{{!useStartDate}}"
            mode="date"
            value="{{startDate}}"
            start="2020-09-01"
            end="2030-09-01"
            bindchange="bindStartDateChange"
          >
            <view class="picker">
              起始日期：{{startDate}}
            </view>
          </picker>
        </view>

        <view class="subdivider"/>

        <view class="button-mimic" style="{{useEndDate ? 'color: black' : 'color: grey'}}">
          <switch color="#376df6" bindchange="bindToggleEndDate" checked="{{useEndDate}}"/>
          <picker
            disabled="{{!useEndDate}}"
            mode="date"
            value="{{endDate}}"
            start="2020-09-01"
            end="2030-09-01"
            bindchange="bindEndDateChange"
          >
            <view class="picker">
              截止日期：{{endDate}}
            </view>
          </picker>
        </view>

      </view>
    </view>
    <view class="section">
      <view class="tab-container">
        <block qq:for="{{jobList}}" qq:key="index">
          <button qq:if="{{item.checked}}" data-index="{{index}}" bindtap="bindAvailableTasks" type="{{currentJob == item.name ? 'blue-tab' : 'tab'}}"> {{item.value}}</button>
        </block>
      </view>
    </view>
    <block qq:for="{{taskList.data}}" qq:key="index">
      <button bindtap="bindTaskDetail" data-index="{{index}}"> {{item.title}}\n </button>
    </block>
  </block>
  <block qq:elif="{{!subtaskDetail}}">
    <view class="section">
      <view class="title"> 标题 </view>
      <view class="button-mimic"> {{currentTask.title}} </view>
    </view>
    <view class="section">
      <view class="title"> 源 </view>
      <view qq:for="{{currentTask.sources}}" qq:key="index" class="divided-container">
        <view qq:if="{{index}}" class="subdivider"/>
        <view class="button-mimic"> 
          {{item.date}} 
          <text style="color: #878b97"> {{item.title}} </text>
        </view>
      </view> 
    </view>
    <view class="section">
      <view class="title"> 分段 </view>
      <view qq:for="{{currentTask.block}}" qq:key="index" class="divided-container">
        <view qq:if="{{index}}" class="subdivider"/>
        <button bindtap="bindSubtitle" data-index="{{index}}" style="color: #376df6">
          {{item.subtitle}}
          <view qq:if="{{chosenSubtaskList[index]}}" class="tick"></view>
        </button>
      </view>
    </view>
    <view class="section" qq:if="{{currentTask.comment != ''}}">
      <view class="title"> 备注 </view>
      <view class="button-mimic"> {{currentTask.comment}} </view>
    </view>
    <view style="display: flex; padding-left: 5%; padding-right: 5%" class="section">
      <button style="width: 40%" bindtap="bindDetailBack" type="default"> 返回 </button>
      <button style="width: 40%" bindtap="bindDetailConfirm" type="primary"> 确认 </button>
    </view>
  </block>
  <block qq:else>
    <view class="section">
      <view class="title"> 翻译 </view>
      <button qq:if="{{currentJob == 'translation' && !currentSubtaskBlock.translationStatus}}" bindtap="bindUpdateName" style="color: #376df6">
        {{currentSubtaskBlock.translation != '' ? currentSubtaskBlock.translation : '暂无翻译'}}
        <view class="tick" qq:if="{{chosenSubtaskList[currentSubtaskBlockIndex]}}"></view>
      </button>
      <view qq:else class="button-mimic">
        {{currentSubtaskBlock.translation != '' ? currentSubtaskBlock.translation : '暂无翻译'}}
        <view class="tick-green" qq:if="{{currentSubtaskBlock.translationStatus}}"/>
      </view>
    </view>
    <view class="section">
      <view class="title"> 时轴 </view>
      <button qq:if="{{currentJob == 'timing' && !currentSubtaskBlock.timingStatus}}" bindtap="bindUpdateName" style="color: #376df6">
        {{currentSubtaskBlock.timing != '' ? currentSubtaskBlock.timing : '暂无时轴'}}
        <view class="tick" qq:if="{{chosenSubtaskList[currentSubtaskBlockIndex]}}"></view>
      </button>
      <view qq:else class="button-mimic">
        {{currentSubtaskBlock.timing != '' ? currentSubtaskBlock.timing : '暂无时轴'}}
        <view class="tick-green" qq:if="{{currentSubtaskBlock.timingStatus}}"/>
      </view>
    </view>
    <view class="section">
      <view class="title"> 校对 </view>
      <button qq:if="{{currentJob == 'proofread' && !currentSubtaskBlock.proofreadStatus}}" bindtap="bindUpdateName" style="color: #376df6">
        {{currentSubtaskBlock.proofread != '' ? currentSubtaskBlock.proofread : '暂无校对'}}
        <view class="tick" qq:if="{{chosenSubtaskList[currentSubtaskBlockIndex]}}"></view>
      </button>
      <view qq:else class="button-mimic">
        {{currentSubtaskBlock.proofread != '' ? currentSubtaskBlock.proofread : '暂无校对'}}
        <view class="tick-green" qq:if="{{currentSubtaskBlock.proofreadStatus}}"/>
      </view>
    </view>
    <view class="section" qq:if="{{currentTask.useTimeRange}}">
      <view class="title"> 时长 </view>
      <view class="button-mimic" style="display: flex">
        <view style="display: flex">
          <view class="tt"> {{prevHour}} </view>
          <text space="ensp"> : </text>
          <view class="tt"> {{prevMinute}} </view>
          <text space="ensp"> : </text>
          <view class="tt"> {{prevSecond}} </view>
        </view>
        <text space="ensp">  -  </text>
        <view style="display: flex">
          <view class="tt"> {{thisHour}} </view>
          <text space="ensp"> : </text>
          <view class="tt"> {{thisMinute}} </view>
          <text space="ensp"> : </text>
          <view class="tt"> {{thisSecond}} </view>
        </view>
      </view>
    </view>
    <view class="section">
      <button bindtap="bindSubtaskBack" type="primary"> 确认并返回 </button>
    </view>
  </block>
</view>

<view class="bottom-placeholder"/>