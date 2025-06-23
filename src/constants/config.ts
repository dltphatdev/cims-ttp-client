const CONFIG = {
  // SERVER_URL: 'http://localhost:8080/',
  // API_ENPOINT: 'http://localhost:8080/api/',
  SERVER_URL: 'http://10.0.0.189:8080/',
  API_ENPOINT: 'http://10.0.0.189:8080/api/',
  ENPOINT_TIMEOUT: 10000,
  MAX_FILE_SIZE_UPLOAD: 1048576,
  MAX_FILE_ATTACHMENT: 15728640,
  ACCEPT_FILE_UPLOAD: '.jpg,.jpeg,.png',
  UPLOAD_IMAGE: 'uploads/image'
} as const

export default CONFIG
