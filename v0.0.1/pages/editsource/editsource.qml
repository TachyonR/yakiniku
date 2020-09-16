<view style="overflow-x: hidden">
  <block qq:if="{{!sourceFound}}">
    <view class="section">
      <view class="title"> 添加日期条件 </view>
      
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
      <view class="title"> 添加主题条件 </view>
      <view class="divided-container">
        <block qq:for="{{themeList}}" qq:key="index">
          <input placeholder="请输入主题" value="{{item}}" bindinput="bindAddSearchTheme" data-index="{{index}}">
            <view class="close" bindtap="delSearchTheme" data-index="{{index}}" style="right: 2rem"></view>
          </input>
          <view class="subdivider"/>
        </block>
        <button bindtap="addSearchTheme" style="color: #376df6"> 添加主题 </button>
      </view>
    </view>
    
    <view class="section">
      <view class="title"> 添加角色条件 </view>
      <view class="divided-container">
        <block qq:for="{{characterList}}" qq:key="index">
          <input placeholder="请输入角色" value="{{item}}" bindinput="bindAddSearchCharacter" data-index="{{index}}">
            <view class="close" bindtap="delSearchCharacter" data-index="{{index}}" style="right: 2rem"></view>
          </input>
          <view class="subdivider"/>
        </block>
        <button bindtap="addSearchCharacter" style="color: #376df6"> 添加角色 </button>
      </view>
    </view>

    <view class="section">
      <button bindtap="bindSearch" type="primary"> 搜索 </button>
    </view>
  </block>
  <block qq:elif="{{!sourceDetail}}">
    <view class="section">
      <view class="title"> 搜索结果 </view>
      <view qq:for="{{sourceList}}" qq:key="index" class="divided-container">
        <view qq:if="{{index}}" class="subdivider"/>
        <button bindtap="bindIndividualSource" data-index="{{index}}">
          {{item.date}}
          <text style="color: #878b97"> {{item.title}} </text>
        </button>
      </view>
    </view>
    <view class="section">
      <button type="primary" bindtap="bindBack"> 返回 </button>
    </view>
  </block>
  <block qq:else>
    <view class="section">
      <view class="title"> 标题 </view>
      <input placeholder="请输入标题" value="{{sourceElement.title}}" bindinput="bindChangeTitle"></input>
    </view>

    <view class="section">
      <view class="title"> 直播日期 </view>
      <picker
        mode="date"
        value="{{sourceElement.date}}"
        start="2020-09-01"
        end="2030-09-01"
        bindchange="bindDateChange"
      >
        <view class="picker button-mimic">
          {{sourceElement.date}}
        </view>
      </picker>
    </view>

    <view class="section">
      <view class="title"> 主题 </view>
      <view qq:for="{{sourceElement.themeList}}" qq:key="index" class="divided-container">
        <input placeholder="请输入主题" value="{{item}}" bindinput="bindAddTheme" data-index="{{index}}">
          <view class="close" bindtap="delTheme" data-index="{{index}}" style="right: 2rem"></view>
        </input>
        <view class="subdivider"/>
      </view>
      <button bindtap="addTheme" style="color: #376df6"> 添加新主题 </button>
    </view>

    <view class="section">
      <view class="title"> 参演角色 </view>
      <view qq:for="{{sourceElement.characterList}}" qq:key="index" class="divided-container">
        <input placeholder="请输入角色名" value="{{item}}" bindinput="bindAddCharacter" data-index="{{index}}">
          <view class="close" bindtap="delCharacter" data-index="{{index}}" style="right: 2rem"></view>
        </input>
        <view class="subdivider"/>
      </view>
      <button bindtap="addCharacter" style="color: #376df6"> 添加新角色 </button>
    </view>

    <view class="section">
      <view class="title"> 状态 </view>
      <view class="divided-container">
        <view class="button-mimic"> 暂放
          <switch color="#956fe7" checked="{{sourceElement.suspended}}" bindchange="bindSuspended"/>
        </view>
        <view class="subdivider"/>
        <view class="button-mimic"> 已上传
          <switch color="#04BE02" checked="{{sourceElement.uploaded}}" bindchange="bindUploaded"/>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="title"> 备注 </view>
      <input placeholder="请输入备注" value="{{sourceElement.comment}}" bindinput="bindComment"></input>
    </view>

    <view class="section" style="display:flex; padding-left: 5%; padding-right: 5%">
      <button style="width: 30%" bindtap="bindDetailDelete" type="warn"> 删除 </button>
      <button style="width: 30%" bindtap="bindDetailBack" type = "default"> 返回 </button>
      <button style="width: 30%" bindtap="bindDetailConfirm" type="primary"> 确认 </button>
    </view>
  </block>
</view>

<view class="bottom-placeholder"/>