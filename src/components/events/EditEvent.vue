<template>
  <base-material-card flat>
    <template v-slot:heading>
      <div v-if="showForm" class="display-2 font-weight-light">
        (Agrega informacion detallada de tu evento)
      </div>
      <div v-else class="display-2 font-weight-light">
        Detalle
      </div>
    </template>

    <v-container class="py-0">
      <br />
      <v-row>
        <v-col cols="12" md="12">
          <vue-editor
            v-if="showForm"
            v-model="model.content"
            :editorOptions="editorSettings"
          />
          <div v-else v-html="model.content"></div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-row v-if="showForm" justify="center">
            <v-avatar v-if="loadImage1" size="60">
              <img alt="user" :src="loadImage1" />
            </v-avatar>
            <v-btn
              v-if="loadImage1"
              class="ma-2"
              outlined
              color="red"
              fab
              small
              @click="removeImage1()"
            >
              <v-icon small>
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
          <v-file-input
            v-if="showForm"
            accept="image/*"
            label="Imagen Opcional"
            prepend-icon="mdi-camera-image"
            v-model="new_image1"
            @change="loadImage_1()"
          ></v-file-input>
          <v-row v-if="!showForm">
            <v-img v-if="loadImage1" :src="loadImage1" height="125"></v-img>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-row v-if="showForm" justify="center">
            <v-avatar v-if="loadImage2" size="60">
              <img alt="user" :src="loadImage2" />
            </v-avatar>
            <v-btn
              v-if="loadImage2"
              class="ma-2"
              outlined
              color="red"
              fab
              small
              @click="removeImage2()"
            >
              <v-icon small>
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
          <v-file-input
            v-if="showForm"
            accept="image/*"
            label="Imagen Opcional"
            prepend-icon="mdi-camera-image"
            v-model="new_image2"
            @change="loadImage_2()"
          ></v-file-input>
          <v-row v-if="!showForm">
            <v-img v-if="loadImage2" :src="loadImage2" height="125"></v-img
          ></v-row>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-row v-if="showForm" justify="center">
            <v-btn
              v-if="loadfile"
              class="ma-2"
              color="blue"
              @click="desArchivo(loadfile)"
              download
              rounded
              small
            >
              Descargar
            </v-btn>
            <v-btn
              v-if="loadfile"
              class="ma-0"
              outlined
              color="red"
              fab
              small
              @click="removeFile()"
            >
              <v-icon small>
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
          <br />
          <v-file-input
            v-if="showForm"
            label="Archivo Opcional"
            outlined
            dense
            prepend-icon="mdi-file-pdf-box-outline"
            v-model="model.file"
          ></v-file-input>
          <v-row v-if="!showForm" justify="center">
            <v-btn
              v-if="loadfile"
              class="ma-2"
              color="blue"
              @click="downloadFile(loadfile)"
              download
              rounded
            >
              Descargar Archivo
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-btn
            v-if="showButton"
            rounded
            color="green"
            dark
            :loading="loading"
            @click="saveDetail()"
          >
            Guardar
          </v-btn>
          <v-btn
            v-if="showButton"
            class="mr-2"
            outlined
            color="red"
            fab
            small
            @click="editDetail()"
          >
            <v-icon small>
              mdi-close
            </v-icon>
          </v-btn>
          <v-btn
            v-if="!showButton"
            rounded
            color="green"
            dark
            :loading="loading"
            @click="editDetail()"
          >
            Editar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </base-material-card>
</template>

<script>
import { mapState } from "vuex";

import { VueEditor, Quill } from "vue2-editor";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
import apiEvents from "@/api/events/";

Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

export default {
  name: "EditEvent",
  components: { VueEditor },
  data() {
    return {
      loading: false,
      detail: [],
      model: {
        id: 0,
        name: 0,
        content:
          "<p><strong>Buen día...</strong><br></p><p>Agrega información importante para tu evento...<br></p><ul><li>Listas de Precios</li><li>Menús de comida</li><li>Contactos</li><li>Notas</li></ul>",
        image1: null,
        image2: null,
        file: null
      },
      new_image1: null,
      new_image2: null,
      loadImage1: null,
      loadImage2: null,
      remove_image1: false,
      remove_image2: false,
      remove_file: false,
      loadfile: null,
      showButton: true,
      showForm: true,
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {}
        }
      }
    };
  },
  computed: {
    idEvent() {
      return this.$route.params.id;
    }
  },

  mounted: function() {
    this.RetrieveDetailEvent();
  },
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
    },
    loadImage_1() {
      this.model.image1 = this.new_image1;
    },
    loadImage_2() {
      this.model.image2 = this.new_image2;
    },
    removeImage1() {
      this.remove_image1 = true;
      this.loadImage1 = null;
      this.new_image1 = null;
    },
    removeImage2() {
      this.remove_image2 = true;
      this.loadImage2 = null;
      this.new_image2 = null;
    },
    removeFile() {
      this.remove_file = true;
      this.loadfile = null;
    },
    RetrieveDetailEvent() {
      apiEvents
        .detail(this.idEvent)
        .then(response => {
          this.model.id = response.data[0].id;
          this.model.name = response.data[0].name;
          this.model.content = response.data[0].content;

          this.loadImage1 = response.data[0].image1;
          this.loadImage2 = response.data[0].image2;
          this.loadfile = response.data[0].file;
        })
        .catch(error => {
          console.log(error);
        });
    },

    saveDetail() {
      this.loading = true;

      let notification = {
        snackbar: true,
        direction: "top center",
        msg: "Guardado Exitosamente!",
        color: "success"
      };

      const formData = new FormData();
      this.model.name = this.idEvent;

      formData.append("name", this.model.name);
      formData.append("content", this.model.content);
      if (this.model.image1 !== null) {
        formData.append("image1", this.model.image1);
      }
      if (this.model.image2 !== null) {
        formData.append("image2", this.model.image2);
      }
      if (this.model.file !== null) {
        formData.append("file", this.model.file);
      }
      // eliminar archivos
      if (this.remove_image1) {
        formData.append("image1", "");
      }
      if (this.remove_image2) {
        formData.append("image2", "");
      }
      if (this.remove_file) {
        formData.append("file", "");
      }

      if (this.model.id !== 0) {
        apiEvents
          .updateDetail(this.model.id, formData)
          .then(response => {
            this.RetrieveDetailEvent();

            this.$store.dispatch("showNotification", notification);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        apiEvents
          .createDetail(formData)
          .then(response => {
            this.RetrieveDetailEvent();

            this.$store.dispatch("showNotification", notification);
          })
          .catch(error => {
            console.log(error);
          });
      }

      this.model.image1 = null;
      this.model.image2 = null;
      this.model.file = null;

      setTimeout(() => (this.loading = false), 1500);
      this.showButton = !this.showButton;
      this.showForm = !this.showForm;
    },
    editDetail() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 1500);

      this.model.image1 = null;
      this.model.image2 = null;
      this.model.file = null;

      this.showButton = !this.showButton;
      this.showForm = !this.showForm;
    },
    downloadFile(file) {
      window.open(file, "_blank");
    }
  }
};
</script>

<style lang="css">
@import "~vue2-editor/dist/vue2-editor.css";
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.bubble.css";
@import "~quill/dist/quill.snow.css";
</style>
