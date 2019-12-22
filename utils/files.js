const imageExtensions = ['jpg', 'png', 'jpeg'];

export const isImage = (fileName) => imageExtensions.includes(fileName.split('.').pop());



