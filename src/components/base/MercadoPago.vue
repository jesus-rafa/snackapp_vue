<template>
  <v-card color="#F5F5F5" dense>
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <strong>Donación</strong>
      </v-col>
      <v-col cols="12" md="8" class="text-center">
        <h1>
          <strong>$ {{ amount }}</strong>
        </h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5" sm="5">
        <div class="text-center">
          <v-img src="@/assets/logo_mercado_pago.png" height="100%"></v-img>
        </div>
      </v-col>
    </v-row>
    <div class="text-center">
      <br />
      <div class="cho-container"></div>
      <br />
    </div>
  </v-card>
</template>

<script>
export default {
  name: "MercadoPago",
  props: {
    amount: {
      type: String,
      default: ""
    },
    preference_id: {
      type: String,
      default: null
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$loadScript("https://sdk.mercadopago.com/js/v2")
      .then(() => {
        // Agregamos Credenciales
        const mp = new MercadoPago(
          "TEST-efd5f3a8-9688-472e-a087-3815220d2d58",
          {
            locale: "es-MX"
          }
        );

        // Inicializar checkout
        mp.checkout({
          preference: {
            id: this.preference_id
          },
          render: {
            container: ".cho-container",
            label: "Donar"
          }
        });
      })
      .catch(() => {});
  }
};
</script>
