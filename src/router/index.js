import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Join from "../views/Join.vue";
import Main from "../views/Main.vue";
import SignIn from "../views/SignIn.vue";
import Feed from "@/views/Feed.vue";
import Search from "@/views/Search.vue";
import Menu from "@/views/Menu.vue";
import Profile from "@/views/Profile.vue";
import PrivateFeed from "@/views/PrivateFeed.vue";
import { useUserStore } from "@/stores/user";

const isAuthenticated = () => {
  const userStore = useUserStore();
  console.log(userStore.token);
  return userStore.token;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { authRequired: false },
    },
    {
      path: "/join",
      name: "join",
      component: Join,
      meta: { authRequired: false },
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn,
      meta: { authRequired: false },
    },
    {
      path: "/main",
      component: Main,
      meta: { authRequired: true },
      children: [
        {
          path: "",
          name: "main",
          components: {
            leftSidebar: Menu,
            focus: Feed,
            rightSidebar: Search,
          },
          meta: { authRequired: true },
        },
        {
          path: "/profile",
          name: "profile",
          components: {
            leftSidebar: Menu,
            focus: Profile,
            rightSidebar: Search,
          },
          meta: { authRequired: true },
        },
        {
          path: '/user/:userId',
          components: {
            leftSidebar: Menu,
            focus: PrivateFeed,
            rightSidebar: Search,
          },
          props: true,
          meta: { authRequired: true },
        },
      ],
    },
    
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.authRequired && !isAuthenticated()) {
    next("/");
  } else {
    next();
  }
});

export default router;
