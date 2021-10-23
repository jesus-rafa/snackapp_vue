<template>
  <v-app>
    <v-content class="d-flex align-center">
      <v-row justify="center">
        <v-col cols="12" md="4" mx="2">
          <base-material-card>
            <template v-slot:heading>
              <div class="display-2 font-weight-light text-center">
                Acceso
              </div>
              <div class="subtitle-1 font-weight-light text-center">
                <v-icon large>mdi-account-circle</v-icon>
              </div>
            </template>

            <v-card-text class="text-left">
              <p class="font-weight-light grey--text text-center">
                Bienvenido!
              </p>
              <p class="font-weight-light grey--text text-center">
                App para administrar eventos
              </p>
            </v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-col cols="12" md="12">
                <div class="d-flex ">
                  <v-text-field
                    label="Email"
                    class=" purple-input"
                    prepend-icon="mdi-email"
                    :rules="emailRules"
                    v-model="username"
                  />
                </div>
                <div class="d-flex">
                  <v-text-field
                    label="Contraseña"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    class=" purple-input"
                    prepend-icon="mdi-lock"
                    :rules="passwordRules"
                    v-model="password"
                    @click:append="show1 = !show1"
                    @keyup.enter.native="LoginUser()"
                  />
                </div>

                <v-alert type="error" v-if="errors.length">
                  <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </v-alert>

                <v-col cols="12" class="text-center">
                  <v-btn
                    color="success"
                    rounded
                    class="mr-0"
                    @click="LoginUser()"
                  >
                    Iniciar Sesion
                  </v-btn>
                </v-col>

                <v-col cols="12" class="text-center">
                  <router-link to="/reset-password"
                    ><strong>¿Olvidaste tu Contraseña?</strong></router-link
                  >
                </v-col>
              </v-col>
            </v-form>
            <v-row justify="center" dense>
              <v-col cols="12" md="8" class="text-center">
                <v-btn
                  block
                  rounded
                  color="blue"
                  class="my-2 mr-0"
                  to="/register"
                >
                  Registro
                </v-btn>
              </v-col>
            </v-row>
          </base-material-card>
        </v-col>
      </v-row>
      <alerts />
    </v-content>
  </v-app>
</template>

<script>
import apiUsers from "@/api/users";
import { setTokenApi, getTokenApi } from "@/api/token";
import { mapActions } from "vuex";
import Alerts from "@/components/base/Alerts.vue";

export default {
  name: "LoginPage",
  components: {
    Alerts
  },
  data() {
    return {
      valid: true,
      show1: false,
      username: "",
      password: "",
      passwordRules: [v => !!v || "Este campo es requerido"],
      emailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail debe ser valido"
      ],
      errors: []
    };
  },
  methods: {
    loginWithGoogle() {
      this.$auth.loginWith("google");
    },
    LoginUser() {
      if (this.$refs.form.validate()) {
        const formData = {
          username: this.username,
          password: this.password
        };

        this.errors = [];

        apiUsers
          .login(formData)
          .then(response => {
            setTokenApi(response.data.token);

            apiUsers
              .retrieve()
              .then(response => {
                this.$store.dispatch("retrieveUser", response.data);
                this.$router.push("/");
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            for (const err in error.response.data) {
              this.errors.push(`${error.response.data[err]}`);
            }
          });
      }
    },
    Register: function() {
      this.$router.push("/register");
    }
  }
};
</script>

<style></style>
