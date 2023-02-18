import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import NoseatrView from "@/views/NoseatrView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "hoem",
      component: HomeView,
    },
    {
      path: "/noseatr",
      name: "noseatr",
      component: NoseatrView,
    },
  ],
})

export default router
