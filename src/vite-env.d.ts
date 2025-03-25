/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly Vite_SITEKEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}