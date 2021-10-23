const moduleUser = {
  state: {
    user: null,
    reload_group: false,
    expire_session: false
  },
  getters: {
    getUser: state => state.user,
    reload: state => state.reload_group,
    expire: state => state.expire_session
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_RELOAD(state, reload_group) {
      state.reload_group = reload_group;
    },
    SET_EXPIRE(state, expire_session) {
      state.expire_session = expire_session;
    }
  },
  actions: {
    retrieveUser({ commit }, user) {
      commit("SET_USER", user);
    },
    reload({ commit }, reload_group) {
      commit("SET_RELOAD", reload_group);
    },
    expireSession({ commit }, expire_session) {
      commit("SET_EXPIRE", expire_session);
    }
  }
};

export default moduleUser;
