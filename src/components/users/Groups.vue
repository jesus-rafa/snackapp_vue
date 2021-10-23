<template>
  <base-material-card color="blue" :loading="isUpdating">
    <template v-slot:heading>
      <div class="display-2 font-weight-light">
        Crea grupos para gestionar mas rapidamente tu evento
      </div>
    </template>

    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="model"
              :items="items"
              :filter="customFilter"
              :search-input.sync="search2"
              hide-details
              hide-selected
              item-text="email"
              label="Buscar participantes"
              solo
              prepend-icon="mdi-account-circle-outline"
              @change="reset"
            >
              <template v-slot:item="{ item }">
                <v-list-item-avatar>
                  <v-img
                    v-if="item.avatar"
                    :alt="`${item.get_full_name} avatar`"
                    :src="item.avatar"
                  ></v-img>
                  <v-avatar color="indigo" v-else>
                    <span class="white--text text-h5">{{
                      item.get_initials
                    }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.get_full_name"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="item.email"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              label="Nombre"
              class="purple-input"
              prepend-icon="mdi-account-group"
              v-model="group.name"
              :rules="GroupRules"
            />
          </v-col>

          <v-col cols="12" md="7">
            <v-text-field
              label="Descripcion"
              class=" purple-input"
              prepend-icon="mdi-notebook-outline"
              v-model="group.description"
            ></v-text-field>
          </v-col>

          <v-row justify="center">
            <v-avatar v-if="CurrentAvatar" size="60">
              <img alt="user" :src="CurrentAvatar" />
            </v-avatar>
            <v-avatar v-else size="60">
              <img alt="user" src="@/assets/groups.jpg" />
            </v-avatar>
            <v-col cols="12" md="5">
              <v-file-input
                accept="image/*"
                label="Logo"
                v-model="newAvatarGroup"
                @change="onFileSelected()"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <v-card color="#FAFAFA" dense>
              <v-row justify="center">
                <v-col cols="12" md="8" class="text-center">
                  <span
                    class="red--text text-h5"
                    v-if="count_participants == 0"
                  >
                    *requerido</span
                  >
                  <h4>
                    <strong>Participantes ({{ count_participants }})</strong>
                  </h4>
                </v-col>
                <v-col cols="12" md="8" class="text-center">
                  <v-chip
                    v-for="item in members"
                    :key="item.email"
                    close
                    @click:close="remove(item)"
                  >
                    <v-avatar left v-if="item.avatar">
                      <v-img :src="item.avatar"></v-img>
                    </v-avatar>
                    <v-avatar color="indigo" left v-else>
                      <span class="white--text text-h5">{{
                        item.get_initials
                      }}</span>
                    </v-avatar>
                    <span v-if="item.get_initials">{{
                      item.get_full_name
                    }}</span>
                    <span v-else>{{ item.email }}</span>
                  </v-chip>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
      <br />
      <v-row justify="center">
        <v-btn
          :loading="isUpdating"
          rounded
          color="blue"
          dark
          @click="addGroup()"
          v-if="showAdd"
        >
          <v-icon>
            mdi-plus
          </v-icon>
          Crear Grupo
        </v-btn>
        <v-btn
          v-if="!showAdd"
          :loading="isUpdating"
          rounded
          color="blue"
          dark
          @click="saveGroup(group.id)"
        >
          <v-icon>
            mdi-content-save-outline
          </v-icon>
          Guardar
        </v-btn>
        <v-btn
          v-if="!showAdd"
          class="mr-2"
          outlined
          color="red"
          fab
          small
          @click="cancel()"
        >
          <v-icon small>
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
    </v-card-text>

    <v-card-text class="text-center">
      <v-list dense>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="group in groups" :key="group.id">
            <v-list-item-avatar>
              <v-avatar left v-if="group.avatar">
                <v-img :src="group.avatar"></v-img>
              </v-avatar>
              <v-avatar left v-else>
                <v-img src="@/assets/groups.jpg"></v-img>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="group.name"></v-list-item-title>
              <v-list-item-subtitle v-text="group.description">
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-subtitle>
                ({{ group.sum_members }} Participantes)
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon @click="EditGroup(group)">
                mdi-pencil
              </v-icon>
            </v-list-item-action>
            <v-list-item-action>
              <v-icon @click="AssignPermission(group)">
                mdi-shield-account
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>

    <v-dialog v-model="dialog" @click:outside="dialog = false" width="550px">
      <v-card>
        <v-container>
          <v-card-title>
            <v-row>
              <v-col cols="12" class="text-center">
                Asignar permisos de Administrador
              </v-col>
              <v-col cols="12" md="6">
                <v-avatar left v-if="detail.avatar">
                  <v-img :src="detail.avatar"></v-img>
                </v-avatar>
                <v-avatar left v-else>
                  <v-img src="@/assets/groups.jpg"></v-img>
                </v-avatar>
                <span class="text-h5">
                  <strong>Grupo: </strong>{{ detail.name }}</span
                >
              </v-col>
              <v-col v-if="detail.user" cols="12" md="6">
                <v-chip class="ma-2">
                  Creado por: {{ detail.user.get_full_name }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" class="text-center">
              <h4>
                <strong>Participantes ({{ detail.sum_members }})</strong>
              </h4>
            </v-col>
          </v-card-text>
          <v-card-text class="text-center">
            <v-virtual-scroll
              :items="list_members"
              height="200"
              item-height="60"
            >
              <template v-slot:default="{ item }">
                <v-list dense>
                  <v-list-item :key="item.id">
                    <v-list-item-avatar>
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
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.user.get_full_name"
                      ></v-list-item-title>
                      <v-list-item-subtitle v-text="item.user.email">
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-list-item>
                        <v-switch
                          v-model="item.is_admin"
                          label="Admin"
                          color="success"
                          :value="item.is_admin"
                          hide-details
                        ></v-switch>
                      </v-list-item>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </template>
            </v-virtual-scroll>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="dialog = false">
              Cerrar
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="savePermissions(detail.id)"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </base-material-card>
</template>

<script>
import apiGroups from "@/api/groups/";
import Participants from "@/components/events/Participants.vue";

export default {
  name: "Groups",

  data() {
    return {
      valid: true,
      loading: false,
      dialogDelete: false,
      count_participants: 0,
      selectedItem: -1,
      items: [],
      model: null,
      search2: null,
      groups: [],
      kword: "",
      members: [],
      users: [],
      list_members: [],
      selectedItem: 1,
      search: "",
      isUpdating: false,
      title: "The summer breeze",
      headers: [
        {
          text: "Grupo",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Logo", value: "avatar", sortable: false },
        { text: "Descripcion", value: "description" },
        { text: "Participantes", value: "sum_members" },
        { text: "Acciones", value: "actions", sortable: false }
      ],
      GroupRules: [v => !!v || "Este campo es requerido"],
      showAdd: true,
      group: {
        id: 0,
        name: "",
        description: "",
        user: 0,
        avatar: null,
        members: []
      },
      newAvatarGroup: null,
      CurrentAvatar: null,
      idGroup: 0,
      dialog: false,
      detail: [],
      is_admin: false,
      reload: false
    };
  },

  created() {
    this.RetrieveGroups();
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser.id;
    }
  },
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 2000);
      }
    },
    kword: function(val) {
      this.SearchUsers(val);
    },
    search2(val) {
      if (this.items.length > 0) return;

      apiGroups
        .getUsers()
        .then(response => {
          this.items = response.data;
        })
        .catch(error => {
          if (error.response.data.detail)
            this.$store.dispatch("expireSession", true);
        });
    }
  },

  methods: {
    customFilter(item, queryText, itemText) {
      const textOne = item.email.toLowerCase();
      const textTwo = item.get_full_name.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    reset() {
      let index = this.items.findIndex(item => item.email === this.model);
      this.addMembers(this.items[index]);

      this.$nextTick(() => {
        this.model = null;
      });
    },
    onFileSelected() {
      return this.newAvatarGroup;
    },
    SearchUsers(kword) {
      apiGroups.members(kword).then(response => {
        this.users = response.data;
      });
    },
    addMembers(user) {
      let index = this.members.findIndex(item => item.email === user.email);

      if (index == -1) {
        this.members.push(user);
        this.group.members.push(user.id);
        this.count_participants = this.group.members.length;
      } else {
        let notification = {
          snackbar: true,
          direction: "top center",
          important: "Ya agregado: ",
          msg: user.email,

          color: "info"
        };

        this.$store.dispatch("showNotification", notification);
      }
    },
    RetrieveGroups() {
      apiGroups.byUser().then(response => {
        this.groups = response.data;
      });
    },
    remove(item) {
      const index = this.members.indexOf(item);
      if (index >= 0) {
        this.members.splice(index, 1);
        this.group.members.splice(index, 1);

        this.count_participants = this.group.members.length;
      }
    },
    addGroup() {
      if (this.$refs.form.validate() & (this.count_participants > 0)) {
        this.isUpdating = true;

        let formData = new FormData();

        formData.append("name", this.group.name.toUpperCase());
        formData.append("description", this.group.description);
        formData.append("user", this.getUser);

        if (this.newAvatarGroup !== null) {
          formData.append("avatar", this.onFileSelected());
        }

        this.group.members.forEach(item => {
          formData.append("members", item);
        });

        apiGroups
          .addGroup(formData)
          .then(response => {
            let notification = {
              snackbar: true,
              direction: "top center",
              msg: response.data.success,
              color: "success"
            };

            this.RetrieveGroups();
            this.reload = true;

            this.$store.dispatch("reload", true);
            this.$store.dispatch("showNotification", notification);

            this.clearData();
            this.$refs.form.resetValidation();
          })
          .catch(error => {
            if (error.response.data.detail) {
              this.$store.dispatch("expireSession", true);
            } else {
              let error_msg = {
                snackbar: true,
                direction: "top center",
                msg: error.response.data.error,
                color: "error"
              };

              this.$store.dispatch("showNotification", error_msg);
            }
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
    },
    AssignPermission(group) {
      this.dialog = true;
      this.detail = group;

      console.log(this.detail);

      apiGroups
        .getMembers(group.id)
        .then(response => {
          this.list_members = response.data[0].members;
        })
        .catch(error => {
          console.log(error);
        });
    },
    savePermissions(group) {
      this.dialog = false;

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

      apiGroups
        .assignPermissions(group, formData)
        .then(response => {
          this.$store.dispatch("showNotification", notification);
        })
        .catch(error => {
          console.log(error);
        });
    },
    clearData() {
      this.group.id = 0;
      this.group.name = "";
      this.group.description = "";
      this.CurrentAvatar = null;
      this.group.members = [];
      this.members = [];
      this.newAvatarGroup = null;
      this.count_participants = 0;
    },
    EditGroup(item) {
      this.showAdd = false;
      this.clearData();

      this.group.id = item.id;
      this.group.name = item.name;
      this.group.description = item.description;
      this.CurrentAvatar = item.avatar;

      apiGroups
        .getMembers(item.id)
        .then(response => {
          let data = response.data[0].members;

          data.forEach(element => {
            this.members.push(element.user);
            this.group.members.push(element.user.id);
          });

          this.count_participants = this.group.members.length;
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel() {
      this.showAdd = true;
      this.clearData();
      this.$refs.form.resetValidation();
    },
    saveGroup(idGroup) {
      if (this.$refs.form.validate() & (this.count_participants > 0)) {
        this.isUpdating = true;

        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "Grupo Actualizado Exitosamente!",
          color: "success"
        };
        let formData = new FormData();

        formData.append("name", this.group.name.toUpperCase());
        formData.append("description", this.group.description);
        formData.append("user", this.getUser);

        if (this.newAvatarGroup !== null) {
          formData.append("avatar", this.onFileSelected());
        }

        this.group.members.forEach(item => {
          formData.append("members", item);
        });

        apiGroups
          .editGroup(idGroup, formData)
          .then(response => {
            this.RetrieveGroups();
            this.reload = true;

            this.$store.dispatch("showNotification", notification);
            this.$store.dispatch("reload", true);
          })
          .catch(error => {
            //console.log(error);

            let error_response = {
              snackbar: true,
              direction: "top center",
              msg: error,
              color: "error"
            };

            this.$store.dispatch("showNotification", error_response);
          });

        this.$refs.form.resetValidation();
        this.clearData();
        this.showAdd = true;
      } else {
        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "No hay participantes",
          color: "warning"
        };
        this.$store.dispatch("showNotification", notification);
      }
    },

    closeDelete() {
      this.dialogDelete = false;
      this.idGroup = 0;
    },
    deleteItem(idGroup) {
      this.dialogDelete = true;
      this.idGroup = idGroup;
    },

    deleteItemConfirm() {
      if (this.idGroup !== 0) {
        let notification = {
          snackbar: true,
          direction: "top center",
          msg: "Grupo Eliminado Exitosamente!",
          color: "success"
        };

        apiGroups
          .removeGroup(this.idGroup)
          .then(response => {
            this.RetrieveGroups();

            this.$store.dispatch("showNotification", notification);
          })
          .catch(error => {
            console.log(error);
          });
      }

      this.closeDelete();
    }
  }
};
</script>

<style></style>
