import Vue from 'vue'

import VueRouter from 'vue-router'



Vue.use(VueRouter)
// const RouteView = {
//     name: 'RouteView',
//     render: (h) => h('router-view')
//   }
//   alert(localStorage.getItem("admin"))



var routes = [
  {
    path: '/',
    component: () => import('@/views/Login/indexhtml'),
    name: 'Login',
    hiddren: true,
  },
  // {
  //   path: '/login',
  //   component: () => import('@/views/Login/index'),
  //   name: 'Login',
  //   hiddren: true,
  // },
  
  {
    path: "*",
    redirect: "/",
    hiddren: true,

  }
]


var router = new VueRouter({
  routes: routes
})
// router.beforeEach((to, from, next) => {
//     let token = window.localStorage.getItem('admin');
//     if(to.path!='/' && !token){
//       next({path: '/'})
//     } else {  
//       if(to.path =='/' && token){
//         next('/Authority/UserList')
//        // let  auditRoute =ww
//       }else{
//         next()
//        }
//       }
//   })

export default router;