<template>
  <v-container id="dashboard" fluid tag="section">
    <v-sheet elevation="10">
      <v-data-table
        :headers="headers"
        :items="events"
        :search="search"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title></v-toolbar-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon left>mdi-plus</v-icon> Nuevo Evento
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    enctype="multipart/form-data"
                  >
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Nombre..."
                            prepend-icon="mdi-calendar-text"
                            :rules="NameRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
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
                                v-model="editedItem.date_start"
                                label="Fecha Inicio"
                                prepend-icon="mdi-calendar-edit"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="DateRules"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="editedItem.date_start"
                              @input="menu1 = false"
                              locale="es"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            ref="menu"
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="time"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.hour_start"
                                label="Hora de Inicio"
                                prepend-icon="mdi-clock-time-four-outline"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="TimeRules"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="menu2"
                              v-model="editedItem.hour_start"
                              full-width
                              @click:minute="
                                $refs.menu.save(editedItem.hour_start)
                              "
                            ></v-time-picker>
                          </v-menu>
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="editedItem.description"
                            label="Descripcion corta"
                            :rules="DescriptionRules"
                            prepend-icon="mdi-clipboard-text"
                          >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-row v-if="imageSelected" justify="center">
                            <v-avatar size="80">
                              <img alt="user" :src="imageSelected" />
                            </v-avatar>
                            <v-btn
                              v-if="imageSelected"
                              class="ma-5"
                              outlined
                              color="red"
                              fab
                              small
                              @click="removeImage()"
                            >
                              <v-icon small> mdi-close </v-icon>
                            </v-btn>
                          </v-row>

                          <v-file-input
                            accept="image/*"
                            label="Imagen de tu evento"
                            v-model="newImage"
                            @change="onFileSelected()"
                            prepend-icon="mdi-image-multiple"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h4"
                  ><strong>Seguro que desea eliminar este evento?</strong>
                  <v-card-subtitle>
                    Se perderán: Los pedidos, Lista de participantes y Pagos
                  </v-card-subtitle></v-card-title
                >

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.icon="{ item }">
          <v-icon size="30" @click="editEvent(item)">
            mdi-clipboard-edit-outline
          </v-icon>
        </template>
        <template v-slot:item.name="{ item }">
          <strong>{{ item.name }}</strong>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getColor(item.status)" dark>
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.date_start="{ item }">
          {{ frontEndDateFormat(item.date_start) }}
        </template>
        <template v-slot:item.image="{ item }">
          <v-avatar v-if="item.image" size="56">
            <img alt="user" :src="item.image" />
          </v-avatar>
          <v-avatar v-else size="56">
            <img alt="user" src="@/assets/events2.jpg" />
          </v-avatar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon @click="deleteItem(item)"> mdi-close </v-icon>
        </template>
        <template v-slot:no-data>
          Aun no haz creado eventos!
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>

<script>
import apiEvents from "@/api/events/";
import moment from "moment";

export default {
  name: "MyListEvents",
  data() {
    return {
      search: "",
      valid: true,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Administrar",
          align: "start",
          sortable: false,
          value: "icon"
        },
        {
          text: "Nombre",
          sortable: false,
          value: "name"
        },
        { text: "Descripcion Corta", value: "description" },
        { text: "Fecha Inicio", value: "date_start" },
        { text: "Hora Inicio", value: "hour_start" },
        { text: "Estatus", value: "status" },
        { text: "Imagen", value: "image", sortable: false },
        { text: "Acciones", value: "actions", sortable: false }
      ],
      events: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        description: "",
        date_start: "",
        hour_start: "",
        status: "NUEVO",
        create_by: "",
        image: null
      },
      defaultItem: {
        name: "",
        description: "",
        date_start: "",
        hour_start: "",
        status: "NUEVO",
        create_by: "",
        image: null
      },
      imageSelected: null,
      remove_image: false,
      newImage: null,
      date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      time: null,
      NameRules: [v => !!v || "Este campo es requerido"],
      DateRules: [v => !!v || "Este campo es requerido"],
      TimeRules: [v => !!v || "Este campo es requerido"],
      DescriptionRules: [v => !!v || "Este campo es requerido"],
      userData: []
    };
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser.id;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Evento" : "Editar Evento";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      apiEvents
        .byUser()
        .then(response => {
          this.events = response.data;
        })
        .catch(error => {
          if (error.response.data.detail)
            this.$store.dispatch("expireSession", true);
        });
    },
    onFileSelected() {
      this.editedItem.image = this.newImage;
    },
    getImage() {
      this.imageSelected = this.editedItem.image;
    },
    editEvent(item) {
      this.$router.push({
        name: "Administrar Evento",
        params: { id: item.id }
      });
    },
    editItem(item) {
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.getImage();
    },
    deleteItem(item) {
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      const idEvent = this.events[this.editedIndex].id;

      let notification = {
        snackbar: true,
        direction: "top center",
        msg: "Evento Eliminado Exitosamente!",
        color: "success"
      };

      apiEvents
        .delete(idEvent)
        .then(response => {
          this.$store.dispatch("showNotification", notification);
        })
        .catch(error => {
          console.log(error);
        });

      this.events.splice(this.editedIndex, 1);

      this.closeDelete();
    },

    close() {
      this.$refs.form.reset();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    removeImage() {
      this.remove_image = true;
      this.imageSelected = null;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          Object.assign(this.events[this.editedIndex], this.editedItem);
          this.editedItem.create_by = this.getUser;
          const idEvent = this.events[this.editedIndex].id;

          const formDataEdit = new FormData();

          let notification = {
            snackbar: true,
            direction: "top center",
            msg: "Evento Actualizado Exitosamente!",
            color: "success"
          };

          formDataEdit.append("name", this.editedItem.name);
          formDataEdit.append("description", this.editedItem.description);
          formDataEdit.append("date_start", this.editedItem.date_start);
          formDataEdit.append("hour_start", this.editedItem.hour_start);
          formDataEdit.append("status", this.editedItem.status);
          formDataEdit.append("create_by", this.editedItem.create_by);

          if (this.newImage !== null) {
            formDataEdit.append("image", this.editedItem.image);
          }
          if (this.remove_image) {
            formDataEdit.append("image", "");
          }

          apiEvents
            .update(idEvent, formDataEdit)
            .then(response => {
              this.initialize();

              this.$store.dispatch("showNotification", notification);
            })
            .catch(error => {
              console.log(error);
            });

          this.close();
        }
      } else {
        if (this.$refs.form.validate()) {
          const formData = new FormData();
          this.editedItem.create_by = this.getUser;

          formData.append("name", this.editedItem.name);
          formData.append("description", this.editedItem.description);
          formData.append("date_start", this.editedItem.date_start);
          formData.append("hour_start", this.editedItem.hour_start);
          formData.append("status", this.editedItem.status);
          formData.append("create_by", this.editedItem.create_by);

          if (this.editedItem.image !== null) {
            formData.append("image", this.editedItem.image);
          }

          let notification = {
            snackbar: true,
            direction: "top center",
            msg: "Evento Creado Exitosamente!",
            color: "success"
          };

          apiEvents
            .create(formData)
            .then(response => {
              this.events.push(response.data);

              this.$store.dispatch("showNotification", notification);
            })
            .catch(error => {
              console.log(error);
            });

          this.close();
        }
      }
    },
    getColor(status) {
      switch (status) {
        case "NUEVO":
          return "green";
        case "EN PROCESO":
          return "orange";
        case "LLEGO PEDIDO":
          return "blue";
        default:
          return "red";
      }
    },
    frontEndDateFormat: function(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
  }
};
</script>

<style></style>
