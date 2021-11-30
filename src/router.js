import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "Register",
      path: "/register",
      component: () => import("@/views/dashboard/users/RegisterPage")
    },
    {
      name: "Login",
      path: "/login",
      component: () => import("@/views/dashboard/users/LoginPage")
    },
    {
      name: "Reset",
      path: "/reset-password",
      component: () => import("@/views/dashboard/users/ResetPasswordPage")
    },
    {
      name: "Confirm",
      path: "/reset-password/confirm/:token",
      component: () => import("@/views/dashboard/users/ResetPasswordConfirm")
    },
    {
      path: "/",
      component: () => import("@/views/dashboard/Index"),
      children: [
        {
          name: "Home",
          path: "",
          component: () => import("@/views/dashboard/Home")
        },
        {
          name: "Eventos",
          path: "pages/events",
          component: () => import("@/views/dashboard/pages/Events")
        },
        {
          name: "Detalle del Evento",
          path: "pages/events/:id/detail/",
          component: () => import("@/views/dashboard/pages/ShowEvent")
        },
        {
          name: "Pedido del Evento",
          path: "pages/events/:id/orders/",
          component: () => import("@/views/dashboard/pages/Order")
        },
        {
          name: "Mis Eventos",
          path: "pages/my-events",
          component: () => import("@/views/dashboard/pages/MyEvents")
        },
        {
          name: "Administrar Evento",
          path: "pages/my-events/:id/admin/",
          component: () => import("@/views/dashboard/pages/AdminEvent")
        },
        {
          name: "Perfil",
          path: "pages/user",
          component: () => import("@/views/dashboard/pages/UserProfile")
        },
        {
          name: "Administrar Grupos",
          path: "users/groups",
          component: () => import("@/views/dashboard/users/AdminGroups")
        },
        {
          name: "Tutorial",
          path: "tutorial",
          component: () => import("@/views/dashboard/contact/Tutorial")
        },
        {
          name: "Contacto",
          path: "contact",
          component: () => import("@/views/dashboard/contact/Contact")
        },
        {
          name: "Donar",
          path: "donate",
          component: () => import("@/views/dashboard/contact/Donate")
        },
        {
          name: "Thanks",
          path: "Thanks/:email",
          component: () => import("@/views/dashboard/contact/Thanks")
        },
        {
          name: "Privacy",
          path: "privacy",
          component: () => import("@/views/dashboard/contact/Privacy")
        }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      name: "PageNotFound",
      component: () => import("@/views/dashboard/PageNotFound")
    }
  ]
});
