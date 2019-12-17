import axios from 'axios';

export const state = () => ({
  currentFolder: {
    files: null,
    path: null
  }
});

export const mutations = {
  SET_FOLDER(state, folderData) {
    state.currentFolder = folderData;
  },
  SET_FILES(state, files) {
    state.currentFolder.files = files;
  },
  SET_FOLDER_PATH(state, folderPath) {
    state.currentFolder.path = folderPath;
  }
};

export const actions = {
  setFolderData({
    commit,
    state
  }, {
    fileName
  }) {
    console.log('filename', fileName);
    const {
      files,
      path
    } = this.$axios.get("/files/list", {
      params: {
        path: state.currentFolder.path + "/" + fileName
      }
    }).then(response => {
      console.log('response', response);
      commit('SET_FILES', response.data.files);
      commit('SET_FOLDER_PATH', response.data.path);

    });


  },
  refreshFolderData({
    commit,
    state
  }) {
    this.$axios.get("/files/list", {
      params: {
        path: state.currentFolder.path
      }
    }).then(response => {
      console.log('response', response);
      commit('SET_FILES', response.data.files);
      commit('SET_FOLDER_PATH', response.data.path);

    });
  }

};

export const getters = {
  getFolderData(state) {
    return state.currentFolder;
  },
  getFolderPath(state) {
    return state.currentFolder.path;
  },
  getFiles(state) {
    return state.currentFolder.files;
  }
};
