<template>
  <v-app>
    <v-content class="d-flex align-center">
      <v-row justify="center">
        <v-col cols="12" md="4">
          <base-material-card>
            <template v-slot:heading>
              <div class="display-2 font-weight-light text-center">
                Restaurar Contraseña
              </div>
              <div class="subtitle-1 font-weight-light text-center">
                <v-icon large>mdi-lock-alert-outline</v-icon>
              </div>
            </template>

            <v-form ref="form" v-model="valid" lazy-validation>
              <v-col cols="12" md="12">
                <v-col cols="12">
                  <v-text-field
                    label="Nueva Contraseña"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    class=" purple-input"
                    prepend-icon="mdi-lock"
                    :rules="passwordRules"
                    v-model="password"
                    @click:append="show1 = !show1"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Confirmar Nueva Contraseña"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    class=" purple-input"
                    prepend-icon="mdi-lock"
                    :rules="password2Rules"
                    v-model="password2"
                    @click:append="show2 = !show2"
                  />
                </v-col>

                <v-alert type="error" v-if="errors.length">
                  <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </v-alert>

                <v-col cols="12" class="text-center">
                  <v-btn
                    rounded
                    color="success"
                    class="mr-0"
                    @click="confirm()"
                  >
                    Restaurar Contraseña
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
  name: "ResetPasswordConfirm",
  data() {
    return {
      valid: true,
      password: "",
      password2: "",
      show1: false,
      show2: false,
      passwordRules: [
        v => !!v || "Este campo es requerido",
        v => v.length >= 8 || "Minimo 8 caracteres"
      ],
      password2Rules: [
        v => !!v || "Este campo es requerido",
        v => v === this.password || "Las contraseñas no son iguales"
      ],
      errors: []
    };
  },
  computed: {
    token() {
      return this.$route.params.token;
    }
  },
  methods: {
    confirm() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();

        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "Contraseña Restaurada Correctamente",
          color: "info"
        };

        formData.append("token", this.token);
        formData.append("password", this.password);

        this.errors = [];

        apiUsers
          .confirmPassword(formData)
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
