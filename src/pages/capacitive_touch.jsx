import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

const DEBOUNCE_MS = 200;
const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];

function mapToScale(val) {
  const index = Math.floor((val / 40) * PENTATONIC.length);
  return PENTATONIC[Math.min(index, PENTATONIC.length - 1)];
}

export default function TouchSynth() {
  const [connected, setConnected] = useState(false);
  const [lastNote, setLastNote] = useState(null);
  const synthRef = useRef(null);
  const readerRef = useRef(null);
  const bufferRef = useRef("");
  const lastTouchTimeRef = useRef(0);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    return () => {
      synthRef.current?.dispose();
      readerRef.current?.cancel();
    };
  }, []);

  async function connect() {
    await Tone.start();
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();
    readerRef.current = reader;
    setConnected(true);
    readLoop(reader);
  }

  async function readLoop(reader) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        readerRef.current = null;
        setConnected(false);
        break;
      }
      if (value) {
        bufferRef.current += value;
        const lines = bufferRef.current.split("\n");
        bufferRef.current = lines.pop();

        for (const line of lines) {
          const parsedVal = parseInt(line.trim());
          if (!isNaN(parsedVal)) {
            const now = Date.now();
            if (now - lastTouchTimeRef.current > DEBOUNCE_MS) {
              lastTouchTimeRef.current = now;
              const freq = mapToScale(parsedVal);
              synthRef.current.triggerAttackRelease(freq, "8n");
              setLastNote(freq);
            }
          }
        }
      }
    }
  }

  async function disconnect() {
    await readerRef.current?.cancel();
  }

  return (
    <div>
      <h2>ESP32 Touch Synth</h2>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      {lastNote && <p>Last note: {lastNote} Hz</p>}
      <button onClick={connected ? disconnect : connect}>
        {connected ? "Disconnect" : "Connect to ESP32"}
      </button>
    </div>
  );
}
