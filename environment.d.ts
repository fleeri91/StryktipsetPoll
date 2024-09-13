declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      API_TOKEN: string;
    }
  }
}

export {};
