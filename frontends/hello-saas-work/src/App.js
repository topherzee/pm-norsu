import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PageLoader from "./helpers/PageLoader";
import Navigation from "./components/Navigation";
import "./App.css";
import { getRouterBasename } from "./helpers/AppHelpers";

function App(props) {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <header>
        <Navigation />
      </header>

      <div className="container">
        <Switch>
          <Route path="/" component={PageLoader} />
        </Switch>
      </div>

      <footer>
        Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
        <br />
        Copyright © {new Date().getFullYear()}
      </footer>
    </BrowserRouter>
  );
}

export default App;
