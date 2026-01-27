import { Link } from "wouter";
import "../App.css";

function Home() {
  // Information for each project
  console.log("Home component rendering!");

  return (
    <div className="container">
      <div className="title-header">
        <div className="title">Lucy's Portfolio</div>

        <div className="subtitle">
          <div> Creative Embedded Systems, Spring 2026 </div>
        </div>

        <div className="proj-container">
          <div className="desc">Projects</div>

          <div className="hl"></div>

          <Link to={`soldering-intro`} className="top-proj">
            <div className="proj-title-date-box">
              <div className="proj-title">Soldering Introduction</div>
              <div className="proj-date">1.26.2026</div>
            </div>

            <div className="proj-img">
              <img src="solder.jpeg" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
