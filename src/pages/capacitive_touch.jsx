import * as React from "react";
import { Link } from "wouter";

export default function CapacitiveTouch() {
  // Intro Soldering project with pictures
  return (
    <div className="rp">
      <div className="rp container">
        <div className="rp title-heading">
          <div className="header-row">
            <div className="rp header-buttons">
              <Link to="/ces-portfolio/">
                <img src="./icons/left-up.svg" alt="Back" className="icon" />
              </Link>
              {/* TODO: change */}
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
              &#183; capacitive touch phone bag &#183; 4.5.2026 &#183;
            </div>
          </div>
        </div>

        <div className="rp imgbox">
          <img className="rp center-fit" src="./cap_touch/hero_shot.jpg" />
        </div>

        {/* Description */}
        <div className="rp para">
          Inspired by the playful cell phones of the early 2000s and ideas of
          wearable technology, this bag is a mock phone operated by a series of
          7 capacitive chainmail patches. At first, the patches serve as a
          keypad to “dial” a phone number. When a specific phone number is
          entered (276-166-1232, my phone number mod 7), the bag “rings” and
          gets picked up by an answering machine playing hold music. In this
          mode, the chainmail patches act as piano keys, allowing the user to
          play along with the music. The user can then “hang up” by pressing the
          first and second patches simultaneously, after which the bag returns
          to dial mode.
        </div>

        {/* Video demo */}
        <div className="rp imgbox">
          <video autoPlay loop controls className="rp center-fit">
            <source src="./cap_touch/ces_demo.mp4" type="video/mp4" />
            Your browser does not support the video.
          </video>
          <div className="rp imgcap"> Demo showing both modes. </div>
        </div>

        <div className="rp para">
          The idea of a touch interface bag was inspired by the Honey Lemon
          character in Big Hero Six, who uses a purse with a periodic table
          keypad to create chemical reactions on the fly. Going against
          expectations of science as a man’s field, her character’s pink,
          feminine persona only amplifies her chemistry skills, with the
          stereotypically female accessory of the purse serving as the vehicle
          for her scientific genius. Today, wearable technology is often instead
          designed to be sterile, silver, and functional, lacking a playfulness
          embodied both by Honey Lemon’s bag and earlier generations of personal
          technology.
        </div>

        {/* Honey lemon image */}
        <div className="rp imgbox">
          <img
            src="./cap_touch/honey_lemon.gif"
            alt="Honey Lemon Bag"
            style={{ width: "100%" }}
          />
          <div className="rp imgcap">
            Honey Lemon's touch interface bag in action.
          </div>
        </div>

        <div className="rp para">
          I wanted to bridge today’s emphasis on metallic, sterile design with
          the experimentation of previous eras, built from Honey Lemon’s
          representation of wearable technology that serves aesthetic as well as
          functional purposes. The geometric shapes of the metallic chainmail
          used for the capacitive touch buttons are industrial and sharp, but
          their messy texture and irrational layout departs from the sleek steel
          of modern design. The bag itself is also a byproduct of industrial
          materials and is made from webbing, recycled billboard tarp, and bike
          inner tubes, all of which are used outside of their original
          functional purpose and are transformed into an accessory worn for
          style. The style and shape of the bag is based on{" "}
          <a
            href="https://freitag.ch/en_US/products/f41-hawaii-five-0?v=000004246722"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            this bag{" "}
          </a>{" "}
          from Freitag, which also uses similar materials.
        </div>

        <div className="rp imgbox">
          <img className="rp center-fit" src="cap_touch/freitag_ex.jpeg" />
          <div className="rp imgcap">Bag used for inspiration</div>
        </div>

        <div className="rp para">
          Cell phones in particular have lost their whimsy – after years of
          creative shapes, colors, and designs in the early 2000s, the rise of
          the iPhone and devices like it have normalized a strict vision of
          steel and glass that doesn’t allow for creative exploration. Creating
          a wearable mock phone returns to this era of creativity and amplifies
          the role of aesthetics in technology by translating the phone from a
          handheld device to an accessory that’s always visible to those around
          the wearer. Allowing the wearer to engage in the playfulness of
          music-making in the hold music mode also adds a layer of fun in a
          traditionally dull moment of waiting on hold.
        </div>

        <div className="rp para">
          <strong> Process </strong>
        </div>

        {/* Process timelapse */}
        <div className="rp imgbox">
          <video autoPlay loop controls className="rp center-fit">
            <source src="./cap_touch/cap_touch_bag.mp4" type="video/mp4" />
            Your browser does not support the video.
          </video>
          <div className="rp imgcap">
            {" "}
            Timelapse and explanation of the process of constructing the bag,
            chainmail, and wiring.{" "}
          </div>
        </div>

        <div className="rp para">
          I’ve made bags in the style of the Freitag brand previously, so I had
          the materials and was familiar with the general design of the bag. The
          electronic components of the bag are isolated to the lid, which makes
          it easier to construct the bag without disturbing the wiring and also
          easier to separate the ESP-32 and wiring from the bag in the future
          (the goal is to be able to easily return the ESP-32 and also reuse the
          bag for personal wear).
        </div>

        <div className="rp para">
          After constructing the bottom of the bag, I wove the chainmail buttons
          from another aluminum chainmail panel I had made from a previous
          project. Each button is connected to two copper wires, which are then
          soldered together to create one connection to the ESP-32. The wires
          are simply wrapped around one of the chainmail rings in the button,
          which keeps them relatively hidden from the front, and avoids the
          challenges I ran into when trying to solder onto the aluminum rings.
          While the rings in the buttons are conductive and mostly connect due
          to the tight weave pattern, linking the electrical connection across
          the entire button, the signal is sometimes lost if the rings aren’t
          directly connected. Having two direct points of contact to the copper
          wire in each button makes it almost guaranteed that a touch anywhere
          on the button will reach at least one wire.
        </div>

        {/* Wiring */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="cap_touch/bag_wiring.jpeg" />
          <div className="rp imgcap">
            The inside of the lid, with the chainmail buttons on the flip side.
            Each wire is soldered to another piece to increase the conductive
            surface area. This layer is hidden in the final product.
          </div>
        </div>

        <div className="rp para">
          The wires are placed between layers of tarp in the lid, so they’re not
          visible from the outside. They come together at one small point at the
          base of the lid, where they are plugged into the ESP-32 breadboard.
          The device and breadboard themselves are inside a small 3D-printed
          enclosure. Keeping this enclosure outside of the fabric bag ensures
          easy access, removal, and sufficient airflow for heat management.
        </div>

        {/* Enclosure */}
        <div className="rp imgbox">
          <img className="rp center-fit" src="cap_touch/inside_bag.jpeg" />
          <div className="rp imgcap">
            Inside the bag, showing the white 3D-printed enclosure for the
            ESP-32. The wires go from the lid into the breadboard inside the
            enclosure. The box itself is taped to the inside of the bag with a
            command strip, which makes it sturdy but also easy to remove
            later.{" "}
          </div>
        </div>

        <div className="rp para">
          To power the phone, I use web serial bluetooth to wirelessly connect
          the bag to an audio interface on my laptop. It is powered by a
          portable charger and a bluetooth speaker that sits inside the bag,
          which hides any wiring from sight when wearing it. The bluetooth
          speaker is connected via standard bluetooth to my laptop, which makes
          the audio from the laptop sound like it’s coming from within the bag.
        </div>

        <div className="rp para">
          <strong> Technical Challenges </strong>
        </div>

        <div className="rp para">
          The bag only has 7 buttons, but I originally planned for 10 based on
          an actual number keypad. I experimented with using combinations of
          touch pins on the ESP-32 to produce the additional 3 buttons beyond
          the 7 touch pins available on the device (for example, touching pins
          T2 and T3 would be a third button on top of T2 and T3 individually).
          When I created a wire that permanently connected two pins in addition
          to the two separate wires that individually connected to each pin, I
          realized that this created a permanent circuit between the two that
          would be triggered even if only touching one of the two buttons
          because it was electrically connected to the second button via the
          combination wire.
        </div>

        <div className="rp para">
          One way to do this correctly would have been to use the human touch to
          complete the two-pin circuit, so that the individual pins would only
          be overwritten by this connection if they were touched simultaneously,
          which isn’t a problem for my design. However, this wasn’t compatible
          with my design for the chainmail buttons where the entire button is
          connected, so I reduced the number of buttons and only used the middle
          7 buttons on the chainmail keypad, leaving the remaining 3 for
          decoration.
        </div>

        <div className="rp para">
          I also used single copper wires for the first few buttons, which I
          quickly realized were too fragile for the movement I needed in the
          lid. My original design placed the ESP-32 on the lid itself, which
          avoided the problem of the movement of opening and closing the lid,
          and I pivoted after already completing the wiring in the lid. Because
          the wires are hidden between fabric layers, they aren’t easily fixable
          and thus are somewhat fragile. Luckily, only one broke and it was
          right at the point that it exited the lid, so I was able to fix it.
          Otherwise, gently opening and closing the bag hasn’t caused any other
          damage, and the bag is primarily intended to be worn and used while
          closed, where movement isn’t a problem. The idea of the bag is to be
          interacted with while worn, and aside from the thin wires, the
          chainmail and tarp interface is waterproof and damageproof.
        </div>
      </div>
    </div>
  );
}
