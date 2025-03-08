import * as Minio from 'minio'

export const minioClient = new Minio.Client({
    endPoint: process.env.STORAGE_ENDPOINT,
    port: process.env.STORAGE_PORT,
    useSSL: false,
    accessKey: process.env.STORAGE_ACCESS_KEY_ID,
    secretKey: process.env.STORAGE_SECRET_ACCESS_KEY

})