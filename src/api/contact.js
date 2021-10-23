import { API_URL } from "@/utils/constants.js";
import axios from "axios";

const apiContact = {
  emailContact: function(formData) {
    return axios.post(`${API_URL}/api/users/contact/`, formData);
  },
  emailThanks: function() {
    return axios.post(`${API_URL}/api/users/thanks/`);
  }
};

export default apiContact;
