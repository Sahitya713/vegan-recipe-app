import React, { Component } from "react";
import { Link } from "react-router-dom";

class Edit extends Component {
  constructor() {
    super();
    this.state = {
      title: "Enter title",
      steps: [{ instruction: "Enter instruction" }],
      ingredients: [
        { name: "Enter ingredient name", quantity: "Enter quantity" },
      ],
      imageUrl: "",
      image: null,
      errorMessages: [],
      infoUpdated: false,
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
        data.imageUrl = response.image;
        data.ingredients = response.ingredients;
        data.steps = response.steps;

        // const responses = JSON.parse(res).data.data;
        this.setState(data);
      })
      .catch((error) => console.log("error", error));
  };
  componentWillMount = () => {
    this.getID();
  };

  selectImages = (event) => {
    let image = event.target.files[0];
    this.setState({ image });
  };
  handleStepAdd = (event) => {
    event.preventDefault();
    var values = [...this.state.steps];
    values.push({ instruction: "Enter instruction" });
    this.setState({ steps: values });
  };
  handleStepDelete = (event) => {
    event.preventDefault();
    const { id } = event.target;
    var values = [...this.state.steps];
    values.splice(id, 1);
    this.setState({ steps: values });
  };
  handleStep = (event) => {
    const { id, name, value } = event.target;
    var values = [...this.state.steps];
    values[id][name] = value;
    this.setState({ steps: values });
  };
  handleIngredientAdd = (event) => {
    event.preventDefault();
    var values = [...this.state.ingredients];
    values.push({ name: "Enter ingredient name", quantity: "Enter quantity" });
    this.setState({ ingredients: values });
  };
  handleIngredientDelete = (event) => {
    event.preventDefault();
    const { id } = event.target;
    var values = [...this.state.ingredients];
    values.splice(id, 1);
    this.setState({ ingredients: values });
  };
  handleIngredient = (event) => {
    const { id, name, value } = event.target;
    var values = [...this.state.ingredients];
    values[id][name] = value;
    this.setState({ ingredients: values });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.updateRecipe();
  };

  updateRecipe = () => {
    var err = [];
    const { steps, image, title, ingredients } = this.state;

    if (title === "") err.push("Please enter a title");
    if (
      image &&
      !(
        image.type === "image/jpeg" ||
        image.type === "image/jpg" ||
        image.type === "image/png" ||
        image.type === "image/pdf"
      )
    ) {
      err.push("Only images of type jpeg, jpg, png or pdf can be uploaded");
    }
    for (var j = 0; j < steps.length; j++) {
      if (
        steps[j].instruction === "Enter instruction" ||
        steps[j].instruction === ""
      ) {
        err.push("Please ensure all the instructions are listed properly");
        break;
      }
    }
    for (var i = 0; i < ingredients.length; i++) {
      if (
        ingredients[i].name === "Enter ingredient name" ||
        ingredients[i].name === "" ||
        ingredients[i].quantity === "Enter quantity" ||
        ingredients[i].quantity === ""
      ) {
        err.push(
          "Please ensure all the ingredient names and quantity are listed properly"
        );
        break;
      }
    }

    if (err.length > 0) {
      this.setState({ errorMessages: err });
      return;
    }

    var formdata = new FormData();

    formdata.append("steps", JSON.stringify(steps));
    formdata.append("ingredients", JSON.stringify(ingredients));
    formdata.append("title", title);
    if (image) {
      formdata.append("image", image, image.name);
    }

    var requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `https://my-vegan-recipes.herokuapp.com/api/v1/recipes/${this.state.id}`,
      requestOptions
    )
      .then((response) => response.text())

      .then((result) => {
        const res = JSON.parse(result);

        if (res.status === "error") {
          var err = [];
          err.push(res.message);
          this.setState({ errorMessages: err });
        } else if (res.status === "success") {
          this.setState({
            infoUpdated: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div>
        <h1 className="title">Edit your Recipe!</h1>
        <div>
          <form className="form-wrap" onSubmit={this.updateRecipe}>
            <div className="title-label label">Title:</div>
            <input
              type="text"
              value={this.state.title}
              name="title"
              onChange={this.handleChange}
              className="title-input input"
            />
            <div className="curr-img-wrap">
              <img
                className="curr-img"
                src={this.state.imageUrl}
                alt="OriginalImage"
              />
            </div>

            <div className="img-label label">Upload a different image</div>
            <input
              type="file"
              onChange={this.selectImages}
              accept=".jpg, .jpeg, .png, .pdf"
              className="img-upload"
            />
            <div>
              <div className="label">Ingredients required:</div>
              <div className="ingredient-wrap">
                <span className="label ingredient-label">Ingredient:</span>
                <span className="label quantity-label">quantity:</span>
              </div>
              {this.state.ingredients.map((ingredient, i) => (
                <div key={i}>
                  <input
                    type="text"
                    value={ingredient.name}
                    name="name"
                    id={i}
                    onChange={this.handleIngredient}
                    className="input ingredient-input"
                  />
                  <input
                    type="text"
                    value={ingredient.quantity}
                    name="quantity"
                    id={i}
                    onChange={this.handleIngredient}
                    className="input quantity-input"
                  />
                  <button
                    className="x"
                    id={i}
                    onClick={this.handleIngredientDelete}
                  >
                    x
                  </button>
                </div>
              ))}
              <button
                className="add"
                name="addIngredient"
                onClick={this.handleIngredientAdd}
              >
                + Add Ingredient
              </button>
            </div>

            <div>
              <div className="label">Instructions:</div>
              {this.state.steps.map((step, i) => (
                <div key={i}>
                  <span className="label step-label">step {i + 1}:</span>
                  <input
                    type="text"
                    value={step.instruction}
                    name="instruction"
                    id={i}
                    onChange={this.handleStep}
                    className="input step-input"
                  />

                  <button className="x" id={i} onClick={this.handleStepDelete}>
                    x
                  </button>
                </div>
              ))}
              <button
                className="add"
                name="addStep"
                onClick={this.handleStepAdd}
              >
                + Add Instruction
              </button>
            </div>
            <button className="button submit" onClick={this.handleSubmit}>
              Edit
            </button>
            <div className="err-wrap">
              {this.state.errorMessages.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          </form>
        </div>
        {this.state.infoUpdated && (
          <div className="background">
            <h1 className="question">
              Your recipe has been successfully updated!
            </h1>
            <Link className="buttons-wrap " to={`/${this.state.id}`}>
              <button className="button link">View Recipe</button>
            </Link>
          </div>
        )}
      </div>
    );
  }
}
export default Edit;
