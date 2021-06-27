<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		 <!-- <transition name="fade"
		            mode="out-in"> -->
         <transition :name="transitionName">
                <router-view/>
         </transition>
			<!-- <router-view></router-view> -->
		<!-- </transition> --> 
  </div>
</template>

<script>

export default {

  name: 'app',
	components: {
  },
   data(){
    return{
      transitionName:"",
    } 
},
 watch:{
      $route(to,from){
          //实现路由跳转动画
          if (to.meta.index > from.meta.index)  
            this.transitionName = "slide-left";
          if (to.meta.index < from.meta.index)
            this.transitionName = "slide-right";
      }
  }

}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  .fade-enter-active, .fade-leave-avtive {
    transition: opacity 1s
}
.fade-enter, .fade-leave-to {
    opacity: 0
}
  
}
 .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position:absolute;
    }
    
    .slide-right-enter {
    opacity: 0;
    transform: translate(-100%);
    }
    
    .slide-right-leave-active {
    opacity: 0;
    transform: translateX(100%);
    }
    
    .slide-left-enter {
    opacity: 0;
    transform: translateX(100%);
    }
    
    .slide-left-leave-active {
    opacity: 0;
    transform: translateX(-100%);
    }
</style>
