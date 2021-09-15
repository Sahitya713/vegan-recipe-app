const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'A recipe must have a title'],
  },
  image: String,
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  steps: [
    {
      instruction: String,
    },
  ],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
