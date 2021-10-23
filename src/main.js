import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
import VueYouTubeEmbed from "vue-youtube-embed";
import Vue2Editor from "vue2-editor";
import App from "./App.vue";
import i18n from "./i18n";
import "./plugins/base";
import "./plugins/chartist";
import "./plugins/vee-validate";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store/store";

Vue.use(Vue2Editor);
Vue.use(LoadScript);
Vue.use(VueYouTubeEmbed);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
