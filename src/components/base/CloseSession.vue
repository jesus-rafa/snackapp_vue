<template>
  <v-dialog v-model="expire" max-width="300px" persistent>
    <v-card elevation="24">
      <v-card-title class="text-h5">Aviso</v-card-title>
      <v-card-text align="center" justify="center" class="red--text text--h4"
        >¡Se Termino la Sesion!</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeSession()">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { deleteTokenApi } from "@/api/token";

export default {
  name: "CloseSession",
  computed: {
    ...mapGetters({
      expire: "expire"
    })
  },
  methods: {
    closeSession() {
      deleteTokenApi();
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push("/login");
      this.$store.dispatch("expireSession", false);
    }
  }
};
</script>

<style></style>
