/**
 * Created by awunnenb on 27.11.13.
 * Modified by MK on 01.0.16.
 */

// Database mongodb
// mongod must be started earlier in the Console or as a service
var databaseUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost";
// var databaseUrl = "todolist"; // optional: "username:password@localhost/todolist"
var collections = ["words", "units"];
var mongojs = require("mongojs");
var db = mongojs('mongodb://heroku_jclc1c76:o3huddalcgvin5ds4pdipuj1gm@ds031975.mlab.com:31975/heroku_jclc1c76', collections)

//  If no collection lessons exist , automatically applied
db.words.find().sort({name:1}, function(error, words) {
    if (error || !words) {
        console.log(error);
    } else {
        if (words.length != 0) {
            console.log(words.length + ' words found');
        } else {
            defaultwords = [{'name':'word 1'}];

            db.words.insert(defaultwords,
                function(error){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(defaultwords.length + ' words created');
                    }
                });
        }
    }
});



// Form index.jade call
exports.index = function(req, res){
    db.words.find({status: "aktiv"}, function(error, words) {
        if (error || !words) {
            console.log("No active words found");
            res.render('words/index', { title: 'Home', words: null});
        } else {
            res.render('words/index', { title: 'Home', words: words });
        }
    });
};

// Form new.jade call
exports.new = function(req, res){
    db.words.find().sort({name:1}, function(error, words) {
        if (error || !words) {
            console.log("No Collection *units* found!")
        } else {
            res.render('/words/new', { title: 'New word', words: words });
        }
    });
};

// Form edit.jade call
exports.edit = function(req, res){
    db.words.find().sort({name:1}, function(error, lessons) {
        if (error || !lessons) {
            console.log("No Collection *units* found!")
        } else {
            db.words.findOne({"_id": db.ObjectId(req.params.id)}, function (error, action) {
                if (error || !action) {
                    console.log("ID not found");
                } else {
                    res.render('edit', { title: 'Edit word', action: action, lessons: lessons });
                }
            });
        }
    });
};

// Form delete.jade call
exports.delete = function(req, res){
    db.words.findOne({"_id": db.ObjectId(req.params.id)}, function(error, action) {
        if (error|| !action) {
            console.log("ID not found");
        } else {
            // Confirm delete
            res.render('delete', { title: 'Delete word', action: action });
        }
    });
};

// Form Update
exports.save = function(req, res){
    var action = req.body;
    console.log(action);
    if (!action) res.redirect('/home');
    action.status = "aktiv";
    var _id = req.params.id;
    // Update
    if (_id) {
        db.words.update({_id: db.ObjectId(_id)}, action,
            function(error){
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/home");
                }
            });
        // Insert
    } else {
        db.words.insert(action,
            function(error){
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/home");
                }
            });
    }
};

// Remove records
exports.remove = function(req, res){
    var _id = db.ObjectId(req.params.id);
    db.words.remove({_id: _id}, function(error){
        if (error) {
            console.log(error);
        } else {
            res.redirect("/home");
        }
    });
}

// Status set to Done
exports.done = function(req, res) {
    var _id = db.ObjectId(req.params.id);
    db.words.findOne({"_id": _id}, function(error) {
        if (error) {
            console.log("ID not found");
        } else {
            db.words.update   ( { _id: _id }, { $set: { status: "Done" }});
            res.redirect("/home");
        }
    });

};
