/* Shared helpers for Kumon NDG – Check-In / Check-Out pages */

const Kumon = (() => {
  const PIN_KEY = "kumon_staff_unlocked";
  const TOKEN_KEY = "kumon_staff_token";

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function getStaffToken() {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  }

  function setStaffToken(token) {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }

  async function api(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    const token = getStaffToken();
    if (token) headers["X-Staff-Token"] = token;

    const res = await fetch(path, {
      ...options,
      headers,
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: text || "Invalid response" };
    }
    if (!res.ok) {
      if (res.status === 401 && data?.code === "auth_required") {
        setUnlocked(false);
        setStaffToken("");
      }
      const err = new Error((data && data.error) || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async function downloadWithAuth(url, filename) {
    const headers = {};
    const token = getStaffToken();
    if (token) headers["X-Staff-Token"] = token;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      let msg = `Download failed (${res.status})`;
      try {
        const data = await res.json();
        if (data?.error) msg = data.error;
      } catch {
        /* ignore */
      }
      throw new Error(msg);
    }
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  function toast(message) {
    let stack = $(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function formatDuration(checkedInAt) {
    if (!checkedInAt) return "00:00";
    const start = new Date(checkedInAt.replace(" ", "T"));
    const ms = Math.max(0, Date.now() - start.getTime());
    const totalSec = Math.floor(ms / 1000);
    const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function playTone(kind) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (kind === "in") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (kind === "out") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.34);
      } else {
        osc.type = "square";
        osc.frequency.setValueAtTime(180, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.24);
      }
      setTimeout(() => ctx.close().catch(() => {}), 500);
    } catch {
      /* audio optional */
    }
  }

  function isUnlocked() {
    return sessionStorage.getItem(PIN_KEY) === "1" && Boolean(getStaffToken());
  }

  function setUnlocked(ok) {
    if (ok) sessionStorage.setItem(PIN_KEY, "1");
    else sessionStorage.removeItem(PIN_KEY);
  }

  async function requireStaffPin({ gateId = "pin-gate", contentId = "staff-content" } = {}) {
    const gate = document.getElementById(gateId);
    const content = document.getElementById(contentId);
    if (!gate || !content) return true;

    if (isUnlocked()) {
      gate.hidden = true;
      content.hidden = false;
      return true;
    }

    gate.hidden = false;
    content.hidden = true;

    return new Promise((resolve) => {
      const form = gate.querySelector("form");
      const input = gate.querySelector('input[name="pin"]');
      const err = gate.querySelector(".pin-error");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        err.textContent = "";
        try {
          const data = await api("/api/settings/verify-pin", {
            method: "POST",
            body: JSON.stringify({ pin: input.value }),
          });
          setStaffToken(data.token || "");
          setUnlocked(true);
          if (data.defaultPinWarning) {
            toast("Change STAFF_PIN from 1234 in .env for better security");
          }
          gate.hidden = true;
          content.hidden = false;
          resolve(true);
        } catch (ex) {
          err.textContent = ex.message || "Incorrect PIN";
          playTone("error");
          input.select();
        }
      });
    });
  }

  function subjectTags(subjects) {
    return (subjects || [])
      .map((s) => `<span class="tag">${escapeHtml(s)}</span>`)
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Global HID barcode/RFID capture: when focus is not in another text field,
   * buffer rapid keystrokes ending in Enter.
   */
  function attachGlobalScanner(onScan) {
    let buffer = "";
    let lastKeyAt = 0;
    const RESET_MS = 120;

    window.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) || "";
      const isTypingField =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable;
      if (isTypingField) {
        if (e.target.dataset && e.target.dataset.scanInput === "1") return;
        buffer = "";
        return;
      }

      const now = Date.now();
      if (now - lastKeyAt > RESET_MS) buffer = "";

      if (e.key === "Enter") {
        if (buffer.length >= 2) {
          e.preventDefault();
          const code = buffer.trim();
          buffer = "";
          lastKeyAt = now;
          onScan(code);
        }
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buffer += e.key;
        lastKeyAt = now;
      }
    });
  }

  function markActiveNav() {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    $all(".nav a").forEach((a) => {
      const href = a.getAttribute("href");
      const normalized = href === "/" || href === "/index.html" ? "/" : href;
      const current = path === "" || path === "/index.html" ? "/" : path;
      if (normalized === current || (normalized !== "/" && current.endsWith(normalized))) {
        a.classList.add("active");
      }
    });
  }

  markActiveNav();

  return {
    $,
    $all,
    api,
    downloadWithAuth,
    toast,
    formatDuration,
    playTone,
    requireStaffPin,
    subjectTags,
    escapeHtml,
    attachGlobalScanner,
    isUnlocked,
    setUnlocked,
    getStaffToken,
  };
})();
