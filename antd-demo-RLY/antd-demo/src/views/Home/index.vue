<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo"><img src="~@/assets/images/logoImg1.png" width="46px" height="44px"></div>
      <a-menu theme="dark"  mode="inline"  v-model="arr">
        <template v-for="(item) in  menu">
          <a-sub-menu
            :key="item.path"
            v-if="!item.hiddren"
            @titleClick="titleClick(item)"
          >
            <span v-if="!item.hiddren" slot="title">
              <a-icon type="user" />
              <span>{{item.name}}</span>
            </span>
            <template v-for="(itemchild) in  item.children">
              <a-menu-item :key="itemchild.path" >
                <!-- <transition name="fade" mode="out-in"> -->
                <router-link :to="itemchild.path">
                {{ itemchild.name }}
                </router-link>
                 <!-- </transition> -->
              </a-menu-item>
            </template>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #001529; padding: 0">
        <div class="user-con">
           <div style="margin-right:20px;color:#ffffff;font-size:16px;">{{userName}}</div>
          <a-dropdown>
            
    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
     <img src="~@/assets/images/user.jpg" alt="" width="50px" height="50px" class="ant-dropdown-link" @click="e => e.preventDefault()">
    </a>
    <a-menu slot="overlay">
      <a-menu-item>
        <a href="javascript:;">个人中心</a>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript:;" @click="linkOut()">退出登录</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
        
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 20px 16px">
        <!-- <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb> -->
        <div :style="{ padding: '24px', background: '#fff', height: '100%' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <!-- <a-layout-footer style="text-align: center">Ant Design ©2018 Created by Ant UED</a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>
<script>
import menu from './menu'
export default {
  data() {
    return {
      collapsed: false,
      arr:[],
      menu:menu.menu,
      userName:''
    };
  },
  mounted:function(){
    this.userName=localStorage.getItem("admin")

  },
  methods: {
    titleClick(item) {
   
      
    },
    linkOut(item) {
   this.$router.push("/");
    },

  }
};
</script>

<style lang="scss">
#components-layout-demo-side .logo {
  height: 32px;
  // background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
}
.user-con{
 
 
  overflow: hidden;
  float: right;
  margin-right: 50px;
  display: flex;
  justify-content: start;
  img{
     border-radius: 50%;
     overflow: hidden;
     cursor: pointer;
  }
}
</style>