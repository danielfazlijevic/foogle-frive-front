<template>
  <div>
    <p>
      Path:
      <span class="tracking-wide">{{ currentFolderPath }}</span>
    </p>
    <div class="toolbar">
      <button
        :disabled="!canGoBack"
        class="flex justify-center text-white p-2 mb-2 rounded"
        :class="[!canGoBack ? 'bg-gray-600' : 'bg-blue-400']"
        @click="goBack"
      >
        <v-icon class="h-6 w-6" name="arrow-left" />Back
      </button>
    </div>
    <div class="file-grid">
      <File v-for="file in files" :key="file" :file="file" @click.native="handleClick(file)" />
    </div>

    <FABButton v-if="!isShared" />

    <!-- {{ files }} -->
    <sweet-modal ref="modal">
      <sweet-modal-tab title="Preview" id="preview" v-html="getPreview(contentToShow)"></sweet-modal-tab>
      <sweet-modal-tab :disabled="fileType === 'txt'" title="Base64" id="base64">{{ contentToShow }}</sweet-modal-tab>

      <button slot="button">
        <a href>Download</a>
      </button>
    </sweet-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import { isImage } from "@/utils/files";

import File from "@/components/File.vue";
import FABButton from "@/components/FABButton.vue";

export default {
  props: {
    isShared: {
      type: Boolean,
      default: false
    }
  },
  components: {
    File,
    FABButton
  },
  data() {
    return {
      contentToShow: "",
      fileType: ""
    };
  },
  computed: {
    ...mapGetters({
      currentFolderPath: "folderData/getFolderPath",
      files: "folderData/getFiles"
    }),
    prefix() {
      return this.isShared ? "/shared" : "";
    },
    canGoBack(){
      return this.currentFolderPath.includes('/') && this.currentFolderPath.lastIndexOf('/') !== 0
    }
  },

  methods: {
    async handleClick(fileName) {
      console.log("filename", fileName);
      try {
        if (!fileName.includes(".")) {
        const sharedLinkId = this.$route.params.id;
        const path = sharedLinkId ? this.currentFolderPath  + '/' + fileName : '/' + fileName; 
        console.log('requesting path:', path);
        await this.$store.dispatch("folderData/setFolderData", { fileName: path , sharedLinkId });
          // console.log(this.files);
          return;
        }

        const data = {
          requestedFilePath: this.currentFolderPath + "/" + fileName
        };

        this.contentToShow = await this.$axios.$post(
          `${this.prefix}/files/get`,
          data
        );
        if (fileName.endsWith(".txt")) {
          this.fileType = "txt";
        }
        if (isImage(fileName)) {
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
      console.log('currentFolderPath', this.currentFolderPath)
      const substrIndexFirst = this.isShared ? this.currentFolderPath.indexOf('/') + 1 : 0; 
      const currentFolderPath = this.currentFolderPath.substr(
        0,
        this.currentFolderPath.lastIndexOf("/")
      );
      console.log('folder path: ', currentFolderPath)
      console.log("parent", currentFolderPath);
      const API_URL = this.isShared ? `/shared/list/${this.$route.params.id}` : "files/list";
      const { files, path } = await this.$axios.$get(API_URL, {
        params: { path: currentFolderPath }
      });
      this.$store.commit("folderData/SET_FILES", files);
      this.$store.commit("folderData/SET_FOLDER_PATH", path);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>