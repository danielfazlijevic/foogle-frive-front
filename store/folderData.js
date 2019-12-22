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
    const newPath = folderPath.replace(/\/{2,}/g, "/");   
    state.currentFolder.path = newPath;
  }
};

export const actions = {
  setFolderData({
    commit,
    state
  }, {
    fileName,
    sharedLinkId
  }) {
    console.log('filename', fileName);
    console.log('sharedLinkId', sharedLinkId);
    const API_URL = sharedLinkId ? `/shared/list/${sharedLinkId}` : `/files/list`;
    const path = sharedLinkId ? "/" + fileName : state.currentFolder.path  + fileName;
    this.$axios.get(API_URL, {
      params: {
        path
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
