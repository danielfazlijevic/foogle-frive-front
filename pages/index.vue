<template>
  <div class="container px-4">
    <h2 class="text-3xl font-semibold mb-2">Your Files</h2>
    <button
      class="flex justify-between items-center bg-indigo-600 uppercase tracking-wide text-white px-2 py-2 rounded-lg"
      @click="openSharePanel"
    >
      Share
      <v-icon class="ml-2 h-5 w-5" name="share-2" />
    </button>
    <Files v-if="!loading" />
    <div v-else>Loading...</div>

    <sweet-modal ref="share">
      <sweet-modal-tab title="Share to user" id="user">
        <p class="text-gray-600 mb-2">Type the username of member you want to share your drive with.</p>
        <div class="flex justify-between items center">
          <input
            class="shadow appearance-none border rounded mr-3 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            v-model="shareToUsername"
            type="text"
            placeholder="Username"
          />
          <button
            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            :disabled="shareToUsername.length === 0"
            v-on:click="shareDriveToUsername()"
          >Share</button>
        </div>
      </sweet-modal-tab>
      <sweet-modal-tab title="Get shareable link" id="link">
        <div class="flex items-center justify-between">
          <p class="text-gray-800">Get a shareable link so anyone can view your drive.</p>
          <button
            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            v-on:click="createShareLink"
            :disabled="creatingLink"
          >Create</button>
        </div>
        <p class="font-mono mt-2" v-if="link">
          <input readonly type="text" class="w-full bg-gray-100 px-2 py-1" :value="link" />
        </p>
      </sweet-modal-tab>
    </sweet-modal>
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
      shareToUsername: "",
      users: [],
      creatingLink: false,
      link: ""
    };
  },
  methods: {
    async openSharePanel() {
      this.users = await this.$axios.$get("/users");

      // this.users = users.map(user => user.username);
      // console.log(this.users, typeof this.users);
      this.$refs.share.open();
    },
    async createShareLink() {
      this.creatingLink = true;
      const link = await this.$axios.$put("/shared/create");
      if (link) this.link = window.location.host + "/shared/" + link.id;
      this.creatingLink = false;
    },
    async shareDriveToUsername() {
      try {
        const shared = await this.$axios.$put(
          `/shared/create/${this.shareToUsername}`
        );
        alert("Drive shared to user " + this.shareToUsername);
        this.shareToUsername = "";
      } catch (err) {
        alert("Error while trying to share your drive. Check the username.");
      }
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
