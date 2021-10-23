<template>
  <v-container id="upgrade" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <base-material-card color="primary">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Contacto
            </div>

            <div class="subtitle-1 font-weight-light">
              Que otra funcionalidad te gustaría que tuviera la app?
            </div>

            <div class="subtitle-1 font-weight-light">
              Que nuevos módulos te gustaria que se agregaran?
            </div>
          </template>

          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            enctype="multipart/form-data"
          >
            <v-container class="py-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="contact"
                    :rules="ContactRules"
                    class="purple-input"
                    label="Contacto"
                    prepend-icon="mdi-account-circle"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="EmailRules"
                    label="Email"
                    class="purple-input"
                    prepend-icon="mdi-at"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="message"
                    :rules="MessageRules"
                    class="purple-input"
                    label="Mensaje"
                    value="Comparte tu opinion..."
                    prepend-icon="mdi-email-open-multiple-outline"
                  />
                </v-col>

                <v-col cols="12" class="text-center">
                  <v-btn
                    color="success"
                    rounded
                    class="mr-0"
                    :loading="loading"
                    @click="SendInfo()"
                  >
                    Enviar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <alerts />
    </v-row>
  </v-container>
</template>

<script>
import Alerts from "@/components/base/Alerts.vue";
import apiContact from "@/api/contact/";

export default {
  name: "Contact",
  components: {
    Alerts
  },
  data() {
    return {
      valid: true,
      loading: false,
      contact: "",
      email: "",
      message: "",
      ContactRules: [v => !!v || "Contacto es requerido"],
      EmailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail debe ser valido"
      ],
      MessageRules: [v => !!v || "Comparte tu opinion"]
    };
  },
  methods: {
    SendInfo() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        setTimeout(() => (this.loading = false), 2000);

        let notification = {
          snackbar: true,
          direction: "top center",
          important: "GRACIAS POR TUS COMENTARIOS!",
          msg: "Mensaje Enviado Exitosamente!",
          color: "info"
        };

        const formData = new FormData();
        formData.append("contact", this.contact);
        formData.append("email", this.email);
        formData.append("message", this.message);

        apiContact
          .emailContact(formData)
          .then(response => {
            this.$store.dispatch("showNotification", notification);
          })
          .catch(error => {
            console.log(error);
          });

        this.$refs.form.reset();
      }
    }
  }
};
</script>

<style lang="sass">
#upgrade
  .v-data-table
    th, td
      border: none !important
</style>
