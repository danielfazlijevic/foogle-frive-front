<template>
  <div class="container px-4">
    <h2 class="text-3xl font-semibold mb-2">Your Files</h2>
    <div v-if="!loading">
      <p>
        Path:
        <span class="tracking-wide">{{ currentFolderPath }}</span>
        <button
          :disabled="!currentFolderPath.includes('/')"
          class="flex justify-center text-white p-2 mb-2 rounded"
          :class="[!currentFolderPath.includes('/') ? 'bg-gray-600' : 'bg-blue-400']"
          @click="goBack"
        >
          <v-icon class="h-6 w-6" name="arrow-left" />Back
        </button>
      </p>
      <div class="file-grid">
        <File v-for="file in files" :key="file" :file="file" @click.native="handleClick(file)" />
      </div>

      <FABButton />

      <!-- {{ files }} -->
      <sweet-modal ref="modal">
        <sweet-modal-tab title="Preview" id="preview" v-html="getPreview(contentToShow)"></sweet-modal-tab>
        <sweet-modal-tab
          :disabled="fileType === 'txt'"
          title="Base64"
          id="base64"
        >{{ contentToShow }}</sweet-modal-tab>
      </sweet-modal>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import File from "@/components/File.vue";
import FABButton from "@/components/FABButton.vue";

import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    File,
    FABButton
  },
  data() {
    return {
      loading: true,
      contentToShow: "",
      fileType: ""
    };
  },
  computed: {
    // currentFolderPath() {
    //   // return this.$store.getters.folderData.getFolderPath;
    //   return 'das'
    // },
    ...mapGetters({
      currentFolderPath: "folderData/getFolderPath",
      files: "folderData/getFiles"
    })
  },
  methods: {
    async handleClick(fileName) {
      console.log("filename", fileName);
      try {
        if (!fileName.includes(".")) {
          await this.$store.dispatch("folderData/setFolderData", { fileName });
          console.log(this.files);
          return;
        }

        const data = {
          requestedFilePath: this.currentFolderPath + "/" + fileName
        };

        this.contentToShow = await this.$axios.$post("/files/get", data);
        if (fileName.endsWith(".txt")) {
          this.fileType = "txt";
        }
        if (fileName.endsWith(".jpg")) {
          this.fileType = "img";
        }

        this.$refs.modal.open("preview");
      } catch (err) {
        console.error(err);
      }
    },
    getPreview(content) {
      if (this.fileType === "txt") return content;
      if (this.fileType === "img")
        return `<img src="data:image/png;base64,${content}"/>`;
    },
    async goBack() {
      const currentFolderPath = this.currentFolderPath.substr(
        0,
        this.currentFolderPath.lastIndexOf("/")
      );
      console.log("parent", currentFolderPath);
      const { files, path } = await this.$axios.$get("/files/list", {
        params: { path: currentFolderPath }
      });
      this.$store.commit('folderData/SET_FILES', files);
      this.$store.commit("folderData/SET_FOLDER_PATH", path);
    }
  },
  async mounted() {
    try {
      console.log("Loading");
      const { files, path } = await this.$axios.$get("/files/list/root");
      console.log("folders", files);
      this.$store.commit("folderData/SET_FILES", files);
      this.$store.commit("folderData/SET_FOLDER_PATH", path);
      this.loading = false;
    } catch (err) {
      console.log("ERROR", err);
    }
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
