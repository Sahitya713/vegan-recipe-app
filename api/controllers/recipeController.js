const multer = require('multer');
const Recipe = require('../models/recipeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const awsManager = require('../utils/awsManager');

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});
exports.getAllRecipes = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const recipes = await Recipe.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: {
      data: recipes,
    },
  });
});

exports.manageImage = multer({ storage }).single('image');
exports.createRecipe = catchAsync(async (req, res, next) => {
  const imageLocation = await awsManager.uploadImage(req.file);
  req.body.image = imageLocation.Location;

  req.body.ingredients = JSON.parse(req.body.ingredients);
  req.body.steps = JSON.parse(req.body.steps);
  const recipe = await Recipe.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: recipe,
    },
  });
});

exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(
      new AppError(`no document found with the ID ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: recipe,
    },
  });
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
  if (req.file) {
    const imageLocation = await awsManager.uploadImage(req.file);
    req.body.image = imageLocation.Location;
  }
  if (req.body.ingredients)
    req.body.ingredients = JSON.parse(req.body.ingredients);
  if (req.body.steps) req.body.steps = JSON.parse(req.body.steps);

  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!recipe) {
    return next(
      new AppError(`no document found with the ID ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: recipe,
    },
  });
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) {
    return next(
      new AppError(`no Document found with the ID ${req.params.id}`, 404)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
