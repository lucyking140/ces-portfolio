import { Link } from "wouter";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "../App.css";

// Gallery Item Component - One per project
function GalleryItem({ project }) {
  return (
    <div className="project-box">
      {/* Top row: Hero image (70%) + 3D Model (30%) */}
      <div className="project-top-row">
        {/* Hero image with title/date overlay */}

        <Link to={project.link} className="project-hero">
          <div className="hero-title-vertical">{project.title}</div>

          <img
            src={project.heroImage}
            alt={project.title}
            className="hero-image"
          />
        </Link>
        {/* <Link to={project.link} className="project-hero">
          <img
            src={project.heroImage}
            alt={project.title}
            className="hero-image"
          />
          <div className="hero-overlay">
            <div className="hero-info">
              {project.title}
            </div>
          </div>
        </Link> */}

        {/* 3D Model viewer */}
        {/* {project.modelPath && (
          <div className="project-model">
            <ModelViewer modelPath={project.modelPath} />
          </div>
        )} */}
      </div>

      {/* Bottom row: Detail images in a single row */}
      {/* {project.detailImages && project.detailImages.length > 0 && (
        <div className="project-details-row">
          {project.detailImages.map((image, index) => (
            <Link key={index} to={project.link} className="detail-image-link">
              <img
                src={image}
                alt={`${project.title} detail ${index + 1}`}
                className="detail-image"
              />
            </Link>
          ))}
        </div>
      )} */}
    </div>
  );
}

function Home() {
  // Project data structure
  const projects = [
    {
      id: 1,
      title: "• pcb pendant •",
      date: "2.10.2026",
      link: "pcb",
      heroImage: "pcb/hero_2.jpeg",
      modelPath: "./pcb/testing_no_background4.glb",
      detailImages: [
        "pcb/details.jpeg",
        "pcb/side.jpeg",
        "pcb/back.jpeg",
        // Add more detail images here
      ],
    },
    {
      id: 2,
      title: "• soldering introduction •",
      date: "1.26.2026",
      link: "soldering-intro",
      heroImage: "soldering_intro/hero_shot.jpeg",
      modelPath: null, // No model for this project
      detailImages: [
        // Add detail images here when available
        // "soldering_intro/detail1.jpeg",
        // "soldering_intro/detail2.jpeg",
      ],
    },
  ];

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1 className="gallery-main-title">
          &#183; lucy king portfolio &#183; creative embedded systems &#183;
          spring 2026 &#183;
        </h1>
        {/* <p className="gallery-subtitle">
          Creative Embedded Systems, Spring 2026
        </p> */}
      </header>

      <div className="projects-list">
        {projects.map((project) => (
          <GalleryItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default Home;
