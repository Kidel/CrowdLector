/**
 * Created by Macr0s on 18/12/16.
 */

var stream = require('linestream');

var relations = {};

var stage_two = function (file, cb){
    var line = stream.create(file, {bufferSize: 300})

    line.on('data', function(line, isEnd) {
        var elements = line.split("\t");

        if (typeof relations[elements[0]] != "undefined"){
            relations[elements[0]].SubjectType = elements[1].trim();
            relations[elements[0]].ObjectType = elements[2].trim()
        }
    })

    line.on('end', function() { // emitted at the end of file

        var rs = [];

        Object.keys(relations).forEach(function (e) {
            rs.push(relations[e]);
        })

        cb(true, rs);
    });

    line.on('error', function(e) { // emitted when an error occurred
        cb(false);
    });
}

var stage_one = function (file, cb){
    var line = stream.create(file, {bufferSize: 300})

    line.on('data', function(line, isEnd) {
        var elements = line.split("\t");

        relations[elements[0].trim()] = {
            RepresentativePhrase: elements[1].trim(),
            Name: elements[0].trim()
        }
    })

    line.on('end', function() { // emitted at the end of file
        cb(true);
    });

    line.on('error', function(e) { // emitted when an error occurred
        cb(false);
    });

}

var simplify_access = function (elements){
    var relations = {}

    elements.forEach(function (e){
        relations[e.Name] = e;
    })

    return relations
}

module.exports =  {
    createRelations: function (file_pharses_rappresentative, file_relation_schema, cb) {
        var RelationModel = require("../models/RelationModel");

        stage_one(file_pharses_rappresentative, function (status) {
            if (!status)
                return cb(false)

            stage_two(file_relation_schema, function (status, rs) {
                if (!status)
                    return cb(false)

                RelationModel.collection.insert(rs, function(err, list) {
                    if (err) return cb(false);
                    else return cb(true, simplify_access(list.ops));

                });


            });
        })
    }
}