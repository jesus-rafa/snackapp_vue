<template>
  <v-app>
    <v-content class="d-flex align-center">
      <v-row justify="center">
        <v-col cols="12" md="6">
          <base-material-card>
            <template v-slot:heading>
              <div class="display-2 font-weight-light text-center">
                Crear Cuenta
              </div>
              <div class="subtitle-1 font-weight-light text-center">
                <v-icon large>mdi-account-circle</v-icon>
              </div>
            </template>

            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombres"
                      class=" purple-input"
                      prepend-icon="mdi-account-details"
                      :rules="NameRules"
                      v-model="name"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Apellidos"
                      class=" purple-input"
                      prepend-icon="mdi-account-details"
                      :rules="LastNameRules"
                      v-model="last_name"
                    />
                  </v-col>

                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Email"
                      class=" purple-input"
                      prepend-icon="mdi-email"
                      :rules="emailRules"
                      v-model="email"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-radio-group v-model="gender" row>
                      <v-radio label="Hombre" value="M"></v-radio>
                      <v-radio label="Mujer" value="F"></v-radio>
                    </v-radio-group>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Contraseña"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      class=" purple-input"
                      prepend-icon="mdi-lock"
                      :rules="passwordRules"
                      v-model="password"
                      @click:append="show1 = !show1"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Confirmar Contraseña"
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
                    <p v-for="error in errors" v-bind:key="error">
                      {{ error }}
                    </p>
                  </v-alert>

                  <v-col cols="12" md="12">
                    <v-col cols="12" class="text-center">
                      <v-btn
                        rounded
                        color="success"
                        class="mr-0"
                        @click="RegisterUser()"
                      >
                        Crear Cuenta
                      </v-btn>
                    </v-col>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <v-row justify="center" dense>
              <v-col cols="12" md="8" class="text-center">
                <v-btn
                  block
                  rounded
                  color="blue"
                  class="my-2 mr-0"
                  @click="Login()"
                >
                  Iniciar Sesion
                </v-btn>
              </v-col>
            </v-row>
          </base-material-card>
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import apiUsers from "@/api/users";
import { getTokenApi, setTokenApi } from "@/api/token";

export default {
  name: "RegisterPage",
  data() {
    return {
      valid: true,
      name: "",
      show1: false,
      show2: false,
      last_name: "",
      email: "",
      password: "",
      password2: "",
      gender: "",
      NameRules: [v => !!v || "Este campo es requerido"],
      LastNameRules: [v => !!v || "Este campo es requerido"],
      passwordRules: [
        v => !!v || "Este campo es requerido",
        v => (v && v.length >= 8) || "Minimo 8 caracteres"
      ],
      password2Rules: [
        v => !!v || "Este campo es requerido",
        v => v === this.password || "Las contraseñas no son iguales"
      ],
      emailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail debe ser valido"
      ],
      errors: []
    };
  },
  methods: {
    RegisterUser() {
      if (this.$refs.form.validate()) {
        const formData = {
          names: this.name,
          last_names: this.last_name,
          email: this.email,
          gender: this.gender,
          password: this.password,
          password2: this.password2
        };

        this.errors = [];

        apiUsers
          .register(formData)
          .then(response => {
            setTokenApi(response.data.token);
            this.$store.dispatch("retrieveUser", response.data.user);
            this.$router.push("/");
          })
          .catch(error => {
            for (const err in error.response.data) {
              this.errors.push(`${error.response.data[err]}`);
            }
          });
      }
    },
    Login: function() {
      this.$router.push("/login");
    }
  }
};
</script>
