/**
 * Created by awunnenb on 27.11.13.
 * Modified by MK on 01.0.16.
 */

// Database mongodb
// mongod must be started earlier in the Console or as a service
var databaseUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost";
// var databaseUrl = "todolist"; // optional: "username:password@localhost/todolist"
var collections = ["units"];
var mongojs = require("mongojs");
var db = mongojs('mongodb://heroku_jclc1c76:o3huddalcgvin5ds4pdipuj1gm@ds031975.mlab.com:31975/heroku_jclc1c76', collections)

//  If no collection lessons exist , automatically applied
db.units.find().sort({name:1}, function(error, units) {
    if (error || !units) {
        console.log(error);
    } else {
        if (units.length != 0) {
            console.log(units.length + ' units found');
        } else {
        	console.log('No units found');
//            defaultLessons = [{'name':'Lesson 1'}];
//
//            db.lessons.insert(defaultLessons,
//                function(error){
//                    if (error) {
//                        console.log(error);
//                    } else {
//                        console.log(defaultLessons.length + ' Lessons created');
//                    }
//                });
        }
    }
});



// Form index.jade call
exports.index = function(req, res){
    db.units.find({status: "aktiv"}, function(error, units) {
        if (error || !units) {
            console.log("No active words found");
            res.render('units/index', { title: 'Units', units: null});
        } else {
            res.render('units/index', { title: 'Units', units: units });
        }
    });
};

exports.words = function(req, res){
    db.units.find({status: "aktiv"}, function(error, units) {
        if (error || !units) {
            console.log("No active units found");
            res.render('units/words', { title: 'Home', units: null});
        } else {
            if (error || !units.words) {
                console.log("No active words found");
                res.render('units/edit', { title: 'Units', units: null});
            } else {
                res.render('units/words', { title: 'Home', units: units });
            }
        }
    });
};

// Form new.jade call
exports.new = function(req, res){
    db.units.find().sort({name:1}, function(error, units) {
        if (error || !units) {
            console.log("No *units* found!")
        } else {
            res.render('units/new', { title: 'New unit', units: units });
        }
    });
};

// Form edit.jade call
exports.edit = function(req, res){
    db.units.find().sort({name:1}, function(error, units) {
        if (error || !units) {
            console.log("No Collection *units* found!")
        } else {
            db.units.findOne({"_id": db.ObjectId(req.params.id)}, function (error, action) {
                if (error || !action) {
                    console.log("ID not found");
                } else {
                    res.render('units/edit', { title: 'Edit unit', action: action, units: units });
                }
            });
        }
    });
};

//
exports.words = function(req, res){
    db.units.find({status: "aktiv"}, function(error, units) {
        if (error || !units) {
            console.log("No active units found");
            res.render('units/words', { title: 'Home', units: null});
        } else {
            if (error || !units.words) {
                console.log("No active words found");
                res.render('units/edit', { title: 'Units', units: null});
            } else {
                res.render('units/words', { title: 'Home', units: units });
            }
        }
    });
};

// Form delete.jade call
exports.delete = function(req, res){
    db.units.findOne({"_id": db.ObjectId(req.params.id)}, function(error, action) {
        if (error|| !action) {
            console.log("ID not found");
        } else {
            // Confirm delete
            res.render('units/delete', { title: 'Delete unit', action: action });
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
        db.units.update({_id: db.ObjectId(_id)}, action,
            function(error){
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/");
                }
            });
        // Insert
    } else {
        db.units.insert(action,
            function(error){
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/");
                }
            });
    }
};

// Remove records
exports.remove = function(req, res){
    var _id = db.ObjectId(req.params.id);
    db.units.remove({_id: _id}, function(error){
        if (error) {
            console.log(error);
        } else {
            res.redirect("/");
        }
    });
}

// Status set to Done
exports.done = function(req, res) {
    var _id = db.ObjectId(req.params.id);
    db.units.findOne({"_id": _id}, function(error) {
        if (error) {
            console.log("ID not found");
        } else {
            db.units.update   ( { _id: _id }, { $set: { status: "Done" }});
            res.redirect("/");
        }
    });

};
