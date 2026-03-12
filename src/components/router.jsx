import * as React from "react";
import { Switch, Route } from "wouter";
import SolderingIntro from "../pages/soldering_intro.jsx";
import Home from "../pages/home.jsx";
import Pcb from "../pages/pcb.jsx";
import GenArt from "../pages/gen_art.jsx";
import ScrollToTop from "./scrollToTop";
import TouchSynth from "../pages/capacitive_touch.jsx";

/**
 * The router is imported in app.jsx
 *
 * Our site just has two routes in it–Home and About
 * Each one is defined as a component in /pages
 * We use Switch to only render one route at a time https://github.com/molefrog/wouter#switch-
 */

const basePath = "/ces-portfolio/";

const PageRouter = () => (
  <>
    <ScrollToTop />
    <Switch>
      <Route path={`${basePath}`} component={Home} />
      <Route path={`${basePath}soldering-intro`} component={SolderingIntro} />
      <Route path={`${basePath}pcb`} component={Pcb} />
      <Route path={`${basePath}gen-art`} component={GenArt} />
      <Route path={`${basePath}capacitive-touch`} component={TouchSynth} />
    </Switch>
  </>
);

export default PageRouter;
