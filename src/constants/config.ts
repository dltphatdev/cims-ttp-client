const CONFIG = {
  SERVER_URL: 'http://localhost:8080/',
  API_ENPOINT: 'http://localhost:8080/api/',
  ENPOINT_TIMEOUT: 10000,
  MAX_FILE_SIZE_UPLOAD: 1048576,
  ACCEPT_FILE_UPLOAD: '.jpg,.jpeg,.png',
  UPLOAD_IMAGE: 'uploads/image'
} as const

export default CONFIG
