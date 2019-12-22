<template>
  <div class="container px-4 py-4">
    <p class="text-2xl font-semibold mb-4">You have access to these folders:</p>
    <nuxt-link
      v-for="folder in folders"
      :key="folder.id"
      class="p-3 bg-gray-200"
      :to="'shared/' + folder.id"
    >{{ folder.folder }}</nuxt-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      folders: []
    };
  },
  async mounted() {
    const folders = await this.$axios.$get("/shared/folders");
    this.folders = folders;
  }
};
</script>

<style lang="scss" scoped>
</style>