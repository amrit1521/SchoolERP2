/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVERURL: string
 
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
