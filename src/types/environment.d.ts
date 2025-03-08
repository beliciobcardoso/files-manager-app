declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_USER: string
        DB_PASSWORD: string
        DB_PORT: string
        DATABASE_URL: string
        STORAGE_ENDPOINT: string
        STORAGE_PORT: number
        STORAGE_BUCKET: string
        STORAGE_REGION: string
        STORAGE_PATH: string
        STORAGE_ACCESS_KEY_ID: string
        STORAGE_SECRET_ACCESS_KEY: string
        NEXTAUTH_SECRET: string
        NEXT_PUBLIC_URL_APP: string
        VERIFICATION_URL: string
        AUTH_RESEND_KEY: string
        RESEND_EMAIL_FROM: string
        VERIFICATION_SUBJECT: string
        AUTH_LOGIN_REDIRECT: string
        OTP_SUBJECT: string
        RESET_PASSWORD_URL: string
        RESET_PASSWORD_SUBJECT: string
      }
    }
  }
  export type {}
  