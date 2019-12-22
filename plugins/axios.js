export default function ({ $axios, app, store}) {
    $axios.onRequest(config => {
      if(process.client){
        config.headers.common['Authorization'] = localStorage.getItem('frive-token');
        // console.log('AXIOS, new request', config.headers.common['Authorization']);
      }

    });
  }