var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var QuestionSchema = new Schema({	'Relation' : {	 	type: Schema.Types.ObjectId,	 	ref: 'Relation'	},	'Phrase' : String,	'Anwser' : Array,	'Utenti' : Array});

module.exports = mongoose.model('Question', QuestionSchema);
