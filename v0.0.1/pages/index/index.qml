<view style="overflow-x: hidden">
  <block qq:if="{{addGroup}}">
    <view style="display:flex" class="section">
      <view style="width: 3rem" class="button-mimic"> 密码 </view>
      <input placeholder="请输入密码" type="password" bindinput="bindPasswordInput"/>
    </view>
    <view class="section">
      <button bindtap="bindPasswordConfirm" type="primary"> 确认 </button>
    </view>
  </block>
  
  <view qq:elif="{{!groupEntered}}">
    <view qq:if="{{groupList.length}}" class="section">
      <view class="divided-container">
        <view qq:for="{{groupList}}" qq:key="index">
          <view qq:if="{{index}}" class="subdivider"></view>
          <button bindtap="bindEnterGroup" data-index="{{index}}"> {{item.name}} </button>
        </view>   
      </view>
    </view>
    <view class="section">
      <button bindtap="bindAddGroup" type="primary"> 添加新组 </button>
    </view>
  </view>

  <view qq:else>
    <view class="section">
      <view class="title"> 通用 </view>
        <view class="divided-container">
        <button bindtap="bindSettings"> 个人设置 
          <view class="arrow"></view>
        </button>
        <view class="subdivider"/>
        <button bindtap="bindStats"> 统计信息
          <view class="arrow"></view>
        </button>
        <view class="subdivider"/>
        <button bindtap="bindTaskStatus"> 发布状况
          <view class="arrow"></view>
        </button>
      </view>
    </view>
    <view class="section" qq:if="{{myJobs.edit || myJobs.postProcess}}">
      <view class="title"> 剪辑/后期 </view>
      <view class="divided-container">
        <button bindtap="bindAddSource"> 添加源
          <view class="arrow"></view>
        </button>
        <view class="subdivider"/>
        <button bindtap="bindAddTask"> 添加稿件
          <view class="arrow"></view>
        </button>
        <view class="subdivider"/>
        <button bindtap="bindEditSource"> 编辑源信息
          <view class="arrow"></view>
        </button>
        <view class="subdivider"/>
        <button bindtap="bindEditTask"> 编辑稿件信息
          <view class="arrow"></view>
        </button>
      </view>
    </view>
    <view class="section" qq:if="{{myJobs.translation || myJobs.timing || myJobs.proofread}}">
      <view class="title"> 轴翻校 </view>
        <view class="divided-container">
        <button bindtap="bindChooseTask"> 选择稿件
          <view class="arrow"></view>
        </button>
        <view class="subdivider"/>
        <button bindtap="bindMyTask"> 我的稿件
          <view class="arrow"></view>
        </button>
      </view>
    </view>
    <view class="section" qq:if="{{myJobs.thumbnail}}">
      <view class="title"> 封面 </view>
      <button bindtap="bindAddThumbnail"> 添加封面
        <view class="arrow"></view>
      </button>
    </view>
    <view class="section">
      <button type="primary" bindtap="bindExitGroup"> 返回首页 </button>
    </view>
  </view>
</view>

<view class="bottom-placeholder"> </view>