const crypto = require("crypto");

/** In-memory staff session tokens (desk laptop; cleared on restart). */
const tokens = new Map();
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const pinAttempts = new Map();
const MAX_PIN_ATTEMPTS = 8;
const PIN_WINDOW_MS = 15 * 60 * 1000;

function getExpectedPin() {
  return String(process.env.STAFF_PIN || "").trim();
}

function pruneTokens() {
  const now = Date.now();
  for (const [token, exp] of tokens.entries()) {
    if (exp <= now) tokens.delete(token);
  }
}

function issueToken() {
  pruneTokens();
  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, Date.now() + TOKEN_TTL_MS);
  return token;
}

function extractToken(req) {
  const header = String(req.get("X-Staff-Token") || "").trim();
  if (header) return header;
  const auth = String(req.get("Authorization") || "");
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return String(req.query.staffToken || "").trim();
}

function isValidToken(token) {
  if (!token) return false;
  pruneTokens();
  const exp = tokens.get(token);
  if (!exp) return false;
  if (exp <= Date.now()) {
    tokens.delete(token);
    return false;
  }
  return true;
}

function clientKey(req) {
  return String(req.ip || req.socket?.remoteAddress || "local");
}

function verifyPin(pin, req) {
  const expected = getExpectedPin();
  if (!expected) {
    return {
      ok: true,
      token: issueToken(),
      warning: "STAFF_PIN is not set — set a strong PIN in .env for franchise PII protection",
      defaultPinWarning: false,
    };
  }

  const key = clientKey(req);
  const attempt = pinAttempts.get(key) || { count: 0, start: Date.now() };
  if (Date.now() - attempt.start > PIN_WINDOW_MS) {
    attempt.count = 0;
    attempt.start = Date.now();
  }
  if (attempt.count >= MAX_PIN_ATTEMPTS) {
    pinAttempts.set(key, attempt);
    return { ok: false, error: "Too many PIN attempts — try again in 15 minutes", status: 429 };
  }

  const a = Buffer.from(String(pin || ""));
  const b = Buffer.from(expected);
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!match) {
    attempt.count += 1;
    pinAttempts.set(key, attempt);
    return { ok: false, error: "Incorrect PIN", status: 401 };
  }

  pinAttempts.delete(key);
  return {
    ok: true,
    token: issueToken(),
    defaultPinWarning: expected === "1234",
  };
}

function requireStaff(req, res, next) {
  const expected = getExpectedPin();
  if (!expected) {
    // Dev / first-run: allow, but clients should still send a token after verify-pin
    return next();
  }
  if (isValidToken(extractToken(req))) {
    return next();
  }
  return res.status(401).json({
    error: "Staff PIN required",
    code: "auth_required",
  });
}

function staffPinConfigured() {
  return Boolean(getExpectedPin());
}

function usingDefaultPin() {
  return getExpectedPin() === "1234";
}

module.exports = {
  requireStaff,
  verifyPin,
  issueToken,
  staffPinConfigured,
  usingDefaultPin,
  getExpectedPin,
};
