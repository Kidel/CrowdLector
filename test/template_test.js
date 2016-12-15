var mongoose = require('mongoose');
var relationFacade = require('../facade/RelationFacade.js');
var questionGenerator = require('../facade/QuestionGenerator.js');

mongoose.connect('mongodb://localhost/TestLectorDB');

module.exports = {relationFacade:relationFacade, questionGenerator: questionGenerator}