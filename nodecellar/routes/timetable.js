var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('timetablesdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'timetablesdb' database");
        db.collection('timetables', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'timetables' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving timetables: ' + id);
    db.collection('timetables', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('timetables', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addTimetable = function(req, res) {
    var timetable = req.body;
    console.log('Adding timetable: ' + JSON.stringify(timetable));
    db.collection('timetables', function(err, collection) {
        collection.insert(timetable, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateTimetable = function(req, res) {
    var id = req.params.id;
    var timetable = req.body;
    console.log('Updating timetable: ' + id);
    console.log(JSON.stringify(timetable));
    db.collection('timetables', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, timetable, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating timetable: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(timetable);
            }
        });
    });
}

exports.deleteTimetable = function(req, res) {
    var id = req.params.id;
    console.log('Deleting timetable: ' + id);
    db.collection('timetables', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var timetables = [
        { time: "00:00h" },
        { time: "00:05h" },
        { time: "00:10h" },
        { time: "00:15h" },
        { time: "00:20h" },
        { time: "00:25h" }];

    db.collection('timetables', function(err, collection) {
        collection.insert(timetables, {safe:true}, function(err, result) {});
    });

};