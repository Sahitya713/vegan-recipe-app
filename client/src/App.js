import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Recipe from "./components/Recipe";
import Create from "./components/Create";
import Edit from "./components/Edit";
function App() {
  // const [token, setToken] = useState();

  // if(!token) {
  //   return <SignIn2 setToken={setToken} />
  // }

  return (
    <>
      <Router>
        <Navbar />
        {/* <Home /> */}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/create" exact component={Create} />
          <Route path="/edit/:id" exact component={Edit} />
          <Route path="/:id" exact component={Recipe} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
