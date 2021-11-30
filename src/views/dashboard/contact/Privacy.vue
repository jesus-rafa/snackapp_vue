<template>
  <v-container id="upgrade" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <base-material-card color="primary">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Politica de Privacidad
            </div>
          </template>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
/* import Alerts from "@/components/base/Alerts.vue";
import apiContact from "@/api/contact/"; */

export default {
  name: "Privacy",
  components: {    
  },
  data() {
  },
  methods: {
  }
};
</script>

<style lang="sass">
#upgrade
  .v-data-table
    th, td
      border: none !important
</style>
