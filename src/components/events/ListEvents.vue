<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row justify="center">
      <div class="text-center">
        <v-chip-group active-class="primary--text">
          <v-chip @click="(page = 1), filter('EN PROCESO')">
            En Proceso
          </v-chip>
          <v-chip @click="(page = 1), filter('CONCLUIDO')"> Concluidos </v-chip>
        </v-chip-group>
      </div>
    </v-row>

    <v-row v-if="list_events">
      <v-col
        cols="12"
        sm="6"
        lg="4"
        v-for="event in list_events"
        :key="event.id"
      >
        <v-sheet elevation="10">
          <v-card :loading="loading">
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-img
              v-if="event.image"
              max-height="150"
              height="250"
              :src="event.image"
            ></v-img>
            <v-img
              v-else
              max-height="150"
              height="250"
              alt="user"
              src="@/assets/events2.jpg"
            ></v-img>

            <v-card-title>{{ event.name }}</v-card-title>

            <v-card-text>
              <div class="text-center">
                <v-chip
                  class="ma-2"
                  :color="getColor(event.status)"
                  label
                  text-color="white"
                  small
                >
                  {{ event.status }}
                </v-chip>
              </div>

              <div class="my-4 text-subtitle-1">
                <p class="font-weight-black">
                  Creado por: {{ event.create_by.get_full_name }}
                </p>
              </div>

              <div>{{ event.description }}</div>
            </v-card-text>

            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                @click="showDetailPanel(event.id)"
              >
                Ver
              </v-btn>
            </div>

            <v-divider class="ma-2"></v-divider>

            <v-card-text>
              <v-row justify="center">
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2">
                    <v-icon color="grey darken-2"> mdi-calendar </v-icon>
                    {{ frontEndDateFormat(event.date_start) }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2">
                    <v-icon color="grey darken-2"> mdi-clock </v-icon>
                    {{ event.hour_start }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-if="list_events.length == 0">
      <v-col cols="12">
        <div class="text-center">
          <br />
          <br />
          <h2>No hay Eventos Disponibles!</h2>
          <br />
          <br />
        </div>
      </v-col>
    </v-row>

    <br />
    <br />

    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="numPages"
        :total-visible="totalVisible"
        circle
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import moment from "moment";
import apiEvents from "@/api/events/";
import apiOrders from "@/api/orders";

export default {
  name: "ListEvents",
  data() {
    return {
      list_users: [],
      list_events: [],
      loading: false,
      page: 1,
      numPages: 1,
      totalVisible: 7,
      filter_status: ""
    };
  },
  watch: {
    filter_status() {
      this.numPages = 1;
    },
    page() {
      this.filter(this.filter_status);
    }
  },
  mounted: function() {
    this.filter("EN PROCESO");
    this.reserve();
  },
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
    },
    filter: function(status) {
      this.filter_status = status;

      apiEvents
        .list(status, this.page)
        .then(response => {
          this.list_events = response.data.results;

          let num = response.data.count / 6; // dividir entre el total: page_size

          if (num % 1 != 0) this.numPages = parseInt(num) + 1;
          else this.numPages = num;
        })
        .catch(error => {
          if (error.response.data.detail)
            this.$store.dispatch("expireSession", true);
        });
    },
    showDetailPanel: function(idEvent) {
      let notification = {
        snackbar: true,
        direction: "top center",
        msg: "Evento privado",
        color: "error"
      };
      let list_users = [];
      apiOrders.byUser(idEvent).then(response => {
        // validar que el usuario este en el evento
        let flag = response.data[0];
        if (flag) {
          this.$router.push({
            name: "Detalle del Evento",
            params: { id: idEvent }
          });
        } else {
          this.$store.dispatch("showNotification", notification);
        }
      });
    },
    getColor(status) {
      switch (status) {
        case "EN PROCESO":
          return "orange";
        case "LLEGO PEDIDO":
          return "blue";
        default:
          return "red";
      }
    },
    frontEndDateFormat: function(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
  }
};
</script>

<style></style>
