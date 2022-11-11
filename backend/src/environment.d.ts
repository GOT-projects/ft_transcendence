declare global {
    namespace NodeJS {
        interface ProcessEnv {
            POSTGRES_USER: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_DB: string;
            PORT: string;
            API_UID: string;
            API_SECRET: string;
        }
    }
}