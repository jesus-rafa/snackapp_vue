<template>
  <v-app>
    <v-content class="d-flex align-center">
      <v-row justify="center">
        <v-col cols="12" md="4">
          <base-material-card>
            <template v-slot:heading>
              <div class="display-2 font-weight-light text-center">
                Recuperar Contraseña
              </div>
              <div class="subtitle-1 font-weight-light text-center">
                <v-icon large>mdi-lock-alert-outline</v-icon>
              </div>
            </template>

            <v-form ref="form" v-model="valid" lazy-validation>
              <v-col cols="12" md="12">
                <div class="d-flex ">
                  <v-text-field
                    label="Email"
                    class=" purple-input"
                    prepend-icon="mdi-email"
                    :rules="emailRules"
                    v-model="email"
                  />
                </div>

                <v-alert type="error" v-if="errors.length">
                  <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </v-alert>

                <v-col cols="12" class="text-center">
                  <v-btn rounded color="success" class="mr-0" @click="reset()">
                    Solicitar
                  </v-btn>
                </v-col>
              </v-col>
            </v-form>
          </base-material-card>
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import apiUsers from "@/api/users";

export default {
  name: "ResetPasswordPage",
  data() {
    return {
      valid: true,
      email: "",
      emailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail debe ser valido"
      ],
      errors: []
    };
  },
  methods: {
    reset() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();

        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "Se ha enviado un correo para restaurar la contraseña",
          color: "info"
        };

        formData.append("email", this.email);

        this.errors = [];

        apiUsers
          .resetPassword(formData)
          .then(response => {
            this.$router.push("/login");

            this.$store.dispatch("showNotification", notification);
          })
          .catch(error => {
            for (const err in error.response.data) {
              this.errors.push(`${error.response.data[err]}`);
            }
          });
      }
    }
  }
};
</script>

<style></style>
