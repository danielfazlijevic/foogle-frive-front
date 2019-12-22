<template>
  <div class="login">
    <form
      class="bg-white md:w-1/3 shadow-md rounded px-8 pt-6 pb-8 mb-4"
      @submit.prevent="handleForm"
    >
      <h2 class="text-2xl font-bold tracking-widest mb-1">Register</h2>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          v-model="username"
          placeholder="Username"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input
          class="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          v-model="password"
          type="password"
          placeholder="******************"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >Register</button>
      </div>
    </form>
    <sweet-modal icon="error" ref="errorModal">
      <p class="font-semibold">Error while creating user.</p>
      <p>A user with a same username might already exist.</p>
    </sweet-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "daniel",
      password: "test123"
    };
  },
  methods: {
    async handleForm() {
      try {
        console.log("form handling");
        const data = {
          username: this.username,
          password: this.password
        };

        const response = await this.$axios.$post("/auth/signup", data);

        console.log("response", response);

        const token = "Bearer " + response.token;
        
        this.$axios.setHeader("Authorization", token);
        localStorage.setItem("frive-token", token);

        const user = await this.$axios.$get("/auth/current");
        console.log("user", user);

        if (user) {
          this.$store.commit("user/SET_USER", { ...user, token });
          this.$router.push("/");
        }

        // console.log("response", response);
        // this.$axios.setHeader("Authorization", response.token);

        // const user = await this.$axios.$get("/auth/current");

        // console.log(user);
      } catch (e) {
        this.$refs.errorModal.open();
        console.log("error!", e);
      }
    }
  }
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("https://source.unsplash.com/random/1920x1080");
  height: 100vh;
  background-size: cover;
}
</style>