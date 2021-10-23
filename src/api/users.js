import { getTokenApi } from "@/api/token";
import { API_URL } from "@/utils/constants.js";
import axios from "axios";

const apiUsers = {
  register: function(formData) {
    return axios.post(`${API_URL}/api/register/`, formData);
  },
  login: function(formData) {
    return axios.post(`${API_URL}/api/login/`, formData);
  },
  retrieve: function() {
    return axios.get(`${API_URL}/api/user/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  changePassword: function(formData) {
    return axios.put(`${API_URL}/api/change-password/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  edit: function(idUser, formData) {
    return axios.put(`${API_URL}/api/user/edit/${idUser}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  logout: function() {
    return axios.post(`${API_URL}/api/logout/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  resetPassword: function(email) {
    return axios.post(`${API_URL}/api/password_reset/`, email);
  },
  confirmPassword: function(formData) {
    return axios.post(`${API_URL}/api/password_reset/confirm/`, formData);
  }
};

export default apiUsers;
