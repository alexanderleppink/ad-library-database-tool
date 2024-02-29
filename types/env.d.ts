declare global {
  namespace NodeJS {
    interface ProcessEnv {
      META_USER_ACCESS_TOKEN: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NX_DAEMON: string;
      TURBO_REMOTE_ONLY: string;
      TURBO_RUN_SUMMARY: string;
      VERCEL: string;
      VERCEL_ENV: string;
      VERCEL_GIT_COMMIT_AUTHOR_LOGIN: string;
      VERCEL_GIT_COMMIT_AUTHOR_NAME: string;
      VERCEL_GIT_COMMIT_MESSAGE: string;
      VERCEL_GIT_COMMIT_REF: string;
      VERCEL_GIT_COMMIT_SHA: string;
      VERCEL_GIT_PREVIOUS_SHA: string;
      VERCEL_GIT_PROVIDER: string;
      VERCEL_GIT_PULL_REQUEST_ID: string;
      VERCEL_GIT_REPO_ID: string;
      VERCEL_GIT_REPO_OWNER: string;
      VERCEL_GIT_REPO_SLUG: string;
      VERCEL_URL: string;
    }
  }
}

export {}
