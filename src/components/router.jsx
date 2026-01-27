import * as React from "react";
import { Switch, Route } from "wouter";
import SolderingIntro from "../pages/soldering_intro.jsx";
import Home from "../pages/home.jsx";

/**
 * The router is imported in app.jsx
 *
 * Our site just has two routes in it–Home and About
 * Each one is defined as a component in /pages
 * We use Switch to only render one route at a time https://github.com/molefrog/wouter#switch-
 */

const basePath = "/ces-portfolio/";

const PageRouter = () => (
  <Switch>
    <Route path={`${basePath}`} component={Home} />
    <Route path={`${basePath}soldering-intro`} component={SolderingIntro} />
  </Switch>
);

export default PageRouter;
