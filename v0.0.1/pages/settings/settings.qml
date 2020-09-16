<view style="overflow-x:hidden">
  <view class="section">
    <view class="title"> 名称 </view>
    <input placeholder="请输入名称" value="{{nickname}}" bindinput="bindNicknameInput"></input>
  </view>

  <view class="section">
    <view class="title"> 职位 </view>
    <view class="divided-container">
      <view qq:for="{{checkboxItems}}" qq:key="index">
        <view qq:if="{{index}}" class="subdivider"></view>
        <view class="button-mimic"> 
          {{item.value}}
          <switch color="{{numberOfChecked < 3 ? '#376df6' : '#ff9900'}}" checked="{{item.checked}}" bindchange="bindSwitchChange" data-index="{{index}}"></switch>
        </view>
      </view>
    </view>
  </view>

  <view class="section">
    <button qq:if="{{numberOfChecked < 3}}" bindtap="bindConfirm" type="primary"> 
      确认
    </button>
    <button qq:else bindtap="bindConfirm" type="primary" style="background-color:#ff9900"> 
      我就是龙王！
    </button>
  </view>
</view>

<view class="bottom-placeholder"/>