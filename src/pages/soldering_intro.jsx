import * as React from "react";
import { Link } from "wouter";

export default function SolderingIntro() {
  // Intro Soldering project with pictures
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

        {/* brief description */}
        <div className="rp subtitle">
          Soldering practice with decorative brass wire bent around a
          protoboard.
        </div>

        {/* Hero image with caption */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="hero_shot.jpeg" />
          {/* <div className="rp imgcap">
            Soldered protoboard with brass wire decoration
          </div> */}
        </div>

        {/* Caption indicating more images below */}

        {/* Description */}
        <div className="rp para">
          This was my first time soldering, so I started with the 12-pin header.
          These were easier to solder because they stayed in place after the
          first pin was connected, but the pins were very close together which
          made it challenging to avoid bridging.
        </div>

        <div className="rp para">
          For the wire piece, I soldered two pieces of wire on one side of the
          protoboard, then bent them in parallel around to the other side. I
          shaped the zig zag peice separately and soldered it last.
        </div>

        <div className="rp para">
          The curves in the wire are a creative representation of a journey in
          life, such as a friendship. The wires begin together at one end of the
          board and travel around to the other side where the connection ends,
          but the zigzag piece reconnects the two after a meandering journey.
        </div>

        {/* detail images with captions */}
        {/* horizontal view */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="horizontal.jpeg" />
          <div className="rp imgcap">
            Protoboard from the side, showing how the wire bends around to the
            back of the board.
          </div>
        </div>

        {/* pin header solders */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="back.jpeg" />
          <div className="rp imgcap">Soldering on the 12-pin header.</div>
        </div>

        {/* front bottom solders */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="front_bottom.jpeg" />
          <div className="rp imgcap">
            Examples where the wire is soldered perpendicularly and at a closer
            angle to the protoboard.
          </div>
        </div>

        {/* front top solders */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="front_top.jpeg" />
          <div className="rp imgcap">
            More examples of the soldered connections on the front side of the
            board. Some were connected from the bottom of the board, and some
            from the top.
          </div>
        </div>
      </div>
    </div>
  );
}
