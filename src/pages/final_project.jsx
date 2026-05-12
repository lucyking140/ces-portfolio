import * as React from "react";
import { Link } from "wouter";

const base = import.meta.env.BASE_URL; // resolves to "/ces-portfolio/"

export default function FinalProject() {
  // Intro Soldering project with pictures
  return (
    <div className="rp">
      <div className="rp container">
        <div className="rp title-heading">
          <div className="header-row">
            <div className="rp header-buttons">
              <Link to="/ces-portfolio/">
                <img
                  src={`${base}/icons/left-up.svg`}
                  alt="Back"
                  className="icon"
                />
              </Link>
              <a
                href="https://github.com/lucyking140/ces-final-project"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${base}/icons/github-icon.svg`}
                  alt="GitHub"
                  className="icon"
                />
              </a>
            </div>
            <div className="rp title">
              &#183; final project - computational histories &#183; 5.12.2026
              &#183;
            </div>
          </div>
        </div>
        {/* <div className="rp imgbox">
          <img
            className="rp center-fit"
            src={`${base}/final_project/hero_alt.jpeg`}
          />
        </div> */}
        <div className="rp imgbox">
          <video autoPlay loop controls className="rp center-fit">
            <source
              src={`${base}/final_project/ces-final-demo.mp4`}
              type="video/mp4"
            />
            Your browser does not support the video.
          </video>
        </div>
        {/* Description */}

        <div className="rp para">
          This piece explores the deep historical connection between textiles
          and computing through the symbol of the bit. The role of the bit as
          the core building block of all computer programs reminded me of the
          stitch in knit or woven textiles - both of these foundational elements
          are simple and almost meaningless alone, but combined in wonderful and
          complex ways they have a near-endless range of possibility. In this
          piece, the textile “screen” features a seven-segment chainmail display
          that lights up with 0s and 1s, showing the bitwise representation of
          the characters typed on the keyboard. This exaggerated, slow process
          juxtaposes our modern obsession with computational speed with a
          textile artist's patient appreciation for every stitch, forcing the
          user to break from a mindset of efficiency and instead appreciate the
          complexity and beauty of the computational systems we usually take for
          granted.
        </div>

        <div className="rp para">
          The “screen” is accompanied by speakers and a mechanical keyboard,
          meant to recreate a home computer setup that you might find in a desk
          or office. With the sterile white background and the dull sound of
          typing, I wanted to emphasize a sense of corporate mundanity to
          contrast with the messy chaos of the textile screen. The setup is
          influenced by Apple's brand image, with 2001-ish Mac G4 speakers and a
          white, minimalist keyboard reminiscent of early Apple design. Their
          brand is the ultimate example of corporate minimalism, which most
          strongly contrasts with the chaos of the textiles and the slow
          reflection that the screen appeals to. When the screen is turned on by
          tapping a capacitive touch button in the bottom right corner, the
          characteristic Mac startup chime plays, imitating the process of
          logging onto an Apple computer. When typing, if more keys are pressed
          while the bits from a prior key are still displayed, the speakers will
          also play the Apple “boop” alert sound that's played on modern macs
          when something is clicked that can't be selected (I couldn't find an
          exact mp3 for the sound, so you might recognize it better{" "}
          <a
            href="https://www.youtube.com/watch?v=SPDsDn7Terw"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{" "}
          or in System Settings - Sound on a Mac). This forces the user to slow
          down, paradoxically treating speed as an error.
        </div>
        <div className="rp para">
          <strong> Materials and Construction </strong>
        </div>
        {/* screen */}
        <div className="rp imgbox">
          <img
            src={`${base}/final_project/full_screen.jpeg`}
            alt="Full screen"
            style={{ width: "100%" }}
            className="rp center-fit"
          />
          <div className="rp imgcap">
            A close-up of the screen showing the knit, chainmail, and ceramic
            panels, with the ESP-32 and wiring visible on top. The chainmail
            capacitive touch button is in the bottom right corner.
          </div>
        </div>
        <div className="rp para">
          The seven-segment display is made from aluminum chainmail and is
          stitched together with the surrounding knit panels. The ceramic chains
          in the bottom left and top right are clay coils woven in the same
          4-in-1 pattern as the metal chainmail - both of these panels are
          composed of individual rings like bits or stitches. The variety of
          textiles used to make up the screen also refer back to various periods
          of history, from the textiles used to make medieval armor to the
          origins of technology and civilization in ceramics.
        </div>

        <div className="rp para">
          The colors and shapes of the panels are meant to refer to the
          geometric patterns used by artists like Anni Albers, but are also
          reminiscent of a computer glitch that randomly splashes blocks of
          color on the screen. The circuitry that powers the 7-segment LED also
          references one of Albers' works, contrasting the hard rectangles with
          the weaving, wave-like pattern of the wires. Albers' work and the
          broader Bauhaus movement emphasized breaking down visual arts into
          their core components like shapes and colors, which mirrors this
          project's empahsis on the the bit and the stitch as the core
          components of computing and textiles.
        </div>
        <div className="rp imgbox">
          <img
            className="rp center-fit"
            src={`${base}/final_project/anni_albers.jpeg`}
          />
          <div className="rp imgcap">
            Anni Albers' "Intersecting" (1962) was the primary inspiration for
            the blue and red color scheme and the geometric panels with a
            winding wire overlay.{" "}
            <a
              href="https://www.albersfoundation.org/art/highlights/intersecting"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              (Source)
            </a>
          </div>
        </div>
        <div className="rp para">
          While it isn't technically enclosed, the visibility of the ESP-32 is
          part of the design, bridging the textile patterns with the aesthetics
          of electronics by serving as the visible destination for all of the
          wires. I wanted to contrast the fluid, messy patterns of the textiles
          with the harsh metal of the chainmail and the electronics.
        </div>
        <div className="rp imgbox">
          <img
            className="rp center-fit"
            src={`${base}/final_project/esp32_close.jpeg`}
          />
          <div className="rp imgcap">
            The wire patterns near the ESP-32. They are plugged into a
            breadboard behind the screen that is held up by the ESP-32.
          </div>
        </div>
        <div className="rp imgbox">
          <img
            className="rp center-fit"
            src={`${base}/final_project/ceramic_close.jpeg`}
          />
          <div className="rp imgcap">
            More wiring, showing how the ceramic piece is woven together and
            stitched to the knit panels. I made these pieces in a ceramics class
            a while ago with the intention of using them in some sort of
            chainmail project.
          </div>
        </div>
        <div className="rp imgbox">
          <img
            className="rp center-fit"
            src={`${base}/final_project/screen_back.jpeg`}
          />
          <div className="rp imgcap">
            The back of the screen, showing the white LED backlight panels
            stitched onto the chainmail patches. The breadboard that connects
            the ESP32 to the wires is hidden from the front, but visible here.
            All of the panels were woven together and then wrapped around a
            wooden frame that I attached behind a second picture frame to give
            the impression of a monitor. The two frames are held up by a picture
            frame stand that mimics a monitor stand.
          </div>
        </div>
        <div className="rp para">
          <strong> Technology </strong>
        </div>
        <div className="rp para">
          Six panels in the seven-segment display are lit by LED backlight
          panels behind the chainmail patches (the seventh isn't needed because
          I'm only displaying 0s and 1s). Each LED is controlled by GPIO pins
          that turn on and off based on the keyboard input. They also brighten
          gradually when playing the startup sound. The capacitive touch button
          is connected to the ESP-32, which and plays the startup sound when
          pressed, with copper wire woven through the conductive aluminum
          chainmail to make the entire button capacitive. Controlling the GPIO
          pins and managing all 6 LEDs at once (it was slightly hit or miss how
          many I could power given overall amperage limits on the ESP-32 with
          the display) was a new skill that built on what I learned in our first
          PCB LED circuit module. I experimented extensively with different
          resistor values to ensure the panels were bright enough, ultimately
          settling on 9.4 Ohms (2 x 4.7 Ohm resistors) per LED.
        </div>
        <div className="rp para">
          When characters are typed on the USB keyboard plugged into my laptop,
          they are written to the ESP-32 serial monitor via web serial on a
          webpage. This page also listens for the ESP-32 to send a serial
          message that the capacitive touch button has been pressed, indicating
          that the startup sound should be played, or a message that there is
          duplicate keyboard input indicating that the the boop sound should be
          played. The ESP-32 is plugged into my laptop as well -- I needed USB
          power or another external power source stronger than our lithium ion
          batteries to power all of the LEDs, and the cord plugged into the
          screen makes sense with the image of a monitor on a desk, which would
          usually have a power cord anyway.
        </div>
        <div className="rp imgbox">
          <img
            className="rp center-fit"
            src={`${base}/final_project/full_setup.jpeg`}
          />
          <div className="rp imgcap">
            The full setup from the back, showing how my laptop was plugged into
            the keyboard and the ESP-32, but was hidden under the table for the
            demo.
          </div>
        </div>
      </div>
    </div>
  );
}
