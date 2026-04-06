import { useEffect, useRef, useState } from "react";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const HOLD_MUSIC_SRC = "./cap_touch/hold_music.mp3";
const PLEASE_WAIT_SRC = "./cap_touch/hold_message.mp3"; // plays before hold music
const HANG_UP_SRC = "./cap_touch/hang_up.mp3";
const DIAL_TONE_SRC = "./cap_touch/dial_tone.mp3";

// One MP3 per key, 1–7. Use any piano sample pack — name them however you like.
const PIANO_SAMPLES = {
  1: "./cap_touch/C_piano.mp3",
  2: "./cap_touch/D_piano.mp3",
  3: "./cap_touch/E_piano.mp3",
  4: "./cap_touch/F_piano.mp3",
  5: "./cap_touch/G_piano.mp3",
  6: "./cap_touch/A_piano.mp3",
  7: "./cap_touch/B_piano.mp3",
};

const UNLOCK_SEQUENCE = ["2", "7", "6", "1", "6", "6", "1", "2", "3", "2"];
const HOLD_DURATION_MS = 30000; // auto-reset after 30s of hold music
const PRE_RING_PAUSE_MS = 1200; // pause after sequence before ringing starts
const RING_DURATION_MS = 7000; // total ringing duration (longer)
const RING_BURST_MS = 0.9; // each burst length in seconds (longer)
const RING_GAP_MS = 0.3; // gap between the two bursts in a pair
const RING_SILENCE_MS = 2.0; // silence between ring pairs
const CHORD_WINDOW_MS = 120; // keys within this window count as simultaneous
// ─────────────────────────────────────────────────────────────────────────────

const PIANO_NOTE_NAMES = {
  1: "C4",
  2: "D4",
  3: "E4",
  4: "F4",
  5: "G4",
  6: "A4",
  7: "B4",
};
const DTMF = {
  1: { row: 697, col: 1209 },
  2: { row: 697, col: 1336 },
  3: { row: 697, col: 1477 },
  4: { row: 770, col: 1209 },
  5: { row: 770, col: 1336 },
  6: { row: 770, col: 1477 },
  7: { row: 852, col: 1209 },
};

const DEBOUNCE_MS = 150;
const TONE_DURATION = 0.5;

const SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const CHAR_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214";

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  [null, "7", null],
];
const PINS = { 1: "T2", 2: "T3", 3: "T4", 4: "T5", 5: "T9", 6: "T8", 7: "T7" };

