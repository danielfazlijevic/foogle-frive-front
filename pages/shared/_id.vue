<template>
  <div class="container px-4">
    <h2 class="text-3xl font-semibold mb-2">{{ linkData.folder}}'s Files</h2>
    <Files :isShared="true" v-if="!loading" />
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import Files from "@/components/Files.vue";

export default {
  components: {
    Files
  },
  data() {
    return {
      loading: true,
      linkData: {}
    };
  },
  methods: {},
  async mounted() {
    try {
      console.log("Loading");
      const { files, path } = await this.$axios.$get("/shared/list/" + this.linkData.id);
      console.log("folders", files);
      this.$store.commit("folderData/SET_FILES", files);
      this.$store.commit("folderData/SET_FOLDER_PATH", path);
      this.loading = false;
    } catch (err) {
      console.log("ERROR", err);
    }
  },
  async asyncData({ params, $axios }) {
    const linkData = await $axios.$get("/shared/link-info/" + params.id);
    console.log("link data", linkData);
    
    return { linkData };
  }
};
</script>

<style>
.file-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-auto-rows: 100px;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.file .icon {
  height: 100%;
}
</style>
