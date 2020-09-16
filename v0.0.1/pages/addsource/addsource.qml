<view style="overflow-x: hidden">
  <view class="section">
    <view class="title"> 标题 </view>
    <input placeholder="请输入标题" bindinput="bindTitleConfirm"></input>
  </view>

  <view class="section">
    <view class="title"> 直播日期 </view>
    <picker
      mode="date"
      value="{{date}}"
      start="2020-09-01"
      end="2030-09-01"
      bindchange="bindDateChange"
    >
      <view class="picker button-mimic">
        {{date}}
      </view>
    </picker>
  </view>

  <view class="section">
    <view class="title"> 主题 </view>
    <view qq:for="{{themeList}}" qq:key="index" class="divided-container">
      <input placeholder="请输入主题" value="{{item}}" bindinput="bindAddTheme" data-index="{{index}}">
        <view class="close" bindtap="delTheme" data-index="{{index}}" style="right: 2rem"></view>
      </input>
      <view class="subdivider"/>
    </view>
    <button bindtap="addTheme" style="color: #376df6"> 添加新主题 </button>
  </view>

  <view class="section">
    <view class="title"> 参演角色 </view>
    <view qq:for="{{characterList}}" qq:key="index" class="divided-container">
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
        <switch color="#956fe7" checked="{{suspended}}" bindchange="bindSuspended"/>
      </view>
      <view class="subdivider"/>
      <view class="button-mimic"> 已上传
        <switch color="#04BE02" checked="{{uploaded}}" bindchange="bindUploaded"/>
      </view>
    </view>
  </view>

  <view class="section">
    <view class="title"> 备注 </view>
    <input placeholder="请输入备注" value="{{comment}}" bindinput="bindComment"></input>
  </view>

  <view class="section">
    <button type="primary" bindtap="bindConfirm"> 确认添加 </button>
  </view>
</view>

<view class="bottom-placeholder"/>