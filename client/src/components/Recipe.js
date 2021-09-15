import React, { Component } from "react";
import { Link } from "react-router-dom";

class Recipe extends Component {
  constructor() {
    super();
    this.state = {
      title: null,
      steps: [],
      image: null,
      ingredients: [],
      id: null,
      delete: false,
      deleted: false,
    };
  }
  getID = () => {
    const id = this.props.match.params.id;
    this.setState({ id }, this.getRecipe);
  };

  getRecipe = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://my-vegan-recipes.herokuapp.com/api/v1/recipes/${this.state.id}`,
      requestOptions
    )
      .then((res) => res.text())
      .then((res) => {
        const response = JSON.parse(res).data.data;

        let data = {};
        data.title = response.title;
        data.image = response.image;
        data.ingredients = response.ingredients;
        data.steps = response.steps;

        // const responses = JSON.parse(res).data.data;
        this.setState(data);
      })
      .catch((error) => console.log("error", error));
  };

  checkDelete = () => {
    this.setState({ delete: true });
  };
  delete = () => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(
      `https://my-vegan-recipes.herokuapp.com/api/v1/recipes/${this.state.id}`,
      requestOptions
    )
      .then((res) => res.text())
      .then((res) => this.setState({ deleted: true }))
      .catch((error) => console.log("error", error));
  };
  noDelete = () => {
    this.setState({ delete: false });
  };
  componentWillMount = () => {
    this.getID();
  };
  render() {
    return (
      <div>
        <h1 className="recipe-title">{this.state.title}</h1>
        <div className="recipe-buttons-wrap">
          <Link to={`/edit/${this.state.id}`}>
            <button className="edit button">edit</button>
          </Link>

          <button className="delete button" onClick={this.checkDelete}>
            delete
          </button>
        </div>

        <img className="recipe-img" src={this.state.image} alt=""></img>

        <div className="ingredients-wrap">
          <h2 className="recipe-ingredients">Ingredients</h2>
          <ol>
            {this.state.ingredients.map((ingredient) => (
              <li key={ingredient._id} className="recipe-ingredient">
                {ingredient.name} - {ingredient.quantity}
              </li>
            ))}
          </ol>
        </div>
        <div className="steps-wrap">
          <h2 className="recipe-steps">Steps</h2>
          <ol>
            {this.state.steps.map((step, i) => (
              <li className="recipe-step" key={i}>
                {step.instruction}
              </li>
            ))}
          </ol>
        </div>

        {this.state.delete && (
          <div className="background">
            <h1 className="question">
              Are you sure you want to delete this recipe?
            </h1>
            <div className="buttons-wrap">
              <button className="button yes" onClick={this.delete}>
                yes
              </button>

              <button className="button no" onClick={this.noDelete}>
                no
              </button>
            </div>
          </div>
        )}
        {this.state.deleted && (
          <div className="background">
            <h1 className="question">
              The Recipe - {this.state.title} - has been deleted
            </h1>
            <Link className="buttons-wrap" to="/">
              <button className="button link">Go back Home</button>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default Recipe;
