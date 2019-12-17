<template>
  <div
    class="file flex justify-center flex-col text-center bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-pointer"
  >
    <v-icon :name="getFileIcon()" />
    {{ file }}
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: String
    }
  },
  methods: {
    getFileIcon() {
      if (this.file.endsWith(".txt")) return "file-text";
      if (
        this.file.endsWith(".jpg") ||
        this.file.endsWith(".jpeg") ||
        this.file.endsWith(".png")
      )
        return "image";
      return "folder";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>