<view style="overflow-x:hidden">
  <view qq:if="{{!showTaskDetail}}">
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
      <view class="divider"/> 
      
      <button bindtap="updateLists" style="color: #376df6; text-align: center"> 更新检索条件 </button>
      <!-- <view class="divider"/> -->
    </view>
    
    <view class="section">
      <view qq:for="{{taskList}}" qq:key="index" class="divided-container">
        <view qq:if="{{index}}" class="subdivider"/>
        <button bindtap="bindEnterTaskDetail" data-index="{{index}}"> {{item.title}} </button>
      </view>
    </view>
  </view>

  <view qq:if="{{showTaskDetail}}">
    <view qq:if="{{!showSourceDetail}}">
      <view qq:if="{{!showAvailable}}">
        <view class="section">
          <view class="title"> 标题 </view>
          <input placeholder="请输入标题" value="{{title}}" bindinput="bindTitleInput"></input>
        </view>
        
        <view class="section">
          <view class="title"> 源 </view>
          <view qq:for="{{sourceList}}" qq:key="index" class="divided-container">
            <button bindtap="bindSourceDetail" data-index="{{index}}">
              {{item.date}}
              <text style="color: #878b97"> {{item.title}} </text>
            </button>
            <view class="subdivider"/>
          </view>
          <button bindtap="bindNewSource" style="color: #376df6"> 添加源 </button>
        </view>

        <view class="section">
          <view class="title"> 剪辑 </view>
          <view class="button-mimic">
            需要剪辑
            <switch color="#376df6" bindchange="bindToggleNeedEditing" checked="{{needEditing}}"/>
          </view>
          <view qq:if="{{needEditing}}" class="divided-container">
            <view class="subdivider"/>
            <view style="display:flex">
              <view class="button-mimic" style="width: 3rem"> 剪辑 </view>
              <view class="button-mimic" style="width: 100%">
                <text style="color: #376df6; font-size: 1rem; padding: 0"> {{edit}} </text>
                <view class="tick-green" qq:if="{{editStatus}}"/>
              </view>
            </view>
            <view class="subdivider"/>
            <view class="button-mimic">
              已完成
              <switch color="#04BE02" bindchange="bindToggleEditStatus" checked="{{editStatus}}"/>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="title"> 后期 </view>
          <view class="button-mimic">
            需要后期
            <switch color="#376df6" bindchange="bindToggleNeedPostProcessing" checked="{{needPostProcessing}}"/>
          </view>
          <view qq:if="{{needPostProcessing}}" class="divided-container">
            <view class="subdivider"/>
            <view style="display:flex">
              <view class="button-mimic" style="width: 3rem"> 后期 </view>
              <view class="button-mimic" style="width: 100%">
                <text style="color: #376df6; font-size: 1rem; padding: 0"> {{postProcess}} </text>
                <view class="tick-green" qq:if="{{postProcessStatus}}"/>
              </view>
            </view>
            <view class="subdivider"/>
            <view class="button-mimic">
              已完成
              <switch color="#04BE02" bindchange="bindTogglePostProcessStatus" checked="{{postProcessStatus}}"/>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="title"> 分段 </view>
          <view qq:for="{{blockList}}" qq:key="index">
            <input placeholder="请输入分段标题" value="{{item.subtitle}}" bindinput="bindSubtitleInput" data-index="{{index}}">
              <view class="close" bindtap="bindDelSubtask" data-index="{{index}}" style="right: 2rem"></view>
            </input>
            <view class="subdivider"/>
          </view>
          <button bindtap="bindNewSubtask" style="color: #376df6"> 添加分段 </button>
        </view>

        <view class="section">
          <view class="button-mimic">
            启用分段时长
            <switch color="#376df6" bindchange="bindToggleTimeRange" checked="{{useTimeRange}}"/>
          </view>
          <view qq:for="{{blockList}}" qq:key="index" qq:if="{{useTimeRange}}" class="divided-container">
            <view qq:if="{{index}}" class="subdivider"/>
            <view qq:else class="divider"/>
            <view class="button-mimic">
            <picker
              mode="multiSelector"
              bindchange="bindTimePickerChange"
              value="{{[timeRange[index].hour, timeRange[index].minute, timeRange[index].second]}}"
              range="{{[timeArray.hour, timeArray.minute, timeArray.second]}}"
              data-index="{{index}}"
            >
              <view class="picker" style="display: flex">
                <view qq:if="{{index}}" style="display: flex">
                  <view class="tt"> {{timeArray.hour[timeRange[index-1].hour]}} </view>
                  <text space="ensp"> : </text>
                  <view class="tt"> {{timeArray.minute[timeRange[index-1].minute]}} </view>
                  <text space="ensp"> : </text>
                  <view class="tt"> {{timeArray.second[timeRange[index-1].second]}} </view>
                </view>
                <view qq:else style="display: flex">
                  <view class="tt"> 00 </view>
                  <text space="ensp"> : </text>
                  <view class="tt"> 00 </view>
                  <text space="ensp"> : </text>
                  <view class="tt"> 00 </view>
                </view>
                <text space="ensp">  -  </text>
                <view style="color: #376df6; display: flex">
                  <view class="tt"> {{timeArray.hour[timeRange[index].hour]}} </view>
                  <text space="ensp"> : </text>
                  <view class="tt"> {{timeArray.minute[timeRange[index].minute]}} </view>
                  <text space="ensp"> : </text>
                  <view class="tt"> {{timeArray.second[timeRange[index].second]}} </view>
                </view>
              </view>
            </picker>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="title"> 备注 </view>
          <input placeholder="请输入备注" value="{{comment}}" bindinput="bindComment"></input>
        </view>
        
        <view class="section" style="display:flex; padding-left: 5%; padding-right: 5%">
          <button bindtap="bindDelete" type="warn" style="width:30%"> 删除 </button> 
          <button bindtap="bindExitTaskDetail" type="default" style="width:30%"> 返回 </button>
          <button bindtap="bindConfirm" type="primary" style="width:30%"> 确认 </button>
        </view>
      </view>
    
      <block qq:if="{{showAvailable}}">
        <view class="section">
          <view class="divided-container">
            <view qq:for="{{availableList}}" qq:key="index" style="position:relative">
              <view qq:if="{{index}}" class="subdivider"/>
              <button bindtap="bindToggleSource" data-index="{{index}}"> 
                {{item.info.date}}
                <text style="color: #878b97"> {{item.info.title}} </text>
              </button>
              <view class="tick" qq:if="{{item.chosen}}"></view>
            </view>
            <view class="subdivider"/>
            <button bindtap="bindLoadMore" style="color: #376df6"> 加载更多 </button>
          </view>
        </view>
        <view class="section">
          <button bindtap="bindConfirmSource" type="primary"> 确认选择 </button>
        </view>
      </block>
    </view>

    <view qq:if="{{showSourceDetail}}">
      <view class="section">
        <view class="title"> 标题 </view>
        <view class="button-mimic"> {{sourceList[detailedSourceIndex].title}} </view>
      </view>

      <view class="section" qq:if="{{sourceList[detailedSourceIndex].themeList.length}}">
        <view class="title"> 主题 </view>
        <view qq:for="{{sourceList[detailedSourceIndex].themeList}}" class="divided-container" qq:key="index">
          <view qq:if="{{index}}" class="subdivider"/>
          <view class="button-mimic"> {{item}} </view>
        </view>
      </view>

      <view class="section">
        <view class="title"> 参演角色 </view>
        <view qq:for="{{sourceList[detailedSourceIndex].characterList}}" class="divided-container" qq:key="index">
          <view qq:if="{{index}}" class="subdivider"/>
          <view class="button-mimic"> {{item}} </view>
        </view>
      </view>

      <view qq:if="{{sourceList[detailedSourceIndex].comment != ''}}" class="section">
        <view class="title"> 备注 </view>
        <view class="button-mimic">
          {{sourceList[detailedSourceIndex].comment}}
        </view>
      </view>

      <view class="section">
        <button type="primary" bindtap="bindSourceDetailBack"> 返回 </button>
      </view>
    </view>
  </view>
</view>

<view class="bottom-placeholder"/>