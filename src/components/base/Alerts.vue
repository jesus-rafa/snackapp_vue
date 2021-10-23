<template>
  <base-material-snackbar
    v-if="getNofitication"
    v-model="getNofitication.snackbar"
    :color="getNofitication.color"
    v-bind="{
      [parsedDirection[0]]: true,
      [parsedDirection[1]]: true
    }"
    border="botton"
  >
    <span class="font-weight-bold"
      >&nbsp;{{ getNofitication.important }}&nbsp;</span
    >
    {{ getNofitication.msg }}
  </base-material-snackbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Alerts",
  computed: {
    ...mapGetters({
      getNofitication: "getNofitication"
    }),
    parsedDirection() {
      return this.getNofitication.direction.split(" ");
    }
  }
};
</script>

<style scoped></style>
