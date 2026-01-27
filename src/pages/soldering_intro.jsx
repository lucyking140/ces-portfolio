import * as React from "react";
//import { Link } from "wouter"; //TODO: getting an error the useParams and other hooks don't exist in wouter?
import { Link } from "wouter";

export default function SolderingIntro() {
  let imgs = [];

  const images = imgs.map((img) => {
    const imgPath = img.img;
    return (
      <div className="rp imgbox">
        <img className="rp center-fit" src={imgPath} />
        <div className="rp imgcap">{img.cap}</div>
      </div>
    );
  });

  return (
    <div className="rp">
      <div className="rp container">
        <div className="rp title-heading">
          <div className="rp title">Soldering Introduction</div>

          <div className="header-row">
            <div className="rp date">1.26.2026</div>

            <div className="rp header-buttons">
              <Link to="/ces-portfolio/">
                <button>Back</button>
              </Link>
            </div>
          </div>

          <div className="rp hl"> </div>
        </div>

        {/* for the actual text of the page */}
        <div
          className="rp content"
          // dangerouslySetInnerHTML={{ __html: resp.text }}
        >
          Hiiii text content!
        </div>

        <div className="rp allimgs">{images}</div>
      </div>
    </div>
  );
}
