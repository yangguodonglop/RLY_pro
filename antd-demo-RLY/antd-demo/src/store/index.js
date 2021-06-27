import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})
let store = new Vuex.Store({
    state: {
         routes: [
            {
                path: "/Home",
                component: () => import("@/views/Home/index"),
                //  redirect: '/Authority/base',
                name: "权限设置",
                meta: {
                    title: "设置",
                    requireAuth: true,
                    index: 11,
                    role:['100'],
                },
             
                children: [
                    {
                        path: "/Authority/UserList",
                        component: () => import("@/views/Authority/UserList"),
                        name: "账号列表",
                        meta: {
                            title: "设置",
                            requireAuth: true,
                            index: 1,
                            role:['100']
        
                        }
                    }
                ]
            },
             {
            path: '/Home1',
            component: () => import('@/views/Home/index'),
            //  redirect: '/Authority/base1',
            name: '歌曲设置',
            meta: {
              title: "设置",
              requireAuth: true,
              index: 11,
              role:['100','100000'],
        
            },
            
            children: [
              {
                path: '/Music/UserList',
                component: () => import('@/views/Music/MusicList'),
                name: '歌曲列表',
                meta: {
                  title: "设置",
                  requireAuth: true,
                  index: 3,
                  role:['100','100000']
        
                }
              },
              {
                path: '/Music/UserList1',
                component: () => import('@/views/Music/MusicRelease'),
                name: '发布列表',
                meta: {
                  title: "设置",
                  requireAuth: true,
                  index: 4,
                  role:['100']
        
                }
              },
              {
                path: '/Music/UserList2',
                component: () => import('@/views/Music/AuditionList'),
                name: '生成试听列表',
                meta: {
                  title: "设置",
                  requireAuth: true,
                  index: 88,
                  role:['100']
        
                }
              },
            ]
          }
        ]
    },
    mutations:{
         setRouters: (state, token) => {
             state.routes = token
         }
    },
    plugins: [vuexLocal.plugin]
})

export default store