<template>
  <nav class="flex items-center justify-between flex-wrap bg-blue-500 p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <span class="font-semibold text-xl tracking-tight">FGL FRIVE</span>
    </div>
    <div class="block lg:hidden">
      <button
        class="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <a
          href="#responsive-header"
          class="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
        >My Files</a>
        <a
          href="#responsive-header"
          class="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
        >Shared Folders</a>
      </div>
      <div class="text-white">
        {{ user.username }}
        <span
          class="bg-blue-200 font-semibold text-blue-900 rounded-lg py-1 tracking-wide uppercase px-2 text-sm"
        >{{ user.accountType }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })
  },
  async mounted() {
    try {
      const user = await this.$axios.$get("/auth/current");
      if (user) {
        this.$store.commit("user/SET_USER", { ...user });
        console.log("USER FOUND", user);
        this.$router.push("/");
      }
    } catch (err) {
      console.warn(err);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>