<view style="overflow-x:hidden">
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
    
    <view class="tab-container">
      <button bindtap="bindRed" type="{{currentList == 'red' ? 'red-tab' : 'tab'}}"> 进行中 </button>
      <button bindtap="bindYellow" type="{{currentList == 'yellow' ? 'yellow-tab' : 'tab'}}"> 未发布 </button>
      <button bindtap="bindGreen" type="{{currentList == 'green' ? 'green-tab' : 'tab'}}"> 已发布 </button>
    </view>
    <view qq:if="{{currentList == 'red'}}" class="divided-container">
      <block qq:for="{{redList}}" qq:key="index">
        <view qq:if="{{index}}" class="subdivider"/>
        <view qq:else class="divider"/>
        <button bindtap="bindDetail" data-index="{{index}}"> {{item.title}} </button>
      </block>
    </view>
    <block qq:elif="{{currentList == 'yellow'}}">
      <block qq:for="{{yellowList}}" qq:key="index">
        <view qq:if="{{index}}" class="subdivider"/>
        <view qq:else class="divider"/>
        <button bindtap="bindDetail" data-index="{{index}}"> {{item.title}} </button>
      </block>
    </block>
    <block qq:elif="{{currentList == 'green'}}"> 
      <block qq:for="{{greenList}}" qq:key="index">
        <view qq:if="{{index}}" class="subdivider"/>
        <view qq:else class="divider"/>
        <button bindtap="bindDetail" data-index="{{index}}"> {{item.title}} </button>
      </block>
    </block>
  </block>
  <block qq:else>
    <view class="section">
      <view class="title"> 标题 </view>
      <view class="button-mimic"> {{detailedTask.title}} </view>
    </view>

    <view class="section" qq:if="{{detailedTask.needEditing}}">
      <view class="title"> 剪辑 </view>
      <view class="button-mimic">
        {{detailedTask.edit}} 
        <view qq:if="{{detailedTask.editStatus}}" class="tick-green"/>
      </view>
    </view>

    <view class="section">
      <view class="title"> 各段状态 </view>
      <view qq:for="{{detailedTask.block}}" qq:key="index">
        <view qq:if="{{index}}" class="divider"></view>
        <view class="divided-container">
          <view class="button-mimic" style="{{item.translationStatus && item.timingStatus && item.proofreadStatus ? 'color: #04BE02' : 'color: red'}}"> {{item.subtitle}} </view>
          <view class="divider"/>

          <view style="display:flex">
            <view class="button-mimic" style="width: 3rem"> 翻译 </view>
            <view class="button-mimic" style="width: 100%">
              {{item.translation != '' ? item.translation : '暂无翻译'}} 
              <view class="tick-green" qq:if="{{item.translationStatus}}"></view>
            </view>
          </view>
          <view class="subdivider"/>
          <view style="display:flex">
            <view class="button-mimic" style="width: 3rem"> 时轴 </view>
            <view class="button-mimic" style="width: 100%"> 
              <!-- <view class="line-horizontal" style="margin-left: 0"/>  -->
              {{item.timing != '' ? item.timing : '暂无时轴'}} 
              <view class="tick-green" qq:if="{{item.timingStatus}}"></view>
            </view>
          </view>
          <view class="subdivider"/>
          <view style="display:flex">
            <view class="button-mimic" style="width: 3rem"> 校对 </view>
            <view class="button-mimic" style="width: 100%">
              {{item.proofread != '' ? item.proofread : '暂无校对'}} 
              <view class="tick-green" qq:if="{{item.proofreadStatus}}"></view>
            </view>
          </view>

        </view>
      </view>
    </view>

    <view class="section" qq:if="{{detailedTask.needPostProcessing}}">
      <view class="title"> 后期 </view>
      <view class="button-mimic">
        {{detailedTask.postProcess}} 
        <view qq:if="{{detailedTask.postProcessStatus}}" class="tick-green"/>
      </view>
    </view>

    <view class="section">
      <view class="title"> 封面 </view>
      <view class="button-mimic">
        {{detailedTask.thumbnail != '' ? detailedTask.thumbnail : '暂无封面'}} 
        <view qq:if="{{detailedTask.thumbnailStatus}}" class="tick-green"/>
      </view>
    </view>

    <view class="section">
      <view class="title"> 备注 </view>
      <view class="button-mimic">
        {{detailedTask.comment != '' ? detailedTask.comment : '暂无备注'}} 
      </view>
    </view>

    <view class="section" style="display:flex">
    <button bindtap="bindBack" type="primary" style="{{currentList == 'red' ? 'width:90%' : 'width:40%'}}"> 返回 </button>
    <button qq:if="{{currentList == 'yellow'}}" bindtap="bindToGreen" type="primary-green" style="width:40%"> 已发布 </button>
    <button qq:if="{{currentList == 'green'}}" bindtap="bindToYellow" type="primary-yellow" style="width:40%"> 未发布 </button>
    </view>
  </block>
</view>

<view class="bottom-placeholder"/>