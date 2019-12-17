<template>
  <div class="container px-4">
    <h2 class="text-3xl font-semibold mb-2">Your Files</h2>
    <div class="file-grid">
      <File v-for="file in files" :key="file" :file="file" @click.native="handleClick(file)" />
    </div>
    <!-- {{ files }} -->
    <sweet-modal ref="modal">
      <sweet-modal-tab title="Preview" id="preview" v-html="getPreview(contentToShow)"></sweet-modal-tab>
      <sweet-modal-tab :disabled="fileType === 'txt'" title="Base64" id="base64">{{ contentToShow }}</sweet-modal-tab>
    </sweet-modal>
  </div>
</template>

<script>
import File from "@/components/File.vue";
export default {
  components: {
    File
  },
  data() {
    return {
      parentFolder: "",
      contentToShow: "",
      fileType: "",
      files: {}
    };
  },
  methods: {
    async handleClick(fileName) {
      console.log("filename", fileName);

      try {
        if (fileName.contains(".")) {
          this.files = await this.$axios.$get("");
        }

        const data = {
          requestedFilePath: this.parentFolder + "/" + fileName
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
    }
  },
  async mounted() {
    try {
      console.log("Loading");
      const { files, path } = await this.$axios.$get("/files/list/root");
      console.log("folders", files);
      (this.files = files), (this.parentFolder = path);
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
}

.file .icon {
  height: 100%;
}
</style>
