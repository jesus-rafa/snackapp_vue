const moduleNotifications = {
  state: {
    notification: null
  },
  getters: {
    getNofitication: state => state.notification
  },
  mutations: {
    SET_NOTIFICATION(state, notification) {
      state.notification = notification;
    }
  },
  actions: {
    showNotification({ commit }, notification) {
      commit("SET_NOTIFICATION", notification);
    }
  }
};

export default moduleNotifications;
