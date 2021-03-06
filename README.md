# Google Drive-like web app

 [Click here for the back-end code (NodeJS+Express+JWT+Sequelize+PostreSQL)](https://github.com/danielfazlijevic/foogle-frive-server)

A web application built with Vue, Nuxt & Tailwind which has some features like Google Drive: 
 
- User Login & Registration
- File Uploading
- Folder Making
- Drive Sharing (specific users/shareable link for guests)
- File preview (image preview/base64)
- Additional file management
    - Deleting
    - Renaming
    - Moving
 - etc. 


## Screenshots

![login](/screenshots/login.png "Login Screen")
![files](/screenshots/files.png "Files Screen")
![nested_folders](/screenshots/nested_folders.png "Files Screen")
![context](/screenshots/context.jpg "Context Menu(right click)")
![preview](/screenshots/preview1.jpg "Image Preview")
![share1](/screenshots/share1.jpg "Share To Users")
![share2](/screenshots/share2.jpg "Get Shareable Link For Guests")



_NOTE: This project was done in a short time period and could use some refactoring._

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
