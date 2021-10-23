<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <groups />
      </v-col>
      <v-col cols="12" md="4">
        <my-groups />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Groups from "@/components/users/Groups.vue";
import MyGroups from "@/components/users/MyGroups.vue";

export default {
  name: "AdminGroups",
  components: {
    Groups,
    MyGroups
  }
};
</script>

<style></style>
