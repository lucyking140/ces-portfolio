import * as React from "react";
import { Link } from "wouter";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Pcb() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const dragState = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
  });
  const modelRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    // Position camera to center the model in the viewport
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);

    // FIX 3: Save a stable reference to the mount node for cleanup
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // FIX 2: Track animation frame ID so we can cancel it on cleanup
    let animationId;

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      "./pcb/testing_no_background4.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        modelRef.current = model;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        console.log("center:", center);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        model.scale.multiplyScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Rotate model so grey battery holder is at the top
        // Flip the model 180 degrees around the Z-axis
        // model.rotation.z = Math.PI;
        // Set initial 45-degree rotation for viewing angle
        model.rotation.x = Math.PI / 2;
        model.rotation.y = Math.PI;

        // Hide loading spinner once model is loaded
        setIsLoading(false);

        // Animation loop - starts after model is loaded
        const animate = () => {
          animationId = requestAnimationFrame(animate); // FIX 2: store the ID
          if (modelRef.current && !dragState.current.isDragging) {
            modelRef.current.rotation.x += 0.003;
            modelRef.current.rotation.y += 0.005;
          }
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setIsLoading(false); // Hide spinner even on error
      },
    );

    // FIX 1: Only attach mouse events to the document (not both canvas + document)
    const onMouseDown = (e) => {
      dragState.current.isDragging = true;
      dragState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!dragState.current.isDragging || !modelRef.current) return;

      const deltaX = e.clientX - dragState.current.previousMousePosition.x;
      const deltaY = e.clientY - dragState.current.previousMousePosition.y;

      modelRef.current.rotation.y += deltaX * 0.01;
      modelRef.current.rotation.x += deltaY * 0.01;

      dragState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      dragState.current.isDragging = false;
    };

    // FIX 1: Attach only to document, not both canvas and document
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      // FIX 2: Cancel the animation loop before unmounting
      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // FIX 3: Use the stable mountNode reference instead of mountRef.current
      mountNode.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // PCB project with pictures
  return (
    <div className="rp">
      <div className="rp container">
        <div className="rp title-heading">
          <div className="header-row">
            <div className="rp header-buttons">
              <Link to="/ces-portfolio/">
                {/* <button>Back</button> */}
                <img src="./icons/left-up.svg" alt="Back" className="icon" />
              </Link>
              <a
                href="https://github.com/lucyking140/ces-pcb/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* <button>Back</button> */}
                <img
                  src="./icons/github-icon.svg"
                  alt="GitHub"
                  className="icon"
                />
              </a>
            </div>

            <div className="rp title">
              &#183; pcb pendant &#183; 2.10.2026 &#183;
            </div>
          </div>

          {/* <div className="rp hl"> </div> */}
        </div>

        {/* brief description */}
        {/* <div className="rp subtitle">
          Designing a PCB for a simple LED circuit using KiCad.
        </div> */}

        {/* Hero image with caption */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="pcb/hero_2.jpeg" />
        </div>

        {/* 3D Model viewer */}
        <div className="model-container">
          <div className="model-title">
            click and drag model to rotate
            {/* <br />
            (refresh if model doesn't rotate immediately :)) */}
          </div>
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #000000",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
          <div
            ref={mountRef}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Caption indicating more images below */}

        {/* TODO: Description */}

        <div className="rp para">
          The board, tracks, and components on my pendant form a series of
          concentric circles inspired by Josef Alber's{" "}
          <a
            href="https://www.metmuseum.org/art/collection/search/489056"
            target="_blank"
            rel="noopener noreferrer"
          >
            Homage to the Square
          </a>
          , which portrays a series of nested squares and tests the bounds of
          depth and color. Each piece is composed only of colored squares, but
          Albers manages to create widely varying illusions of dimensionality
          and colorful dissonance even without more expressive tools.
        </div>

        <div className="rp imgbox">
          <img className="rp center-fit" src="pcb/homage.jpg" />
          <div className="rp imgcap">
            Examples from Josef Albers' 'Homage to the Square' series{" "}
            <a
              href="https://en.wikipedia.org/wiki/Homage_to_the_Square"
              target="_blank"
              rel="noopener noreferrer"
            >
              (Wikipedia)
            </a>
          </div>
        </div>

        <div className="rp para">
          Like colors and shapes, a PCB allows for limitless possibilities, from
          the customizable shape of the board to the placement and choice of
          components. Organizing the board and its elements into a series of
          circles allows each component to be admired independently while also
          appreciating the functionality of their collective outcome, just like
          with Albers' squares.
        </div>

        <div className="rp imgbox">
          <img className="rp center-fit" src="pcb/traces_guides.png" />
          <div className="rp imgcap">
            The concentric circles that I used as guides when designing the PCB
            traces.
          </div>
        </div>

        <div className="rp para">
          Although made a few decades after the peak of the modernist era,
          Homage to the Square is representative of the movement’s broader
          emphasis of the visual elements like shape and color that previous
          generations of artists had seen as a tool but not something to be
          appreciated independently. Similarly, the long geometric traces and
          circularly arranged components on my PCB invite viewers to appreciate
          the beauty of the foundational elements of a circuit, not just its
          functionality.
        </div>

        <div className="rp para">
          The period of dramatic change soon after the industrial revolution and
          World War I that motivated this movement is also reminiscent of
          today’s turbulent environment. With the rise of the internet and
          generative AI, many of us are also questioning foundations of our
          personal and working lives that we may have once assumed to be
          immutable. Applying Albers’ principles to a PCB board that visually
          represents the ubiquitousness of electronics in the modern world
          translates this sense of technological uncertainty directly onto its
          source, while also looking back to an artistic movement that grappled
          with a reassuringly similar sense of change.
        </div>

        {/* Video of the PCB */}
        <div className="rp imgbox">
          <video autoPlay muted loop controls className="rp center-fit">
            <source src="./pcb/demo.mp4" type="video/mp4" />
            Your browser does not support the video.
          </video>
          <div className="rp imgcap">The PCB while flashing.</div>
        </div>

        {/* detail images */}
        {/* side view showing heights */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="pcb/side.jpeg" />
          <div className="rp imgcap">
            PCB from the side, showing how the LED is elevated to fit between
            the chip and the battery holder.
          </div>
        </div>

        {/* details of hardware */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="pcb/details.jpeg" />
          <div className="rp imgcap">
            Close-up of the PCB LED on, emphasizing the circular shape of the
            traces.
          </div>
        </div>

        {/* back of the pcb */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="pcb/back.jpeg" />
          <div className="rp imgcap">The back of the PCB.</div>
        </div>
      </div>
    </div>
  );
}
