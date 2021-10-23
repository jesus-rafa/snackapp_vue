<template>
  <v-app>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />

    <dashboard-core-settings />

    <alerts />

    <close-session />
  </v-app>
</template>

<script>
import apiUsers from "@/api/users";

export default {
  name: "Index",
  components: {
    DashboardCoreAppBar: () => import("./components/core/AppBar"),
    DashboardCoreDrawer: () => import("./components/core/Drawer"),
    DashboardCoreSettings: () => import("./components/core/Settings"),
    DashboardCoreView: () => import("./components/core/View"),
    Alerts: () => import("@/components/base/Alerts"),
    CloseSession: () => import("@/components/base/CloseSession")
  },
  data: () => ({
    expandOnHover: false
  })
};
</script>
