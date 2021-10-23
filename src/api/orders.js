import { getTokenApi } from "@/api/token";
import { API_URL } from "@/utils/constants.js";
import axios from "axios";

const apiOrders = {
  byUser: function(idEvent) {
    return axios.get(`${API_URL}/api/orders/by-user/${idEvent}/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  byEvent: function(idEvent) {
    return axios.get(`${API_URL}/api/orders/by-event/${idEvent}/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  addItem: function(formData) {
    return axios.post(`${API_URL}/api/orders/cart/add/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  updateItem: function(idOrder, formData) {
    return axios.put(
      `${API_URL}/api/orders/cart/update/${idOrder}/`,
      formData,
      {
        headers: {
          Authorization: `Token ${getTokenApi()}`
        }
      }
    );
  },
  removeItem: function(idOrder) {
    return axios.delete(`${API_URL}/api/orders/cart/remove/${idOrder}/`, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  editItem: function(idOrder, formData) {
    return axios.put(`${API_URL}/api/orders/cart/edit/${idOrder}/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  },
  editPaid: function(idOrder, formData) {
    return axios.put(`${API_URL}/api/orders/paid-out/${idOrder}/`, formData, {
      headers: {
        Authorization: `Token ${getTokenApi()}`
      }
    });
  }
};

export default apiOrders;
