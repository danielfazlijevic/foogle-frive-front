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
      <File
        v-for="file in files"
        :key="file"
        :file="file"
        @click.right.native.prevent="$refs.menu.open($event, { file: file })"
        @click.native="handleClick(file)"
      />
    </div>

    <FABButton v-if="!isShared && (user.accountType === 'premium' || files.length < 5)" />

    <!-- {{ files }} -->
    <sweet-modal ref="modal">
      <sweet-modal-tab title="Preview" id="preview" v-html="getPreview(contentToShow)"></sweet-modal-tab>
      <sweet-modal-tab :disabled="fileType === 'txt'" title="Base64" id="base64">{{ contentToShow }}</sweet-modal-tab>
    </sweet-modal>
    <client-only>
      <vue-context ref="menu">
        <template slot-scope="child">
          <li>
            <a href="#" @click.prevent="handleClick(child.data.file)">Open</a>
          </li>
          <li v-if="user.accountType === 'premium'">
            <a href="#" @click.prevent="rename(child.data.file)">Rename</a>
          </li>
          <li v-if="user.accountType === 'premium'">
            <a href="#" @click.prevent="move(child.data.file)">Move</a>
          </li>
          <li v-if="user.accountType === 'premium'">
            <a href="#" @click.prevent="deleteFolder(child.data.file)">Delete</a>
          </li>
        </template>
      </vue-context>
    </client-only>
  </div>
</template>

<script>
import { VueContext } from "vue-context";
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
    FABButton,
    VueContext
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
      files: "folderData/getFiles",
      user: "user/getUser"
    }),
    prefix() {
      return this.isShared ? "/shared" : "";
    },
    canGoBack() {
      return (
        this.currentFolderPath.includes("/") &&
        this.currentFolderPath.lastIndexOf("/") !== 0
      );
    }
  },

  methods: {
    async handleClick(fileName) {
      console.log("filename", fileName);
      try {
        if (!fileName.includes(".")) {
          const sharedLinkId = this.$route.params.id;
          const path = sharedLinkId
            ? this.currentFolderPath + "/" + fileName
            : "/" + fileName;
          console.log("requesting path:", path);
          await this.$store.dispatch("folderData/setFolderData", {
            fileName: path,
            sharedLinkId
          });
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
    async rename(fileName) {
      try {
        const filePath = this.currentFolderPath + "/" + fileName;
        const newName = window.prompt("Rename file to:");
        console.log("renaming", filePath, "to new name", newName);
        await this.$axios.$patch("files/rename", {
          currentPath: filePath,
          wantedName: newName
        });
        await this.$store.dispatch("folderData/refreshFolderData");
      } catch (err) {
        alert("Error while trying to rename the file.");
      }
    },
    async deleteFolder(folderName) {
      try {
        if (folderName.includes("."))
          return alert("You can only delete empty folders!");

        await this.$axios.$delete("/files/folder", {
          data: {
            folderPath: this.currentFolderPath + "/" + folderName
          }
        });
        await this.$store.dispatch("folderData/refreshFolderData");
      } catch (err) {
        alert("Error while trying to delete the folder.");
      }
    },
    async move(fileName) {
      try {
        const filePath = this.currentFolderPath + "/" + fileName;
        const desiredPath = prompt("Enter the desired path", filePath);
        await this.$axios.$patch("files/move", {
          currentPath: filePath,
          desiredPath
        });
        if (filePath !== desiredPath)
          await this.$store.dispatch("folderData/refreshFolderData");
      } catch (err) {
        console.log(err);
        alert("We encountered an error while moving.");
      }
    },
    async goBack() {
      console.log("currentFolderPath", this.currentFolderPath);
      const substrIndexFirst = this.isShared
        ? this.currentFolderPath.indexOf("/") + 1
        : 0;
      const currentFolderPath = this.currentFolderPath.substr(
        0,
        this.currentFolderPath.lastIndexOf("/")
      );
      console.log("folder path: ", currentFolderPath);
      console.log("parent", currentFolderPath);
      const API_URL = this.isShared
        ? `/shared/list/${this.$route.params.id}`
        : "files/list";
      const { files, path } = await this.$axios.$get(API_URL, {
        params: { path: currentFolderPath }
      });
      this.$store.commit("folderData/SET_FILES", files);
      this.$store.commit("folderData/SET_FOLDER_PATH", path);
    }
  }
};
</script>

<style scoped>
@import "../node_modules/vue-context/dist/css/vue-context.css";
</style>