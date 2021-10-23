<template>
  <v-sheet elevation="10">
    <base-material-card color="warning" class="px-5 py-3">
      <template v-slot:heading>
        <v-row>
          <v-col cols="12" md="4">
            <div class="display-2 font-weight-bold">
              Mi Pedido
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="display-2 float-md-left font-weight-bold">
              Cantidad: {{ cart.quantity }}
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="display-2 float-md-left font-weight-bold">
              Total: $ {{ cart.amount }}
            </div>
          </v-col>
        </v-row>
      </template>
      <v-card-text>
        <v-form
          v-if="status == 'EN PROCESO'"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                label="Producto"
                class="purple-input"
                prepend-icon="mdi-cart"
                v-model="order.product"
                :rules="CartRules"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Descripcion"
                class=" purple-input"
                prepend-icon="mdi-notebook-outline"
                v-model="order.description"
                :rules="CartRules"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Precio"
                type="number"
                min="1"
                value="00.00"
                prepend-icon="mdi-currency-usd"
                class="purple-input"
                v-model="order.price"
                :rules="CartRules"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                label="Cantidad"
                type="number"
                min="1"
                value="1"
                class="purple-input"
                v-model="order.quantity"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>

        <v-row v-if="status == 'EN PROCESO'" justify="center">
          <v-btn
            v-if="showAdd"
            rounded
            color="warning"
            dark
            @click="addOrder()"
          >
            <v-icon>
              mdi-cart
            </v-icon>
            Agregar
          </v-btn>
          <v-btn
            v-if="!showAdd"
            rounded
            color="warning"
            dark
            @click="saveOrder(order.id)"
          >
            <v-icon>
              mdi-content-save-outline
            </v-icon>
            Guardar
          </v-btn>
          <v-btn
            v-if="!showAdd"
            class="mr-2"
            outlined
            color="red"
            fab
            small
            @click="cancel()"
          >
            <v-icon small>
              mdi-close
            </v-icon>
          </v-btn>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Producto
                </th>
                <th class="text-left">
                  Descripcion
                </th>
                <th class="text-left">
                  Precio
                </th>
                <th class="text-left">
                  Cantidad
                </th>
                <th class="text-left">
                  Subtotal
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.items" :key="item.name">
                <td>{{ item.product }}</td>
                <td>{{ item.description }}</td>
                <td>$ {{ item.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>$ {{ subTotal(item.quantity, item.price).toFixed(2) }}</td>
                <td>
                  <div v-if="status == 'EN PROCESO'">
                    <v-icon small @click="EditOrder(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item.id)">
                      mdi-close
                    </v-icon>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-row v-if="status == 'EN PROCESO'" justify="center">
          <v-btn class="ma-5" rounded color="primary" dark @click="showOrder()">
            <v-icon left>
              mdi-send
            </v-icon>
            Publicar
          </v-btn>
        </v-row>
      </v-card-text>
    </base-material-card>
  </v-sheet>
</template>

<script>
import apiOrders from "@/api/orders/";
import apiEvents from "@/api/events/";

export default {
  name: "Cart",
  data() {
    return {
      valid: true,
      cart: [],
      order: {
        order: 0,
        product: "",
        description: "",
        price: 0.0,
        quantity: 1
      },
      CartRules: [v => !!v || "Este campo es requerido"],
      showAdd: true,
      status: ""
    };
  },
  computed: {
    idEvent() {
      return this.$route.params.id;
    }
  },
  created: function() {
    this.retrieveStatus();
    this.getOrder();
  },
  methods: {
    retrieveStatus() {
      apiEvents.getStatus(this.idEvent).then(response => {
        this.status = response.data.status;
      });
    },
    getOrder() {
      apiOrders
        .byUser(this.idEvent)
        .then(response => {
          this.cart = response.data[0];
        })
        .catch(error => {
          if (error.response.data.detail)
            this.$store.dispatch("expireSession", true);
        });
    },
    subTotal: function(quantity, price) {
      return quantity * price;
    },
    addOrder() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();

        formData.append("order", this.cart.id);
        formData.append("product", this.order.product);
        formData.append("description", this.order.description);
        formData.append("price", this.order.price);
        formData.append("quantity", this.order.quantity);

        apiOrders
          .addItem(formData)
          .then(response => {
            this.getOrder();
          })
          .catch(error => {
            console.log(error);
          });

        this.order.product = "";
        this.order.description = "";
        this.order.price = 0;
        this.order.quantity = 1;

        this.$refs.form.resetValidation();
      }
    },
    EditOrder(item) {
      this.showAdd = false;

      this.order.id = item.id;
      this.order.product = item.product;
      this.order.description = item.description;
      this.order.price = item.price;
      this.order.quantity = item.quantity;
    },
    cancel() {
      this.showAdd = true;

      this.order.product = "";
      this.order.description = "";
      this.order.price = 0;
      this.order.quantity = 1;

      this.$refs.form.resetValidation();
    },
    saveOrder(idOrder) {
      if (this.$refs.form.validate()) {
        const formData = new FormData();

        formData.append("order", this.cart.id);
        formData.append("product", this.order.product);
        formData.append("description", this.order.description);
        formData.append("price", this.order.price);
        formData.append("quantity", this.order.quantity);

        apiOrders
          .editItem(idOrder, formData)
          .then(response => {
            this.getOrder();
          })
          .catch(error => {
            console.log(error);
          });

        this.order.product = "";
        this.order.description = "";
        this.order.price = 0;
        this.order.quantity = 1;

        this.$refs.form.resetValidation();

        this.showAdd = true;
      }
    },
    deleteItem(idOrder) {
      apiOrders
        .removeItem(idOrder)
        .then(response => {
          this.getOrder();
        })
        .catch(error => {
          console.log(error);
        });
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
