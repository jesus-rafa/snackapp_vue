<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <v-btn class="mr-3" elevation="1" fab small @click="setDrawer(!drawer)">
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />
    <div v-if="getUser" class="subtitle-1">
      {{ getUser.email }}
    </div>

    <v-btn class="ml-2" min-width="0" text to="/pages/user">
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>

    <v-btn class="ml-2" min-width="0" text @click="closeSession()">
      Cerrar Sesion
      <v-icon right>mdi-power</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import apiUsers from "@/api/users";
import { getTokenApi, deleteTokenApi } from "@/api/token";

// Components
import { VHover, VListItem } from "vuetify/lib";

// Utilities
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "DashboardCoreAppBar",
  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    "black--text": !hover,
                    "white--text secondary elevation-12": hover
                  },
                  props: {
                    activeClass: "",
                    dark: hover,
                    link: true,
                    ...this.$attrs
                  }
                },
                this.$slots.default
              );
            }
          }
        });
      }
    }
  },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    notifications: [
      "Mike John Responded to your email",
      "You have 5 new tasks",
      "You're now friends with Andrew",
      "Another Notification",
      "Another one"
    ],
    getUser: []
  }),
  computed: {
    ...mapState(["drawer"])
  },
  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER"
    }),
    closeSession() {
      deleteTokenApi();
      localStorage.clear();
      this.$router.push("/login");
    }
  },
  beforeMount() {
    const user = this.$store.getters.getUser;
    if (user === null) {
      apiUsers
        .retrieve()
        .then(response => {
          this.$store.dispatch("retrieveUser", response.data);
          this.getUser = response.data;
        })
        .catch(error => {
          this.closeSession();
        });
    } else {
      this.getUser = user;
    }
  }
};
</script>

<style scoped>
@media print {
  #app-bar {
    display: none !important;
  }
}
</style>
