declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    CARTIME_ADMIN_USER_ID?: string;
    CARTIME_ADMIN_EMAIL?: string;
    CARTIME_ADMIN_PASSWORD_HASH?: string;
    CARTIME_ADMIN_SESSION_SECRET?: string;
  }
}
