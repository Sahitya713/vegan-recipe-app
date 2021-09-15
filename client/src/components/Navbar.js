import React from "react";
import { Link } from "react-router-dom";

function Navbar(props) {
  return (
    <>
      <div className="navbar-wrap">
        <Link className="create" to="/create">
          Add Recipe
        </Link>
        <span className="divider"> | </span>
        <Link className="explore" to="/">
          View Recipes
        </Link>
      </div>
    </>
  );
}

export default Navbar;
