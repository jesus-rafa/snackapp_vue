<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="9" id="dvPrint">
        <v-row align="center" justify="space-around">
          <v-btn rounded color="pink" dark @click="chooseDownload()">
            <v-icon left>
              mdi-file-pdf-box
            </v-icon>
            Descargar PDF
            <v-dialog v-model="downloadDialog" persistent width="350px">
              <v-card>
                <v-card-title class="text-h5">
                  <strong>Descargar lista de:</strong>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row justify="center">
                      <div class="row align-center justify-space-around">
                        <v-btn
                          rounded
                          color="green darken-1"
                          dark
                          small
                          @click="generatePDF_JSON(0)"
                        >
                          <v-icon left>
                            mdi-clipboard-text-outline
                          </v-icon>
                          Pedidos
                        </v-btn>
                        <v-btn
                          rounded
                          color="blue darken-1"
                          dark
                          small
                          @click="generatePDF_JSON(1)"
                        >
                          <v-icon left>
                            mdi-account-multiple
                          </v-icon>
                          Invitados
                        </v-btn>
                        <v-btn
                          rounded
                          color="pink darken-1"
                          dark
                          small
                          @click="generatePDF(nameEvent)"
                        >
                          <v-icon left>
                            mdi-clipboard-text
                          </v-icon>
                          Todo
                        </v-btn>
                      </div>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="downloadDialog = false"
                  >
                    Cancelar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>

          <v-btn
            :disabled="disable_delivery"
            rounded
            color="blue"
            dark
            id="custom-disabled-delivery"
            @click="orderDelivered"
          >
            <v-icon left> mdi-truck-delivery-outline </v-icon>
            LLego Pedido
            <v-dialog v-model="deliveryDialog" persistent width="350px">
              <v-card>
                <v-card-title class="text-h5">
                  Notificar que el pedido ya esta listo
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row justify="center">
                      <div class="text-center">
                        <v-col cols="12" md="12">
                          <v-switch
                            v-model="delivery"
                            color="success"
                            value="success"
                            hide-details
                          ></v-switch>
                        </v-col>
                      </div>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="deliveryDialog = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn color="green darken-1" text @click="deliveryStatus">
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>

          <v-btn
            :disabled="disabled_close"
            rounded
            color="red"
            dark
            id="custom-disabled-close"
            @click="closeEvent"
          >
            <v-icon left> mdi-check-outline </v-icon>
            Evento Pagado
            <v-dialog v-model="closeDialog" persistent width="350px">
              <v-card>
                <v-card-title class="text-h5"> Concluir Evento </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row justify="center">
                      <div class="text-center">
                        <v-col cols="12" md="12">
                          <v-switch
                            v-model="finish"
                            color="success"
                            value="success"
                            hide-details
                          ></v-switch>
                        </v-col>
                      </div>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="closeDialog = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn color="green darken-1" text @click="closeStatus">
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-row>
      </v-col>

      <v-col cols="12" md="9">
        <v-sheet elevation="10">
          <base-material-card color="primary">
            <template v-slot:heading>
              <v-row>
                <v-col cols="12" md="10">
                  <div class="display-2 font-weight-light">
                    {{ nameEvent }}
                  </div>
                </v-col>
                <v-col cols="12" md="2" class="text-center">
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :loading="isUpdating"
                        dark
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="loadOrder()"
                      >
                        <v-icon dark>
                          mdi-refresh
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Actualizar Pedido</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="5">
                  <div class="display-1 float-md-center font-weight-bold">
                    Cantidad: {{ count }}
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="display-1 float-md-center font-weight-bold">
                    Pagado: $ {{ parseFloat(paid_out).toFixed(2) }}
                  </div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="display-1 float-md-center font-weight-bold">
                    Total: $ {{ parseFloat(total).toFixed(2) }}
                  </div>
                </v-col>
              </v-row>
            </template>

            <v-data-table
              :headers="orderstHeaders"
              :items="list_orders"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="user.id"
              show-expand
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <div class="display-1 float-md-center font-weight-bold">
                    <v-chip
                      class="ma-2"
                      :color="getColor(status)"
                      label
                      text-color="white"
                      x-small
                    >
                      {{ status }}
                    </v-chip>
                  </div>
                  <v-spacer></v-spacer>
                  <v-progress-circular
                    :value="progress_value"
                    :size="50"
                    color="green"
                  >
                    <div
                      class="display-1 float-md-center font-weight-bold text--white"
                    >
                      {{ Math.ceil(progress_value) }}%
                    </div>
                  </v-progress-circular>
                  <v-spacer></v-spacer>
                  <v-switch
                    v-model="showDetail"
                    @change="expand()"
                    label="Expandir"
                    class="mt-2"
                  ></v-switch>
                  <v-dialog v-model="dialog" persistent width="350px">
                    <v-card>
                      <v-card-title class="text-h5">
                        Agregar Pago
                      </v-card-title>
                      <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-container>
                            <v-row justify="center">
                              <v-col cols="12">
                                <div class="text-center">
                                  <v-avatar size="50" left v-if="avatar">
                                    <v-img :src="avatar"></v-img>
                                  </v-avatar>
                                  <v-avatar color="indigo" v-else>
                                    <span
                                      v-if="initials"
                                      class="white--text text-h5"
                                      >{{ initials }}</span
                                    >
                                    <v-img
                                      v-else
                                      src="@/assets/user_group.png"
                                    ></v-img>
                                  </v-avatar>
                                  <span class="ma-2" v-if="name"
                                    >{{ name }}
                                  </span>
                                  <span class="ma-2" v-else>
                                    {{ email }}
                                  </span>
                                </div>
                              </v-col>
                              <v-col cols="12" md="12">
                                <div class="text-center">
                                  <div
                                    class="display-2 float-md-center font-weight-bold"
                                  >
                                    Total: $ {{ payment.amount }}
                                  </div>
                                </div>
                              </v-col>
                              <v-col cols="12" md="12">
                                <v-text-field
                                  v-model="money"
                                  label="Monto"
                                  class=" purple-input"
                                  prepend-icon="mdi-currency-usd"
                                  :rules="moneyRules"
                                />
                              </v-col>
                              <v-col cols="12" md="12">
                                <div class="text-center">
                                  <div
                                    class="display-1 float-md-center font-weight-bold"
                                  >
                                    cambio: $ {{ remaining }}
                                  </div>
                                </div>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="clearForm()">
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="green darken-1"
                          text
                          @click="editPayment(payment.id)"
                        >
                          Aceptar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-simple-table>
                    <thead>
                      <th>Producto</th>
                      <th>Descripcion</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </thead>
                    <tbody>
                      <tr v-for="detail in item.items" v-bind:key="detail.id">
                        <td>{{ detail.product }}</td>
                        <td>{{ detail.description }}</td>

                        <td class="text-center">$ {{ detail.price }}</td>
                        <td class="text-center">{{ detail.quantity }}</td>
                        <td class="text-center">
                          $
                          {{
                            subTotal(detail.quantity, detail.price).toFixed(2)
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </td>
              </template>
              <template v-slot:item.user.avatar="{ item }">
                <v-avatar size="50" left v-if="item.user.avatar">
                  <v-img :src="item.user.avatar"></v-img>
                </v-avatar>
                <v-avatar color="indigo" v-else>
                  <span
                    v-if="item.user.get_initials"
                    class="white--text text-h5"
                    >{{ item.user.get_initials }}</span
                  >
                  <v-img v-else src="@/assets/user_group.png"></v-img>
                </v-avatar>
              </template>
              <template v-slot:item.user.get_full_name="{ item }">
                <span v-if="item.user.get_full_name"
                  >{{ item.user.get_full_name }}
                </span>
                <span v-else> {{ item.user.email }} </span>
              </template>
              <template v-slot:item.amount="{ item }">
                $ {{ item.amount }}
              </template>
              <template v-slot:item.quantity="{ item }">
                {{ item.quantity }}
              </template>
              <template v-slot:item.paid_out="{ item }">
                <v-chip
                  :color="item.paid_out == false ? 'red' : 'green'"
                  dark
                  @click="showPayment(item, status)"
                >
                  $ {{ item.amount_paid }}
                </v-chip>
              </template>
              <template v-slot:item.date="{ item }">
                {{ frontEndDateFormat(item.date) }}
              </template>
            </v-data-table>
          </base-material-card>
        </v-sheet>
      </v-col>
      <v-col cols="12" xl="9" md="9" sm="9" xs="9" v-show="flagPDF">
        <div ref="content" id="report">
          <v-sheet elevation="10">
            <base-material-card color="green">
              <template v-slot:heading>
                <v-row justify="center">
                  <v-col cols="12" xl="12" md="12" sm="12" xs="12">
                    <div class="text-center">
                      <h2>
                        <strong>{{ nameEvent }}</strong>
                      </h2>
                    </div>
                  </v-col>
                  <v-col cols="12" xl="5" md="5" sm="5" xs="5">
                    <div class="text-center">
                      <h3>Cantidad Total: {{ count }}</h3>
                    </div>
                  </v-col>
                  <v-col cols="12" xl="7" md="7" sm="7" xs="7">
                    <div class="text-center">
                      <h3>Total: ${{ parseFloat(total).toFixed(2) }}</h3>
                    </div>
                  </v-col>
                </v-row>
              </template>

              <v-data-table
                ref="myTable"
                :headers="headersPDF"
                :items="list_orders"
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                item-key="user.id"
                show-expand
                class="elevation-1"
                hide-default-footer
                disable-pagination
                mobile-breakpoint="0"
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-simple-table>
                      <thead>
                        <th>Producto</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </thead>
                      <tbody>
                        <tr v-for="detail in item.items" v-bind:key="detail.id">
                          <td>{{ detail.product }}</td>
                          <td>{{ detail.description }}</td>

                          <td class="text-center">$ {{ detail.price }}</td>
                          <td class="text-center">
                            {{ detail.quantity }}
                          </td>
                          <td class="text-center">
                            $
                            {{
                              subTotal(detail.quantity, detail.price).toFixed(2)
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </td>
                </template>
                <template v-slot:item.user.get_full_name="{ item }">
                  <span v-if="item.user.get_full_name"
                    >{{ item.user.get_full_name }}
                  </span>
                  <span v-else> {{ item.user.email }} </span>
                </template>
                <template v-slot:item.amount="{ item }">
                  $ {{ item.amount }}
                </template>
                <template v-slot:item.quantity="{ item }">
                  {{ item.quantity }}
                </template>
                <template v-slot:item.date="{ item }">
                  {{ frontEndDateFormat(item.date) }}
                </template>
              </v-data-table>
            </base-material-card>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiOrders from "@/api/orders";
import apiEvents from "@/api/events";
import apiGroups from "@/api/groups/";

import moment from "moment";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

export default {
  name: "OrderbyEvent",
  components: {},
  data() {
    return {
      flagPDF: false,
      valid: true,
      loading: false,
      isUpdating: false,
      dialog: false,
      disabled_close: false,
      disable_delivery: false,
      deliveryDialog: false,
      downloadDialog: false,
      finish: false,
      delivery: false,
      closeDialog: false,
      orderstHeaders: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "user.avatar"
        },
        { text: "Usuario", value: "user.get_full_name" },
        { text: "Pagado", value: "paid_out" },
        { text: "Cantidad", value: "quantity" },
        { text: "Total", value: "amount" },
        { text: "", value: "data-table-expand" }
      ],
      headersPDF: [
        // {
        //   text: "",
        //   align: "start",
        //   sortable: false,
        //   value: "user.avatar"
        // },
        { text: "Usuario", value: "user.get_full_name" },
        { text: "Cantidad", value: "quantity" },
        { text: "Total", value: "amount" },
        { text: "", value: "data-table-expand" }
      ],
      list_orders: [],
      expanded: [],
      payment: [],
      avatar: null,
      initials: "",
      name: "",
      email: "",
      singleExpand: false,
      showDetail: false,
      total: 0,
      count: 0,
      paid_out: 0,
      remaining: 0,
      money: 0,
      moneyRules: [
        v => !!v || "Pago es requerido",
        v => v > 0 || "Debe ser mayor a 0.00"
      ],
      content: "",
      progress_value: 0,
      status: "",
      list_users: [],
      nameEvent: "",
      approved: false
    };
  },
  watch: {
    money() {
      this.remaining = parseFloat(this.money - this.payment.amount).toFixed(2);
    }
  },
  computed: {
    idEvent() {
      return this.$route.params.id;
    }
  },
  mounted: function() {
    this.retrieveStatus();
    this.loadOrder();
    this.ValidatePermission();
  },
  methods: {
    ValidatePermission() {
      apiEvents
        .validate_permission(this.idEvent)
        .then(response => {
          this.approved = response.data.approved;
          console.log(this.approved);
        })
        .catch(error => {
          console.log(error);
        });
    },
    retrieveStatus() {
      apiEvents.getStatus(this.idEvent).then(response => {
        this.status = response.data.status;
        this.nameEvent = response.data.name;

        if (this.status == "CONCLUIDO") {
          this.disable_delivery = true;
          this.disabled_close = true;
        }
        if (this.status == "LLEGO PEDIDO") {
          this.disable_delivery = true;
        }
      });
    },
    expand: function() {
      if (this.showDetail) {
        this.$data.expanded = this.$data.list_orders;
      } else {
        this.$data.expanded = [];
      }
    },
    subTotal: function(quantity, price) {
      return quantity * price;
    },
    editPayment(idOrder) {
      if (this.$refs.form.validate()) {
        const formData = new FormData();

        formData.append("amount_paid", this.money);

        apiOrders.editPaid(idOrder, formData).then(response => {
          this.loadOrder();
        });

        this.clearForm();
      }
    },
    loadOrder: function() {
      this.isUpdating = true;
      setTimeout(() => (this.isUpdating = false), 2000);

      apiOrders
        .byEvent(this.idEvent)
        .then(response => {
          this.list_orders = response.data;

          let count = [];
          let total = [];
          let paid_out = [];
          this.list_users = [];

          response.data.forEach(dato => {
            this.list_users.push(dato.user);
          });
          Object.entries(this.list_orders).forEach(([key, val]) => {
            count.push(val.quantity);
            total.push(parseFloat(val.amount));
            paid_out.push(parseFloat(val.amount_paid));
          });

          this.count = count.reduce(function(count, num) {
            return count + num;
          }, 0);

          this.total = total.reduce(function(total, num) {
            return total + num;
          }, 0);

          this.paid_out = paid_out.reduce(function(paid_out, num) {
            return paid_out + num;
          }, 0);

          if (this.total !== 0)
            this.progress_value = (this.paid_out * 100) / this.total;
        })
        .catch(error => {
          if (error.response.data.detail)
            this.$store.dispatch("expireSession", true);
        });
    },
    frontEndDateFormat: function(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    },
    showPayment(item, status) {
      if (status == "EN PROCESO") {
        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "No cuentas con los permisos suficientes",
          color: "warning"
        };

        if (this.approved === false) {
          this.dialog = true;

          this.money = 0;
          this.remaining = 0;
          this.payment = item;
          this.avatar = item.user.avatar;
          this.initials = item.user.get_initials;
          this.name = item.user.get_full_name;
          this.email = item.user.email;
        } else {
          this.$store.dispatch("showNotification", notification);
        }
      } else {
        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "Evento Concluido o LLego Pedido",
          color: "error"
        };
        this.$store.dispatch("showNotification", notification);
      }
    },
    clearForm() {
      this.$refs.form.reset();
      this.dialog = false;

      this.money = 0;
      this.remaining = 0;
    },
    generatePDF(nameEvent) {
      this.flagPDF = true;

      var filename = nameEvent + ".pdf";
      var element = document.getElementById("report");
      var opt = {
        margin: 1,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save();

      this.flagPDF = false;
    },
    closeEvent() {
      this.closeDialog = true;
    },
    orderDelivered() {
      this.deliveryDialog = true;
    },
    chooseDownload() {
      this.downloadDialog = true;
    },
    deliveryStatus() {
      if (this.delivery == "success") {
        this.updateStatus("LLEGO PEDIDO");
        this.deliveryDialog = false;
        this.loadOrder();

        let formData = new FormData();

        formData.append("idEvent", this.idEvent);
        this.list_users.forEach(item => {
          formData.append("listEmails", item.email);
        });
        apiGroups
          .sendEmailDelivered(formData)
          .then(response => {
            this.dialogDelete = false;

            let notification = {
              snackbar: true,
              direction: "top center",
              msg: response.data.message,
              important: "",
              color: "success"
            };
            this.$store.dispatch("showNotification", notification);

            this.loading = true;
            setTimeout(() => (this.loading = false), 3000);

            setTimeout(() => (this.redirect = true), 3000);

            if (this.redirect) {
              this.$router.push({
                name: "Eventos"
              });
            }
          })
          .catch(error => {
            let notification = {
              snackbar: true,
              direction: "top center",
              msg: error,
              important: "",
              color: "error"
            };
            this.$store.dispatch("showNotification", notification);
            this.dialogDelete = false;
          });
      }
    },
    closeStatus() {
      if (this.finish == "success") {
        this.updateStatus("CONCLUIDO");

        this.closeDialog = false;
      }
    },
    getColor(status) {
      switch (status) {
        case "NUEVO":
          return "green";
        case "EN PROCESO":
          return "orange";
        case "LLEGO PEDIDO":
          return "blue";
        default:
          return "red";
      }
    },
    updateStatus(status) {
      let formData = new FormData();

      formData.append("status", status);

      apiEvents.editStatus(this.idEvent, formData).then(response => {
        this.retrieveStatus();
      });
    },

    generatePDF_JSON(idList) {
      var source = this.$refs["myTable"];
      let rows = [];
      let pdfOrder = "Pedidos_" + this.nameEvent;
      let pdfList = "Invitados_" + this.nameEvent;
      let i = 1;
      if (idList) {
        source.items.forEach(element => {
          let objrow = {
            ID: i.toString(),
            USUARIO: element.user.get_full_name.toString()
          };
          rows.push(Object.assign({}, objrow));
          i++;
        });
      } else {
        source.items.forEach(element => {
          element.items.forEach(item => {
            let objrow = {
              ID: i.toString(),
              PRODUCTO: item.product.toUpperCase(),
              DESCRIPCION: item.description.toUpperCase(),
              PRECIO: item.price.toUpperCase(),
              CANTIDAD: item.quantity.toString()
            };
            rows.push(Object.assign({}, objrow));
            i++;
          });
        });
      }

      function createHeaders(keys) {
        let result = [];
        for (var i = 0; i < keys.length; i += 1) {
          result.push({
            id: keys[i],
            name: keys[i],
            prompt: keys[i],
            width: 100,
            align: "center",
            padding: 0
          });
        }
        return result;
      }

      let headers = function(id) {
        let result = [];
        if (id) {
          result = createHeaders(["ID", "USUARIO"]);
        } else {
          result = createHeaders([
            "ID",
            "PRODUCTO",
            "DESCRIPCION",
            "PRECIO",
            "CANTIDAD"
          ]);
        }
        return result;
      };
      var doc = new jsPDF({ putOnlyUsedFonts: true });
      doc.table(10, 10, rows, headers(idList), { autoSize: true });
      idList == true ? doc.save(pdfList + ".pdf") : doc.save(pdfOrder + ".pdf");
    }
  }
};
</script>

<style scoped>
@media print {
  #dvPrint {
    display: none !important;
  }
}
.v-progress-circular {
  margin: 1rem;
}
#custom-disabled-delivery.v-btn--disabled {
  background-color: #78909c !important;
  color: white !important;
}

#custom-disabled-close.v-btn--disabled {
  background-color: #78909c !important;
  color: white !important;
}
</style>
