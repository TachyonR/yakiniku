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
        <button bindtap="bindRed" type="{{currentList == 'red' ? 'red-tab' : 'tab'}}"> 无封面 </button>
        <button bindtap="bindYellow" type="{{currentList == 'yellow' ? 'yellow-tab' : 'tab'}}"> 进行中 </button>
        <button bindtap="bindGreen" type="{{currentList == 'green' ? 'green-tab' : 'tab'}}"> 已完成 </button>
      </view>
      <view qq:if="{{currentList == 'red'}}" class="divided-container">
        <block qq:for="{{redList}}" qq:key="index">
          <view qq:if="{{index}}" class="subdivider"/>
          <view qq:else class="divider"/>
          <button bindtap="bindDetail" data-index="{{index}}"> {{item.title}} </button>
        </block>
      </view>
      <view qq:elif="{{currentList == 'yellow'}}" class="divided-container">
        <block qq:for="{{yellowList}}" qq:key="index">
          <view qq:if="{{index}}" class="subdivider"/>
          <view qq:else class="divider"/>
          <button bindtap="bindDetail" data-index="{{index}}"> {{item.title}} </button>
        </block>
      </view>
      <view qq:elif="{{currentList == 'green'}}" class="divided-container"> 
        <block qq:for="{{greenList}}" qq:key="index">
          <view qq:if="{{index}}" class="subdivider"/>
          <view qq:else class="divider"/>
          <button bindtap="bindDetail" data-index="{{index}}"> {{item.title}} </button>
        </block>
      </view>
    </view>
  </block>
  <block qq:else>
    <view class="section">
      <view class="title"> 标题 </view>
      <view class="button-mimic"> {{detailedTask.title}} </view>
    </view>
    <view class="section" qq:if="{{detailedTask.comment != ''}}">
      <view class="title"> 备注 </view>
      <view class="button-mimic">
        {{detailedTask.comment}}
      </view>
    </view>
    <view class="section" style="display:flex; padding-left: 5%; padding-right: 5%">
      <button bindtap="bindBack" type="primary" style="{{currentList == 'yellow' ? 'width: 25%' : 'width: 40%'}}"> 返回 </button>
      <button qq:if="{{currentList == 'red'}}" style="width: 40%" bindtap="bindGetJob" type="primary-yellow"> 选择 </button>
      <button qq:if="{{currentList == 'yellow'}}" style="width: 25%" bindtap="bindAbandonJob" type="warn"> 放弃 </button>
      <button qq:if="{{currentList == 'yellow'}}" style="width: 25%" bindtap="bindToGreen" type="primary-green"> 完成 </button>
      <button qq:if="{{currentList == 'green'}}" style="width: 40%" bindtap="bindToYellow" type="primary-yellow"> 未完成 </button>
    </view>
  </block>
</view>

<view class="bottom-placeholder"/>