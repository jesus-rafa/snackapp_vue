import { getTokenApi } from "@/api/token";
import { API_URL } from "@/utils/constants.js";
import axios from "axios";

const apiGroups = {
  byUser: function() {
    return axios.get(`${API_URL}/api/tribes/by-user/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  myGroups: function() {
    return axios.get(`${API_URL}/api/users/belong-tribes/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  members: function(kword) {
    return axios.get(`${API_URL}/api/members/?kword=${kword}`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  getUsers: function() {
    return axios.get(`${API_URL}/api/users/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  getGroups: function(kword) {
    return axios.get(`${API_URL}/api/tribes/?kword=${kword}`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  getMembers: function(idGroup) {
    return axios.get(`${API_URL}/api/tribes/members/${idGroup}/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  addGroup: function(formData) {
    return axios.post(`${API_URL}/api/tribes/add/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`,
        "Content-Type": "multipart/form-data"
      }
    });
  },
  editGroup: function(idGroup, formData) {
    return axios.post(`${API_URL}/api/tribes/edit/${idGroup}/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`,
        "Content-Type": "multipart/form-data"
      }
    });
  },
  removeGroup: function(idGroup) {
    return axios.delete(`${API_URL}/api/tribes/remove/${idGroup}/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  leaveGroup: function(idGroup, idUser) {
    return axios.get(`${API_URL}/api/tribes/leave/${idGroup}/${idUser}/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  assignPermissions: function(idGroup, formData) {
    return axios.post(
      `${API_URL}/api/tribes/assign-permissions/${idGroup}/`,
      formData,
      {
        headers: {
          Authorization: `Token ${getTokenApi()}`
        }
      }
    );
  },

  sendEmail: function(formData) {
    return axios.post(`${API_URL}/api/tribes/invitations/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  sendEmailDelivered: function(formData) {
    return axios.post(`${API_URL}/api/tribes/delivered/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  sendEmailThank: function(formData) {
    return axios.post(`${API_URL}/api/tribes/thank/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  }
};

export default apiGroups;
