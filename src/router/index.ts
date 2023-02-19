import { createRouter, createWebHashHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import NoseatrView from "@/views/NoseatrView.vue"

const router = createRouter({
  history: createWebHashHistory(),
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
