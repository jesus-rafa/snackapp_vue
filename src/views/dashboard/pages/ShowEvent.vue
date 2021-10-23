<template>
  <v-container fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <cart v-if="showCart" />
        <detail-event v-else />
      </v-col>
      <v-col cols="12" md="4">
        <card-event />

        <v-card-text>
          <div class="text-center flex">
            <v-btn rounded color="primary" dark @click="activeCar()">
              {{ button_text }}
            </v-btn>
            <v-btn
              class="ma-2"
              rounded
              color="primary"
              dark
              @click="showOrder()"
            >
              <v-icon left>
                mdi-clipboard-text
              </v-icon>
              Ver Pedidos
            </v-btn>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CardEvent from "@/components/events/CardEvent.vue";
import DetailEvent from "@/components/events/DetailEvent.vue";
import Cart from "@/components/orders/Cart.vue";

export default {
  name: "ShowEvent",
  components: {
    CardEvent,
    DetailEvent,
    Cart
  },
  data() {
    return {
      showCart: false,
      button_text: "Participar"
    };
  },
  computed: {
    idEvent() {
      return this.$route.params.id;
    }
  },
  methods: {
    activeCar() {
      this.showCart = !this.showCart;

      this.button_text = this.showCart ? "Ver Detalle" : "Participar";
    },
    showOrder() {
      this.$router.push({
        name: "Pedido del Evento",
        params: { id: this.idEvent }
      });
    }
  }
};
</script>

<style></style>
