<view style="overflow-x:hidden">
  <view class="section">
    <view class="button-mimic">
      使用时长排序
      <switch bindchange="bindToggleTimeList" color="#376df6" checked="{{useTimeList}}"/>
    </view>
  </view>

  <view class="section" qq:if="{{useTimeList}}">
    <view qq:for="{{timeList}}" qq:key="index">
      <view class="button-mimic" style="{{index ? '' : 'color: #ff9900'}}">
        {{item._id}}
        <view class="tick" qq:if="{{myNickname == item._id}}"/>
      </view>
    </view>
  </view>

  <view class="section" qq:else>
    <view qq:for="{{numList}}" qq:key="index">
      <view class="button-mimic" style="{{index ? '' : 'color: #ff9900'}}">
        {{item._id}}
        <view class="tick" qq:if="{{myNickname == item._id}}"/>
      </view>
    </view>
  </view>
</view>

<view class="bottom-placeholder"/>