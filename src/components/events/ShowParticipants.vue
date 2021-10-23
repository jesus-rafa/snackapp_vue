<template>
  <base-material-card flat>
    <template v-slot:heading>
      <div class="display-2 font-weight-light">
        Lista de Invitados
      </div>
    </template>

    <v-container>
      <v-card-title>
        <v-row>
          <v-col cols="12" class="text-center">
            <span class="red--text text-h5" v-if="count_participants == 0">
              *requerido</span
            >
            <h5>
              <strong>Participantes ({{ count_participants }})</strong>
            </h5>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="text-center">
        <v-sheet elevation="10">
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="list_members"
              :search="search"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar left v-if="item.user.avatar">
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
              <template v-slot:item.is_admin="{ item }">
                <v-switch
                  v-model="item.is_admin"
                  color="success"
                  :value="item.is_admin"
                  hide-details
                  :disabled="approved"
                ></v-switch>
              </template>
              <template v-slot:no-data>
                <strong>Aun no haz agregado Participantes!</strong>
              </template>
            </v-data-table>
          </v-card>
        </v-sheet>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row justify="center">
          <v-col cols="12" md="12">
            <v-btn
              v-if="approved == false"
              :loading="loading"
              rounded
              color="blue"
              dark
              @click="savePermissions()"
            >
              Guardar Permisos
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-container>
  </base-material-card>
</template>

<script>
import apiEvents from "@/api/events/";
import Participants from "@/components/events/Participants.vue";

export default {
  name: "ShowParticipants",
  data() {
    return {
      loading: false,
      members: [],
      list_members: [],
      count_participants: 0,
      approved: false,
      search: "",
      headers: [
        {
          text: "avatar",
          align: "start",
          filterable: false,
          value: "avatar"
        },
        { text: "Nombre", value: "user.get_full_name" },
        { text: "Email", value: "user.email" },
        { text: "admin", value: "is_admin" }
      ]
    };
  },
  computed: {
    idEvent() {
      return this.$route.params.id;
    }
  },
  mounted() {
    apiEvents
      .getParticipants(this.idEvent)
      .then(response => {
        this.list_members = response.data[0].participants;
        this.count_participants = this.list_members.length;
      })
      .catch(error => {
        console.log(error);
      });

    apiEvents
      .validate_permission(this.idEvent)
      .then(response => {
        this.approved = response.data.approved;
      })
      .catch(error => {
        console.log(error);
      });
  },

  methods: {
    savePermissions() {
      if (this.count_participants > 0) {
        this.loading = true;
        setTimeout(() => (this.loading = false), 2000);

        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "Permisos Guardados Exitosamente!",
          color: "success"
        };

        const formData = new FormData();

        this.list_members.forEach(element => {
          if (element.is_admin) {
            formData.append("members", element.user.id);
          }
        });

        apiEvents
          .assignPermissions(this.idEvent, formData)
          .then(response => {
            this.$store.dispatch("showNotification", notification);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "No hay participantes",
          color: "warning"
        };
        this.$store.dispatch("showNotification", notification);
      }
    }
  }
};
</script>

<style></style>
