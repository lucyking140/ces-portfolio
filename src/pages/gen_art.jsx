import * as React from "react";
import { Link } from "wouter";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Vertical offsets for each column (in %) to create a staggered grid
const COL_OFFSETS = [0, -12, 8, -6, 14];

// Grid: 1 row x 4 cols = 4 models
const ROWS = 1;
const COLS = 4;

function ModelCell({ index }) {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);
  const indexRef = useRef(index);

  useEffect(() => {
    if (!mountRef.current) return;
    let cancelled = false;

    const scene = new THREE.Scene();
    scene.background = null;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const startY = -Math.PI / 2 + indexRef.current * 0.5 - (COLS * 0.15) / 2;
    const direction = indexRef.current % 2 === 0 ? 1 : -1;

    const video = document.createElement("video");
    video.src = "./gen_art.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();

    const loader = new GLTFLoader();
    loader.load(
      "./esp32_welcome_center.glb",
      (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.center.set(0.5, 0.5);
        videoTexture.rotation = Math.PI;
        videoTexture.repeat.set(-1, 1);

        model.traverse((child) => {
          if (child.isMesh && child.name === "Cube") {
            child.material.map = videoTexture;
            child.material.needsUpdate = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        model.scale.multiplyScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        model.rotation.y = startY;

        scene.add(model);
        modelRef.current = model;

        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);
          if (modelRef.current) {
            modelRef.current.rotation.y += direction * 0.005;
          }
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (err) => console.error("Model load error:", err),
    );

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationIdRef.current);
      modelRef.current = null;
      video.pause();
      video.src = "";
      window.removeEventListener("resize", handleResize);
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export default function GenArt() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const dragState = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
  });
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);
  const [_isLoading, setIsLoading] = React.useState(true);
  const video = document.createElement("video");

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);

    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      "./esp32_welcome_center.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        modelRef.current = model;

        video.src = "./gen_art.mp4";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.center.set(0.5, 0.5);
        videoTexture.rotation = Math.PI;
        videoTexture.repeat.set(-1, 1);

        model.traverse((child) => {
          if (child.isMesh && child.name === "Cube") {
            child.material.map = videoTexture;
            child.material.needsUpdate = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 6 / maxDim;
        model.scale.multiplyScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        model.rotation.x = Math.PI / 2;
        model.rotation.y = Math.PI;

        setIsLoading(false);

        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);
          if (modelRef.current && !dragState.current.isDragging) {
            modelRef.current.rotation.y += 0.005;
          }
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setIsLoading(false);
      },
    );

    const onMouseDown = (e) => {
      dragState.current.isDragging = true;
      dragState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e) => {
      if (!dragState.current.isDragging || !modelRef.current) return;
      const deltaX = e.clientX - dragState.current.previousMousePosition.x;
      modelRef.current.rotation.y += deltaX * 0.01;
      dragState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      dragState.current.isDragging = false;
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      modelRef.current = null;
      video.pause();
      video.src = "";
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      mountNode.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [video]);

  // Random appearance order, stable across renders
  const [appearOrder] = React.useState(() =>
    Array.from({ length: COLS }, (_, i) => i).sort(() => Math.random() - 0.5),
  );

  const [textFixed, setTextFixed] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const contentSection = document.getElementById("content-section");
      if (!contentSection) return;
      const halfway = contentSection.offsetTop / 2;
      setTextFixed(window.scrollY < halfway);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="rp">
      {/* ── HERO GRID ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Typing text */}
        <div
          style={{
            position: textFixed ? "fixed" : "absolute",
            top: "1.5rem",
            left: "1.5rem",
            fontFamily: "monospace",
            fontSize: "1rem",
            zIndex: 10,
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "0",
            animation: "typing 3.5s steps(61, end) forwards",
            animationDelay: "0.3s",
          }}
        >
          creative embedded systems &#183; esp32 generative art &#183; 2.24.2026
        </div>
        {/* Blinking cursor */}
        <div
          style={{
            position: textFixed ? "fixed" : "absolute",
            top: "1.5rem",
            left: "1.5rem",
            fontFamily: "monospace",
            fontSize: "1rem",
            zIndex: 10,
            whiteSpace: "nowrap",
            opacity: 0,
            animation:
              "cursorAppear 0s forwards, cursorBlink 1s steps(1, start) infinite",
            animationDelay: "3.7s, 3.7s",
          }}
        >
          creative embedded systems &#183; esp32 generative art &#183;
          2.24.2026_
        </div>
        <style>{`
          @keyframes fadeInDrop {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes stringGrow {
            from { transform: scaleY(0); }
            to   { transform: scaleY(1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0) translateX(-50%); }
            50% { transform: translateY(6px) translateX(-50%); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes typing {
            from { width: 0; }
            to { width: 61ch; }
          }
          @keyframes cursorAppear {
            to { opacity: 1; }
          }
          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {/* Staggered flexbox row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          {Array.from({ length: COLS }).map((_, colIdx) => {
            const step = appearOrder.indexOf(colIdx);
            const delay = `${step}s`;
            return (
              <div
                key={colIdx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  position: "relative",
                  transform: `translateY(${COL_OFFSETS[colIdx]}%)`,
                  opacity: 0,
                  animation: `fadeInDrop 0.6s ease forwards`,
                  animationDelay: delay,
                }}
              >
                {/* String line from top of viewport down to top of model */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "80%",
                    left: "50%",
                    width: "1px",
                    height: "120vh",
                    background: "#000000",
                    transformOrigin: "bottom center",
                    transform: "scaleY(0)",
                    animation: `stringGrow 0.4s ease forwards`,
                    animationDelay: delay,
                  }}
                />

                {Array.from({ length: ROWS }).map((_, rowIdx) => {
                  const index = colIdx * ROWS + rowIdx;
                  return (
                    <div
                      key={rowIdx}
                      style={{
                        height: "300px",
                        flexShrink: 0,
                      }}
                    >
                      <ModelCell index={index} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: textFixed ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={() => {
            document
              .getElementById("content-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b71414"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "bounce 1.4s ease-in-out infinite" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── EXISTING CONTENT ── */}
      <div id="content-section" className="rp container">
        <div className="rp title-heading">
          <div className="header-row">
            <div className="rp header-buttons">
              <Link to="/ces-portfolio/">
                <img src="./icons/left-up.svg" alt="Back" className="icon" />
              </Link>
              <a
                href="https://github.com/lucyking140/ces-generative-art/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="./icons/github-icon.svg"
                  alt="GitHub"
                  className="icon"
                />
              </a>
            </div>
            <div className="rp title">
              &#183; esp32 generative art &#183; 2.24.2026 &#183;
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="gen_art/hero.jpeg" />
        </div>

        <div className="rp para">
          My display shows a series of quotes from a 1984 Apple Macintosh user
          guide and a 1995 Windows 95 user guide. Each quote scrolls across the
          screen, with a corresponding ASCII icon moving independently behind
          it. The icon mimics the “flying object” screen savers that were used
          on some Windows versions and DVD players, and when the icon hits a
          corner, the scrolling message and corresponding icon changes randomly.
        </div>

        <div className="rp imgbox">
          <img className="rp center-fit" src="gen_art/screensaver.gif" />
          <div className="rp imgcap">
            Example of the "flying object" screen saver that inspired my icons.
            <a
              href="https://makeagif.com/gif/windows-xp-screensaver-3d-flying-objects-4k-7KoNaW"
              target="_blank"
              rel="noopener noreferrer"
            >
              (Source)
            </a>
          </div>
        </div>

        <div className="rp para">
          In elementary school, my classmates and I would watch these
          screensaver logos bounce across the classroom projector in
          anticipation of the image landing perfectly in the corner. I wanted to
          connect my own first online experiences like this one to the earliest
          era of the internet, so I overlayed the screensaver effect with
          messages from a time when personal computers were only just becoming
          popular. The user guides of the 80s and 90s seem full of excitement
          for a technology that was so new that its full potential was far from
          understood, and reading them reminded me of a childlike feeling of
          uncertain excitement and unlimited opportunity.
        </div>

        <div className="rp para">
          During this period, computers were becoming popular but had yet to
          become so ubiquitous that they didn't require explanation. Reading
          these guides, I find it fascinating and surprising just how many
          tenants of computer interaction today are virtually identical to when
          they were first introduced. It's silly to read about these tools today
          -- I feel like I've always known how to use a mouse or type on a
          keyboard -- but the manuals remind me of the ingenuity that went into
          developing and explaining such a completely novel way of
          communicating. They lead me to wonder which novel inventions from
          today might someday also feel like second nature, which is especially
          relevant as we are introduced to increasingly revolutionary AI models.
        </div>

        <div className="rp para">
          When we gathered them together, the constant movement of the ESP32
          displays also reminded me of the perpetual movement of screen savers.
          I felt mesmerized by the variety of visuals the same way I sometimes
          feel myself staring into space as an otherwise boring screen saver
          flashes in front of me, almost creating the effect of a child's
          mobile.
        </div>

        {/* Video of the display in class */}
        <div className="rp imgbox">
          <video autoPlay muted loop controls className="rp center-fit">
            <source src="./gen_art/full_class.mp4" type="video/mp4" />
            Your browser does not support the video.
          </video>
          <div className="rp imgcap">
            {" "}
            The passive digital screens in the display are similar to the
            screensaver in that they are perpetually moving but don't respond to
            interaction from viewers.{" "}
          </div>
        </div>

        <div className="rp para">
          The way the microcontrollers spun in the display added to the
          mobile-like feeling.
        </div>

        {/* Video of just mine swinging in the display */}
        <div className="rp imgbox">
          <video autoPlay muted loop controls className="rp center-fit">
            <source src="./gen_art/mine_in_class.mp4" type="video/mp4" />
            Your browser does not support the video.
          </video>
          <div className="rp imgcap">
            {" "}
            My ESP32 didn't stop swinging on the string, which was untended but
            I think added an additional complementary layer of calm, continuous
            movement to the screensaver icons.{" "}
          </div>
        </div>

        <div className="rp para">
          <strong>Technical Details</strong>
        </div>

        <div className="rp para">
          The ASCII icons I used are modified versions of icons from the{" "}
          <a
            href="https://www.asciiart.eu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ASCII Art Archive
          </a>{" "}
          and include the three-letter signature of the artist as it is
          displayed in the archive. The five quotes shown at random are as
          follows, and are either from the{" "}
          <a
            href="https://vintageapple.org/macbooks/pdf/Apple_Macintosh_Users_Handbook_1984.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            1984 Apple Macintosh User Handbook
          </a>{" "}
          or from Microsoft's 1995{" "}
          <a
            href="https://archive.org/details/microsoft-windows-95"
            target="_blank"
            rel="noopener noreferrer"
          >
            “Introducing Microsoft Windows 95”
          </a>{" "}
          guide:
        </div>

        <div className="parallel-section">
          <div className="half-section">
            <div className="rp para">
              <strong>With a mouse icon:</strong> "The mouse can be used as a
              pointing device by sliding it over the work surface. Move it left
              and right to position the cursor."
            </div>
            <div className="rp para">
              <strong>With a keyboard icon:</strong> "The BS (backspace) key
              erases the last character you typed. Use it to correct mistakes as
              you go. Practice makes perfect!"
            </div>
            <div className="rp para">
              <strong>With a folder icon:</strong> "Documents contain
              information that an application program needs in order to execute
              properly. For example, the MacWrite™ word processor is considered
              an application, but a file that contains a memo or letter is
              considered a document."
            </div>
            <div className="rp para">
              <strong>With a playing card icon:</strong> "If you're looking for
              a fun challenge, try the games that come with Windows 95, for
              example, Solitaire, one of the most popular card games of all
              time."
            </div>
            <div className="rp para">
              <strong>With a Windows logo icon:</strong> "Screen savers can save
              wear and tear on your screen and protect your work while you're
              away. Several screen savers come with Windows 95."
            </div>
          </div>
          <div className="half-section">
            {/* Video of just mine swinging in the display */}
            <div className="rp imgbox">
              <video autoPlay muted loop controls className="rp center-fit">
                <source src="./gen_art/full_animation.mp4" type="video/mp4" />
                Your browser does not support the video.
              </video>
              <div className="rp imgcap">
                {" "}
                A random sequence of the display that shows all of the messages
                and icons.{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="rp para">
          The generative display is programmed in C++ on an ESP32
          microcontroller. This program is run using{" "}
          <a
            href="https://platformio.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PlatformIO
          </a>
          , which allows C++ code to be uploaded via USB serial connection onto
          an ESP32. It uses the Arduino{" "}
          <a
            href="https://github.com/Bodmer/TFT_eSPI"
            target="_blank"
            rel="noopener noreferrer"
          >
            TFT_eSPI
          </a>{" "}
          library for graphics and fonts, which can be installed via the Arduino
          IDE.
        </div>

        <div className="rp para">
          The program uses a sprite to display the scrolling text and a second
          transparent sprite to display the icon. The icon moves with a random
          velocity until it reaches an edge, then bounces off in a semi-random
          direction that is bounded so the icon doesn’t get into a horizontal or
          vertical bounce pattern that never reaches a corner.
        </div>

        <div className="rp para">
          The definition of a "corner" also has a slight buffer of 1/20th of the
          screen, which increases the corner hit rate and allows the message to
          change more frequently. This is a small enough margin so that corner
          hits still appear visually precise in most cases, but doesn’t require
          the icon to hit a singular perfect point to trigger the message
          change.
        </div>

        <div className="rp para">
          Every one minute, an intro sequence is played that provides context
          for the viewer and also an upper bound on the amount of time a single
          message can play because the intro sequence automatically triggers a
          random switch to another message.
        </div>

        <div className="rp imgbox">
          <img className="rp center-fit" src="gen_art/gen_art_back.jpeg" />
          <div className="rp imgcap">
            The back of the ESP32, showing the lithium ion battery that powers
            the generative display. The ESP32 case was hung with string from the
            ceiling, with this battery and the back panel taped on with electric
            tape.
          </div>
        </div>
      </div>
    </div>
  );
}
