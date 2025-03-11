import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Join from "../views/Join.vue";
import Main from "../views/Main.vue";
import SignIn from "../views/SignIn.vue";
import Feed from "@/views/Feed.vue";
import Search from "@/views/Search.vue";
import Menu from "@/views/Menu.vue";
import JoinForm from "@/components/JoinForm.vue";
import Profile from "@/views/Profile.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/join",
      name: "join",
      component: Join,
    },

    { path: "/signin", name: "signin", component: SignIn },
    {
      path: "/main",
      name: "",
      component: Main,
      children: [
        {
          path: "",
          name: "main",
          components: {
            leftSidebar: Menu,
            focus: Feed,
            rightSidebar: Search,
          },
        },
        {
          path: "/profile",
          components: {
            leftSidebar: Menu,
            focus: Profile,
            rightSidebar: Search,
          },
        },

      ],
    },
  ],
});

export default router;
