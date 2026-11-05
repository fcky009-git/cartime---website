declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    CARTIME_ADMIN_PASSWORD_HASH?: string;
    CARTIME_ADMIN_SESSION_SECRET?: string;
    CARTIME_TELEGRAM_BOT_TOKEN?: string;
    CARTIME_TELEGRAM_CHAT_ID?: string;
  }
}
