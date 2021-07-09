import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/Layout.vue'),
    children: [
      {
        path: '/index',
        name: 'HomePage',
        component: () => import('../views/HomePage/index.vue')
      },
      {
        path: '/exercise-manage',
        name: 'ExerciseManage',
        component: () => import('../views/ExerciseManage/index.vue')
      },
      {
        path: '/exercise-manage/exercise-mission/:action/:id?',
        name: 'ExerciseMission',
        component: () => import('../views/ExerciseManage/exerciseMission.vue')
      },
      {
        path: '/exercise-manage/exercise-details/:id?',
        name: 'MissionDetails',
        component: () => import('../views/ExerciseManage/missionDetails.vue')
      },
      {
        path: '/exercise-manage/exercise-report/:action/:id?',
        name: 'AssessmentReport',
        component: () => import('../views/ExerciseManage/assessmentReport.vue')
      },
      {
        path: '/exercise-manage/report-details/:id?',
        name: 'ReportDetails',
        component: () => import('../views/ExerciseManage/reportDetails.vue')
      },
      {
        path: '/exercise-statistics/:id?',
        name: 'ExerciseStatistics',
        component: () => import('../views/ExerciseManage/exerciseStatistics.vue')
      },

      {
        path: '/problem-list',
        name: 'ProblemList',
        component: () => import('../views/ProblemList/index.vue')
      },
      {
        path: '/problem-list/:action',
        name: 'ProblemManageAddAndEdit',
        component: () => import('../views/ProblemList/edit.vue')
      },
      {
        path: '/problem-list/problem-detail',
        name: 'ProblemDetail',
        component: () => import('../views/ProblemList/problemDetail.vue')
      },
      {
        path: '/problem-list/problem-handl',
        name: 'ProblemHandl',
        component: () => import('../views/ProblemList/problemHandl.vue')
      },
      {
        path: '/problem-list/problem-check',
        name: 'ProblemCheck',
        component: () => import('../views/ProblemList/problemCheck.vue')
      },
      {
        path: '/problem-list/problem-slupplement',
        name: 'SupplementInfo',
        component: () => import('../views/ProblemList/supplementInfo.vue')
      },
      {
        path: '/problem-report',
        name: 'ProblemReport',
        component: () => import('../views/ProblemList/problemReport.vue')
      },
      // 基础数据管理
      // {
      //   path: "/equipment-problem",
      //   name: "EquipmentProblem",
      //   component: () => import("../views/EquipmentProblem/index.vue")
      // },
      
      // 用户管理
      {
        path: "/user-manage",
        name: "UserManage",
        component: () => import("../views/systemSet/UserManage/index.vue")
      },
      {
        path: "/role-manage",
        name: "RoleManagement",
        component: () => import("../views/systemSet/RoleManagement/index.vue")
      },
      {
        path: "/role-manage/:action",
        name: "RoleManagementAddAndEdit",
        component: () => import("../views/systemSet/RoleManagement/edit.vue")
      },
      {
        path: "/authority-manage",
        name: "AuthorityManagement",
        component: () => import("../views/systemSet/AuthorityManagement/index.vue")
      }
    ]
  },
  {
    path: '/500',
    name: '500',
    component: () => import('../views/Error/500.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/Error/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
