import { API_URL } from "@/utils/constants.js";
import axios from "axios";

const apiMercadoPago = {
  donate: function(formData) {
    return axios.post(
      `${API_URL}/api/payments/donations/mercadopago/`,
      formData
    );
  },
  createPreference: function(formData) {
    return axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      formData,
      {
        headers: {
          Authorization:
            "Bearer TEST-8170054445478669-072823-02d94136e6200fbfb9861be9646c29e2-202425550"
        }
      }
    );
  }
};

export default apiMercadoPago;
