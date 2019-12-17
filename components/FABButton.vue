<template>
  <div class="fab-button">
    <v-icon
      @click.native="toggled = !toggled"
      class="fab-trigger h-16 w-16 shadow-md p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 hover:shadow-lg"
      :class="{toggled}"
      name="plus"
    />
    <transition name="fade">
      <div v-if="toggled" class="fab-buttons h-16">
        <button
          @click="showFileUploadPanel"
          class="bg-blue-600 mr-2 font-semibold text-white px-3 py-2 rounded-lg uppercase tracking-wide shadow-lg flex justify-between items-center hover:bg-blue-700 transition"
        >
          Upload file
          <v-icon class="ml-2 h-4 w-4" name="upload" />
        </button>
        <button
          @click="showCreateFolderPanel"
          class="bg-blue-600 mr-2 font-semibold text-white px-3 py-2 rounded-lg uppercase tracking-wide shadow-lg flex justify-between items-center hover:bg-blue-700 transition"
        >
          Create folder
          <v-icon class="ml-2 h-4 w-4" name="folder-plus" />
        </button>
      </div>
    </transition>
    <sweet-modal ref="fileUpload">
      <div class="file-upload">
        <label>
          File
          <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
        </label>
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          :disabled="file == null"
          v-on:click="submitFile()"
        >Upload</button>
      </div>
    </sweet-modal>
    <sweet-modal title="Create New Folder" ref="createFolder">
      <div class="flex justify-between items center">
        <input
          class="shadow appearance-none border rounded mr-3 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="folderName"
          type="text"
          placeholder="Folder name"
        />
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          :disabled="folderName.length === 0"
          v-on:click="createFolder()"
        >Create</button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      toggled: false,
      file: null,
      folderName: ""
    };
  },
  computed: {
    ...mapGetters({
      currentFolderPath: "folderData/getFolderPath",
      files: "folderData/getFiles"
    })
  },
  methods: {
    showFileUploadPanel() {
      this.toggled = false;
      this.$refs.fileUpload.open();
    },
    showCreateFolderPanel() {
      this.toggled = false;
      this.$refs.createFolder.open();
    },
    async submitFile() {
      let formData = new FormData();

      formData.append("filePath", this.currentFolderPath);
      formData.append("file", this.file);
      console.log("form data", formData);

      await this.$axios
        .$put("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .catch(function(err) {
          alert("Error while trying to upload.");
          console.warn(err);
          console.log("FAILURE!!");
        });

      await this.$store.dispatch("folderData/refreshFolderData");
      this.$refs.fileUpload.close();
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async createFolder() {
      const { message } = await this.$axios.$post(
        `/files/mkdir/${this.folderName}/`,
        {
          customPath: `/${this.currentFolderPath}/`
        }
      );
      await this.$store.dispatch("folderData/refreshFolderData");
      this.$refs.createFolder.close();
      console.log(message);
    }
  }
};
</script>

<style lang="postcss" scoped>
.fab-button {
  transition: 0.7s;
  position: fixed;
  bottom: 30px;
  right: 30px;
}
.fab-trigger {
  transition: 0.3s;
}
.fab-trigger.toggled {
  transform: rotate(135deg);
}
.fab-buttons {
  position: fixed;
  bottom: 30px;
  right: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

button[disabled] {
  opacity: 0.5;
}
</style>