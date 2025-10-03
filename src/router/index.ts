import { createRouter, createWebHistory } from "vue-router";
import HeroView from "../views/HeroView.vue";
import MainView from "../views/MainView.vue";

const routes = [
  { path: "/", name: "Home", component: HeroView },
  { path: "/workflow", name: "Workflow", component: MainView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
