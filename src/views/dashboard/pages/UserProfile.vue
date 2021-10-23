<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Editar Perfil
            </div>

            <div class="subtitle-1 font-weight-light">
              Completa tu perfil
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
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="getUser.names"
                    :rules="NamesRules"
                    class="purple-input"
                    label="Nombres"
                    prepend-icon="mdi-account-details"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="getUser.last_names"
                    :rules="NamesRules"
                    label="Apellidos"
                    class="purple-input"
                    prepend-icon="mdi-account-details-outline"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="getUser.date_birth"
                        label="Fecha Nacimiento"
                        class="purple-input"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="getUser.date_birth"
                      :active-picker.sync="activePicker"
                      @input="menu1 = false"
                      locale="es"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                  <v-radio-group v-model="getUser.gender" row>
                    <v-radio label="Hombre" value="M"></v-radio>
                    <v-radio label="Mujer" value="F"></v-radio>
                  </v-radio-group>
                </v-col>

                <v-row justify="center">
                  <v-col cols="12" md="6">
                    <v-file-input
                      accept="image/*"
                      label="Avatar"
                      v-model="newAvatar"
                      @change="onFileSelected()"
                      prepend-icon="mdi-account-circle"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-col cols="12" class="text-center">
                  <v-btn
                    color="success"
                    rounded
                    class="mr-0"
                    :loading="loading"
                    @click="updateUser()"
                  >
                    Actualizar
                  </v-btn>
                </v-col>
              </v-row>
              <base-material-alert
                v-model="snackbar"
                v-text="message"
                key="success"
                color="green"
                dark
                dismissible
              >
                <span class="text-uppercase" />
                Perfil Actualizado
              </base-material-alert>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="4">
        <base-material-card class="v-card-profile" :avatar="getUser.avatar">
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              {{ getUser.email }}
            </h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ getUser.get_full_name }}
            </h4>
            <br />

            <p class="font-weight-light grey--text"></p>

            <v-row justify="center">
              <v-dialog v-model="dialog" persistent max-width="350px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="green" rounded dark v-bind="attrs" v-on="on">
                    Cambiar Contraseña
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">
                    Cambiar Contraseña
                  </v-card-title>
                  <v-card-text>
                    <v-row justify="center">
                      <v-form ref="form2" v-model="valid2" lazy-validation>
                        <v-col cols="12" md="12">
                          <v-text-field
                            label="Contraseña Actual"
                            class=" purple-input"
                            prepend-icon="mdi-lock-outline"
                            :rules="oldPasswordRules"
                            v-model="old_password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                          />
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            label="Contraseña Nueva"
                            class=" purple-input"
                            prepend-icon="mdi-lock-check"
                            :rules="passwordRules"
                            v-model="new_password"
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show2 ? 'text' : 'password'"
                            @click:append="show2 = !show2"
                          />
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            label="Confirmar Contraseña"
                            class=" purple-input"
                            prepend-icon="mdi-lock-check-outline"
                            :rules="passwordConfirmRules"
                            v-model="new_password_confirm"
                            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show3 ? 'text' : 'password'"
                            @click:append="show3 = !show3"
                          />
                        </v-col>

                        <v-alert type="error" v-if="errors.length">
                          <p v-for="error in errors" v-bind:key="error">
                            {{ error }}
                          </p>
                        </v-alert>
                      </v-form>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="clearForm">
                      Cancelar
                    </v-btn>
                    <v-btn color="green darken-1" text @click="newPassword()">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiUsers from "@/api/users";
import { mapGetters } from "vuex";

export default {
  name: "UserProfile",
  data() {
    return {
      valid: true,
      valid2: true,
      dialog: false,
      loading: false,
      menu1: false,
      activePicker: null,
      date: null,
      newAvatar: null,
      snackbar: false,
      message: "",
      direction: "top center",
      old_password: "",
      new_password: "",
      new_password_confirm: "",
      NamesRules: [v => !!v || "Este campo es requerido"],
      oldPasswordRules: [v => !!v || "Este campo es requerido"],
      passwordRules: [
        v => !!v || "Este campo es requerido",
        v => (v && v.length >= 8) || "Minimo 8 caracteres"
      ],
      passwordConfirmRules: [
        v => !!v || "Este campo es requerido",
        v => v === this.new_password || "Las contraseñas no son iguales"
      ],
      show1: false,
      show2: false,
      show3: false,
      errors: [],
      getUser: []
    };
  },
  watch: {
    menu1(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    }
  },
  beforeMount() {
    this.retrieveUser();
  },
  methods: {
    retrieveUser() {
      const user = this.$store.getters.getUser;
      if (user === null) {
        apiUsers
          .retrieve()
          .then(response => {
            this.$store.dispatch("retrieveUser", response.data);
            this.getUser = response.data;
          })
          .catch(error => {
            this.$router.push("/");
          });
      } else {
        this.getUser = user;
      }
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    onFileSelected() {
      return this.newAvatar;
    },
    clearForm() {
      this.$refs.form2.reset();
      this.dialog = false;
      this.errors = [];
    },
    newPassword() {
      if (this.$refs.form2.validate()) {
        const formData = {
          old_password: this.old_password,
          new_password: this.new_password
        };

        this.errors = [];

        apiUsers
          .changePassword(formData)
          .then(response => {
            this.clearForm();
            this.message = "Contraseña Actualizada";
            this.snackbar = true;
            setTimeout(() => (this.snackbar = false), 3000);
          })
          .catch(error => {
            for (const err in error.response.data) {
              this.errors.push(`${error.response.data[err]}`);
            }
          });
      }
    },
    updateUser() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1800);

        const formData = new FormData();

        const idUser = this.getUser.id;

        formData.append("names", this.getUser.names);
        formData.append("last_names", this.getUser.last_names);
        formData.append("date_birth", this.getUser.date_birth);
        formData.append("gender", this.getUser.gender);
        formData.append("email", this.getUser.email);

        if (this.newAvatar !== null) {
          formData.append("avatar", this.onFileSelected());
        }

        this.errors = [];
        apiUsers
          .edit(idUser, formData)
          .then(response => {
            this.newAvatar = null;
            this.message = "Perfil Actualizado";
            this.snackbar = true;
            setTimeout(() => (this.snackbar = false), 3000);
            apiUsers
              .retrieve()
              .then(response => {
                this.$store.dispatch("retrieveUser", response.data);
                this.getUser = response.data;
              })
              .catch(error => {
                this.$router.push("/");
              });
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
