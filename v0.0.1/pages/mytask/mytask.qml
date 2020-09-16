<view style="overflow-x: hidden">
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
    <view class="button-mimic">
      已完成
      <switch bindchange="bindToggleStatus" color="#376df6" checked="{{currentStatus}}"/>
    </view>
  </view>

  <view class="section">
    <view class="tab-container">
      <block qq:for="{{jobList}}" qq:key="index">
        <button qq:if="{{item.checked}}" data-index="{{index}}" bindtap="bindSearchTasks" type="{{currentJob == item.name ? 'blue-tab' : 'tab'}}"> {{item.value}}</button>
      </block>
    </view>
  </view>

  <view qq:for="{{taskList.data}}" qq:for-index="indexI" qq:for-item="i" class="section">
    <view class="button-mimic"> {{i.title}} </view>
    <view class="divider"/>
    <view qq:for="{{i.block}}" qq:for-index="indexJ" qq:for-item='j'>
      <button bindtap="bindChangeStatus" qq:if="{{currentJob == 'translation' && j.translation == myNickname && j.translationStatus == currentStatus}}" data-index="{{[indexI,indexJ]}}" style="color: #376df6"> {{j.subtitle}} </button>
      <button bindtap="bindChangeStatus" qq:if="{{currentJob == 'timing' && j.timing == myNickname && j.timingStatus == currentStatus}}" data-index="{{[indexI,indexJ]}}" style="color: #376df6"> {{j.subtitle}} </button>
      <button bindtap="bindChangeStatus" qq:if="{{currentJob == 'proofread' && j.proofread == myNickname && j.proofreadStatus == currentStatus}}" data-index="{{[indexI,indexJ]}}" style="color: #376df6"> {{j.subtitle}} </button>
    </view>
  </view>
</view>

<view class="bottom-placeholder"/>