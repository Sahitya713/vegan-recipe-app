import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      recipes: null,
    };
  }

  getRecipes = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://my-vegan-recipes.herokuapp.com/api/v1/recipes",
      requestOptions
    )
      .then((res) => res.text())
      // .then((res) => console.log(res))
      .then((res) => {
        const responses = JSON.parse(res).data.data;
        this.setState({ recipes: responses });
      })
      .catch((error) => console.log("error", error));
  };

  componentWillMount = () => {
    this.getRecipes();
  };
  render() {
    return (
      <div>
        <h1 className="title">PLATE UP ONE OF THESE RECIPES TODAY</h1>
        {this.state.recipes && (
          <div className="recipe-card-wrap">
            {this.state.recipes.map((recipe) => (
              <Link
                key={recipe.title}
                to={`/${recipe._id}`}
                className="recipe-card"
              >
                <img
                  className="recipe-card-img"
                  src={recipe.image}
                  alt=""
                ></img>

                <div className="recipe-card-title">{recipe.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Home;