export default function TouchSynth() {
  const [connected, setConnected] = useState(false);
  const [lastTrigger, setLastTrigger] = useState(null);
  const [displayDigits, setDisplayDigits] = useState([]);
  const [mode, setMode] = useState("dial");

  const audioCtxRef = useRef(null);
  const lastFiredRef = useRef({});
  const characteristicRef = useRef(null);
  const deviceRef = useRef(null);
  const tapHistoryRef = useRef([]);
  const ringTimerRef = useRef(null);
  const holdTimerRef = useRef(null);
  const preRingTimerRef = useRef(null);
  const ringNodesRef = useRef([]);
  const holdSourceRef = useRef(null);
  const holdBufferRef = useRef(null);
  const pleaseWaitSrcRef = useRef(null);
  const pleaseWaitBufRef = useRef(null);
  const hangUpSrcRef = useRef(null);
  const hangUpBufRef = useRef(null);
  const dialToneBufRef = useRef(null);
  const dialToneSrcRef = useRef(null);
  const pianoBuffersRef = useRef({}); // label → AudioBuffer
  const modeRef = useRef("dial");
  const recentFiresRef = useRef({}); // label → timestamp, for chord detection

  useEffect(
    () => () => {
      audioCtxRef.current?.close();
      clearTimeout(ringTimerRef.current);
      clearTimeout(holdTimerRef.current);
      clearTimeout(preRingTimerRef.current);
    },
    [],
  );

  function setModeBoth(m) {
    modeRef.current = m;
    setMode(m);
  }

  function getCtx() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed")
      audioCtxRef.current = new AudioContext();
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  // ── Preload all samples in the background once ctx exists ─────────────────
  async function preloadSamples(ctx) {
    const load = async (url, cacheRef, key) => {
      try {
        const resp = await fetch(url);
        const arr = await resp.arrayBuffer();
        const buf = await ctx.decodeAudioData(arr);
        if (key !== undefined) cacheRef.current[key] = buf;
        else cacheRef.current = buf;
      } catch (e) {
        console.warn("Could not preload:", url, e);
      }
    };

    await Promise.all([
      load(PLEASE_WAIT_SRC, pleaseWaitBufRef, undefined),
      load(HOLD_MUSIC_SRC, holdBufferRef, undefined),
      load(DIAL_TONE_SRC, dialToneBufRef, undefined),
      load(HANG_UP_SRC, hangUpBufRef, undefined),
      ...Object.entries(PIANO_SAMPLES).map(([key, url]) =>
        load(url, pianoBuffersRef, key),
      ),
    ]);
  }

  // ── DTMF ──────────────────────────────────────────────────────────────────
  function playDTMF(label) {
    const dtmf = DTMF[label];
    if (!dtmf) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    const end = now + TONE_DURATION;

    const oscRow = ctx.createOscillator();
    const oscCol = ctx.createOscillator();
    oscRow.type = oscCol.type = "sine";
    oscRow.frequency.value = dtmf.row;
    oscCol.frequency.value = dtmf.col;

    const merge = ctx.createGain();
    merge.gain.value = 0.25;
    oscRow.connect(merge);
    oscCol.connect(merge);

    const lpf1 = ctx.createBiquadFilter();
    lpf1.type = "lowpass";
    lpf1.frequency.value = 1200;
    lpf1.Q.value = 1.8;
    merge.connect(lpf1);
    const lpf2 = ctx.createBiquadFilter();
    lpf2.type = "lowpass";
    lpf2.frequency.value = 1000;
    lpf2.Q.value = 0.7;
    lpf1.connect(lpf2);
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 300;
    hpf.Q.value = 0.5;
    lpf2.connect(hpf);

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 6;
    comp.attack.value = 0.008;
    comp.release.value = 0.1;
    hpf.connect(comp);

    const gate = ctx.createGain();
    gate.gain.setValueAtTime(0, now);
    gate.gain.linearRampToValueAtTime(0.9, now + 0.01);
    gate.gain.setValueAtTime(0.9, end - 0.02);
    gate.gain.linearRampToValueAtTime(0, end);
    comp.connect(gate);
    gate.connect(ctx.destination);

    oscRow.start(now);
    oscCol.start(now);
    oscRow.stop(end + 0.05);
    oscCol.stop(end + 0.05);
  }

  // ── Piano sample playback ─────────────────────────────────────────────────
  function playPiano(label) {
    const ctx = getCtx();
    const buf = pianoBuffersRef.current[label];

    if (!buf) {
      playSynthFallback(label, ctx);
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buf;

    const env = ctx.createGain();
    const now = ctx.currentTime;
    const dur = buf.duration;
    env.gain.setValueAtTime(3, now);
    env.gain.setValueAtTime(3, now + Math.max(0, dur - 0.06));
    env.gain.linearRampToValueAtTime(0, now + dur);

    source.connect(env);
    env.connect(ctx.destination);
    source.start(now);
  }

  function playSynthFallback(label, ctx) {
    const freq = {
      1: 261.63,
      2: 293.66,
      3: 329.63,
      4: 349.23,
      5: 392,
      6: 440,
      7: 493.88,
    }[label];
    if (!freq) return;
    const now = ctx.currentTime;
    const decay = 1.8;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.35, now + 0.006);
    env.gain.exponentialRampToValueAtTime(0.001, now + decay);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3000;
    lp.Q.value = 0.5;
    osc.connect(env);
    env.connect(lp);
    lp.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + decay + 0.05);
  }

  // ── Ring ──────────────────────────────────────────────────────────────────
  function startRinging() {
    const ctx = getCtx();
    ringNodesRef.current = [];
    let t = ctx.currentTime;
    const ringEnd = t + RING_DURATION_MS / 1000;
    const cycleLen = RING_BURST_MS * 2 + RING_GAP_MS + RING_SILENCE_MS;

    while (t < ringEnd) {
      for (let burst = 0; burst < 2; burst++) {
        const start = t + burst * (RING_BURST_MS + RING_GAP_MS);
        const end = start + RING_BURST_MS;
        if (start >= ringEnd) break;

        [400, 450].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq;
          const gain = ctx.createGain();
          const clampedEnd = Math.min(end, ringEnd);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.28, start + 0.02);
          gain.gain.setValueAtTime(0.28, clampedEnd - 0.03);
          gain.gain.linearRampToValueAtTime(0, clampedEnd);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(clampedEnd + 0.05);
          ringNodesRef.current.push(osc);
        });
      }
      t += cycleLen;
    }
  }

  function stopRinging() {
    ringNodesRef.current.forEach((n) => {
      try {
        n.stop();
      } catch (_) {}
    });
    ringNodesRef.current = [];
  }

  // ── Please-wait announcement ──────────────────────────────────────────────
  function playPleaseWait(ctx) {
    return new Promise((resolve) => {
      const buf = pleaseWaitBufRef.current;
      if (!buf) {
        resolve();
        return;
      }
      const source = ctx.createBufferSource();
      source.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = 0.85;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.onended = resolve;
      pleaseWaitSrcRef.current = source;
      source.start(0);
    });
  }

  // ── Dial tone played after hang-up ────────────────────────────────────────
  function playDialTone(ctx) {
    return new Promise((resolve) => {
      const buf = dialToneBufRef.current;
      if (!buf) {
        resolve();
        return;
      }
      const source = ctx.createBufferSource();
      source.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = 0.85;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.onended = resolve;
      dialToneSrcRef.current = source;
      source.start(0);
    });
  }

  // ── Hang-up sound ─────────────────────────────────────────────────────────
  function playHangUp(ctx) {
    return new Promise((resolve) => {
      const buf = hangUpBufRef.current;
      if (!buf) {
        resolve();
        return;
      }
      const source = ctx.createBufferSource();
      source.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = 0.85;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.onended = resolve;
      hangUpSrcRef.current = source;
      source.start(0);
    });
  }

  // ── Hold music ────────────────────────────────────────────────────────────
  function startHoldMusic(ctx) {
    const buf = holdBufferRef.current;
    if (!buf) return;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;
    const muffle1 = ctx.createBiquadFilter();
    muffle1.type = "lowpass";
    muffle1.frequency.value = 1800;
    muffle1.Q.value = 0.6;
    const muffle2 = ctx.createBiquadFilter();
    muffle2.type = "lowpass";
    muffle2.frequency.value = 2400;
    muffle2.Q.value = 0.4;
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.1;
    source.connect(muffle2);
    muffle2.connect(muffle1);
    muffle1.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);
    holdSourceRef.current = source;
  }

  function stopHoldMusic() {
    try {
      holdSourceRef.current?.stop();
    } catch (_) {}
    holdSourceRef.current = null;
  }

  function stopPleaseWait() {
    try {
      pleaseWaitSrcRef.current?.stop();
    } catch (_) {}
    pleaseWaitSrcRef.current = null;
  }

  function stopHangUp() {
    try {
      hangUpSrcRef.current?.stop();
    } catch (_) {}
    hangUpSrcRef.current = null;
  }

  function stopDialTone() {
    try {
      dialToneSrcRef.current?.stop();
    } catch (_) {}
    dialToneSrcRef.current = null;
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  async function resetToDial(hang_up = true) {
    clearTimeout(preRingTimerRef.current);
    clearTimeout(ringTimerRef.current);
    clearTimeout(holdTimerRef.current);
    stopRinging();
    stopHoldMusic();
    stopPleaseWait();
    if (hang_up) {
      setModeBoth("paused");
      await playHangUp(getCtx());
      await playDialTone(getCtx());
    }
    stopHangUp();
    stopDialTone();
    tapHistoryRef.current = [];
    recentFiresRef.current = {};
    setDisplayDigits([]);
    setLastTrigger(null);
    setModeBoth("dial");
  }

  // ── Sequence → ring → please wait → hold music ───────────────────────────
  function checkSequence(history) {
    if (history.length < UNLOCK_SEQUENCE.length) return false;
    return history
      .slice(-UNLOCK_SEQUENCE.length)
      .every((v, i) => v === UNLOCK_SEQUENCE[i]);
  }

  async function triggerUnlock() {
    setModeBoth("paused");
    await new Promise((r) => {
      preRingTimerRef.current = setTimeout(r, PRE_RING_PAUSE_MS);
    });

    setModeBoth("ringing");
    setDisplayDigits([]);
    startRinging();
    await new Promise((r) => {
      ringTimerRef.current = setTimeout(r, RING_DURATION_MS);
    });

    stopRinging();
    setModeBoth("waiting");
    const ctx = getCtx();
    await playPleaseWait(ctx);

    startHoldMusic(ctx);
    setModeBoth("hold");
  }

  // ── Main trigger ──────────────────────────────────────────────────────────
  function handleTrigger(label) {
    const now = Date.now();
    if (now - (lastFiredRef.current[label] ?? 0) < DEBOUNCE_MS) return;
    lastFiredRef.current[label] = now;
    setLastTrigger(label);

    const currentMode = modeRef.current;

    // ── Chord: keys 1+2 simultaneously → hang up (only in hold mode) ────────
    if (currentMode === "hold") {
      recentFiresRef.current[label] = now;
      const t1 = recentFiresRef.current["4"] ?? 0;
      const t2 = recentFiresRef.current["7"] ?? 0;
      if (t1 > 0 && t2 > 0 && Math.abs(t1 - t2) <= CHORD_WINDOW_MS) {
        recentFiresRef.current = {};
        resetToDial(true);
        return;
      }
      playPiano(label);
      setDisplayDigits((prev) => [...prev.slice(-7), label]);
      return;
    }

    if (
      currentMode === "ringing" ||
      currentMode === "paused" ||
      currentMode === "waiting"
    )
      return;

    // Dial mode
    playDTMF(label);
    setDisplayDigits((prev) => [...prev.slice(-7), label]);

    const next = [...tapHistoryRef.current, label].slice(
      -UNLOCK_SEQUENCE.length,
    );
    tapHistoryRef.current = next;
    if (checkSequence(next)) {
      tapHistoryRef.current = [];
      triggerUnlock();
    }
  }

  // ── BLE ───────────────────────────────────────────────────────────────────
  function onNotification(event) {
    const label = new TextDecoder().decode(event.target.value).trim();
    handleTrigger(label);
  }

  async function connect() {
    const ctx = getCtx();
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "ESP32-TouchSynth" }],
      optionalServices: [SERVICE_UUID],
    });
    deviceRef.current = device;
    device.addEventListener("gattserverdisconnected", () => {
      setConnected(false);
      characteristicRef.current = null;
      resetToDial(false);
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    const char = await service.getCharacteristic(CHAR_UUID);
    char.addEventListener("characteristicvaluechanged", onNotification);
    await char.startNotifications();
    characteristicRef.current = char;
    setConnected(true);
    preloadSamples(ctx);
  }

  async function disconnect() {
    await resetToDial(false);
    if (characteristicRef.current)
      await characteristicRef.current.stopNotifications().catch(() => {});
    deviceRef.current?.gatt?.disconnect();
    setConnected(false);
    characteristicRef.current = null;
  }

  // ── UI ────────────────────────────────────────────────────────────────────
  const modeColors = {
    dial: {
      bg: "#1a1a2e",
      display: "#c8d6a0",
      text: "#2a3a10",
      accent: "#a0b070",
    },
    paused: {
      bg: "#1a1a2e",
      display: "#c8d6a0",
      text: "#2a3a10",
      accent: "#a0b070",
    },
    ringing: {
      bg: "#2e1a1a",
      display: "#f5c0c0",
      text: "#3a1010",
      accent: "#c07070",
    },
    waiting: {
      bg: "#2e241a",
      display: "#f5e0c0",
      text: "#3a2a10",
      accent: "#c09060",
    },
    hold: {
      bg: "#1a2e1a",
      display: "#c0d4f5",
      text: "#101a3a",
      accent: "#7090c0",
    },
  };
  const colors = modeColors[mode] ?? modeColors.dial;

  const modeLabel =
    {
      dial: "dial mode",
      paused: "\u00a0",
      ringing: "ringing\u2026",
      waiting: "please wait\u2026",
      hold: "hold music \u2014 piano mode",
    }[mode] ?? "";

  return (
    <div
      style={{
        fontFamily: "var(--font-mono, monospace)",
        maxWidth: 300,
        margin: "0 auto",
        padding: "1rem",
        background: colors.bg,
        minHeight: "100vh",
        transition: "background 0.6s",
      }}
    >
      <div
        style={{
          background: colors.display,
          borderRadius: 4,
          padding: "10px 14px",
          marginBottom: 8,
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 4,
          color: colors.text,
          border: `2px inset ${colors.accent}`,
          userSelect: "none",
          transition: "background 0.6s, color 0.6s",
        }}
      >
        {displayDigits.length ? displayDigits.join("") : "\u00a0"}
      </div>

      <p
        style={{
          fontSize: 10,
          color: colors.display,
          textAlign: "center",
          marginBottom: 12,
          letterSpacing: 1,
          opacity: 0.75,
          transition: "color 0.6s",
        }}
      >
        {modeLabel}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 6,
        }}
      >
        {ROWS.flat().map((label, i) => {
          if (!label) return <div key={i} />;
          const isActive = lastTrigger === label;
          return (
            <div
              key={label}
              style={{
                background: isActive ? "#b0b0b0" : "#d8d8d8",
                border: isActive ? "2px inset #888" : "2px outset #f0f0f0",
                borderRadius: 4,
                padding: "10px 0 8px",
                textAlign: "center",
                userSelect: "none",
                transition: "background 0.05s, border 0.05s",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#111",
                  lineHeight: 1,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#555",
                  marginTop: 3,
                  letterSpacing: 1,
                }}
              >
                {mode === "hold" ? PIANO_NOTE_NAMES[label] : PINS[label]}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={connected ? disconnect : connect}
        style={{
          width: "100%",
          marginTop: 14,
          padding: "8px 0",
          borderRadius: 4,
          border: "2px outset #d0d0d0",
          background: "#d0d0d0",
          color: "#111",
          fontSize: 13,
          fontFamily: "var(--font-mono, monospace)",
          cursor: "pointer",
        }}
      >
        {connected ? "[ disconnect ]" : "[ connect ]"}
      </button>

      <p
        style={{
          marginTop: 10,
          fontSize: 11,
          color: colors.display,
          fontFamily: "var(--font-mono, monospace)",
          textAlign: "center",
          opacity: 0.65,
        }}
      >
        {connected ? "BLE OK" : "NO SIG"}
      </p>
    </div>
  );
}
