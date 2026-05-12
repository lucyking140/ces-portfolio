import * as React from "react";
import { Switch, Route } from "wouter";
import SolderingIntro from "../pages/soldering_intro.jsx";
import Home from "../pages/home.jsx";
import Pcb from "../pages/pcb.jsx";
import GenArt from "../pages/gen_art.jsx";
import ScrollToTop from "./scrollToTop";
import TouchSynth from "../pages/cap_touch_interface.jsx";
import CapacitiveTouch from "../pages/capacitive_touch.jsx";
import FinalInterface from "../pages/final_interface.jsx";
import FinalProject from "../pages/final_project.jsx";

const basePath = "/ces-portfolio/";

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "4rem" }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href={basePath}>Go Home</a>
  </div>
);

const PageRouter = () => (
  <>
    <ScrollToTop />
    <Switch>
      <Route path={`${basePath}`} component={Home} />
      <Route path={`${basePath}soldering-intro`} component={SolderingIntro} />
      <Route path={`${basePath}pcb`} component={Pcb} />
      <Route path={`${basePath}gen-art`} component={GenArt} />
      <Route
        path={`${basePath}capacitive-touch-interface`}
        component={TouchSynth}
      />
      <Route path={`${basePath}capacitive-touch`} component={CapacitiveTouch} />
      <Route path={`${basePath}final-interface`} component={FinalInterface} />
      <Route path={`${basePath}final-project`} component={FinalProject} />
      <Route component={NotFound} />
    </Switch>
  </>
);

export default PageRouter;
