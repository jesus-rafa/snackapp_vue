<template>
  <v-app>
    <v-content class="d-flex align-center">
      <v-row justify="center">
        <v-col cols="12" md="6" mx="2">
          <v-sheet elevation="10">
            <base-material-card>
              <template v-slot:heading>
                <div class="display-2 font-weight-light text-center">
                  No se encontro la pagina solicitada!
                </div>
              </template>

              <v-card-text class="text-center">
                <v-img src="@/assets/error-404-concept-landing-page.png">
                </v-img>
              </v-card-text>

              <v-row justify="center" dense>
                <v-col cols="12" md="8" class="text-center">
                  <v-btn block rounded color="blue" class="my-2 mr-0" to="/">
                    Volver a la pagina principal
                  </v-btn>
                </v-col>
              </v-row>
            </base-material-card>
          </v-sheet>
        </v-col>
      </v-row>
      <alerts />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "PageNotFound"
};
</script>

<style></style>
