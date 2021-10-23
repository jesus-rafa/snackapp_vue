<template>
  <v-container fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-tabs v-model="tab" centered fixed-tabs>
          <v-tab>Editar Evento</v-tab>
          <v-tab>Agregar Participantes</v-tab>
          <v-tab>Ver Participantes</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <edit-event />
          </v-tab-item>
          <v-tab-item>
            <participants />
          </v-tab-item>
          <v-tab-item>
            <show-participants />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="12" md="4">
        <card-event />
      </v-col>
    </v-row>

    <v-dialog v-model="blocked" max-width="300px" persistent>
      <v-card elevation="24">
        <v-card-title class="text-h5">Aviso</v-card-title>
        <v-card-text align="center" justify="center" class="red--text text--h4"
          >¡No puedes editar este evento!</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="backEvents()">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import apiEvents from "@/api/events/";
import CardEvent from "@/components/events/CardEvent.vue";
import EditEvent from "@/components/events/EditEvent.vue";
import Participants from "@/components/events/Participants.vue";
import ShowParticipants from "@/components/events/ShowParticipants.vue";

export default {
  name: "AdminEvent",
  components: {
    CardEvent,
    EditEvent,
    Participants,
    ShowParticipants
  },
  data() {
    return {
      aviso: false,
      showUsers: false,
      showMembers: false,
      button_text: "Agregar Participantes",
      dialog: false,
      blocked: false,
      tab: null
    };
  },
  computed: {
    idEvent() {
      return this.$route.params.id;
    },
    getUser() {
      return this.$store.getters.getUser.id;
    }
  },
  mounted() {
    apiEvents
      .validate_permission(this.idEvent, this.getUser)
      .then(response => {
        if (response.data.approved) {
          this.blocked = true;
        }
      })
      .catch(error => {
        this.blocked = true;
      });
  },
  methods: {
    addParticipants() {
      this.showUsers = !this.showUsers;

      this.button_text = this.showUsers
        ? "Editar Detalle"
        : "Agregar Participantes";
    },
    backEvents() {
      this.$router.push({
        name: "Eventos"
      });
    }
  }
};
</script>

<style></style>
