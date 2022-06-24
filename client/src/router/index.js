import { createRouter, createWebHistory } from "vue-router";
import login from "../views/Login.vue";

const routes = [
  {
    path: '/',
    name: "Home",
    component: login,
  },
  {
    path: "/templates",
    name: "ActivitiesTemplates",
    component: () => import("../views/ActivitiesTemplates.vue"),
  },
  {
    path: "/act-table",
    name: "ActivitiesTable",
    component: () => import("../views/ActivitiesTable.vue"),
  },
  {
    path: "/act-cal",
    name: "ActivitiesCalendar",
    component: () => import("../views/ActivitiesCalendar.vue"),
  },
  {
    path: "/emails",
    name: "EmailManagement",
    component: () => import("../views/EmailManagement.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});

export default router;
