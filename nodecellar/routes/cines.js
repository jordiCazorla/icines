var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('cinesdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'cinesdb' database");
        db.collection('cines', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'cines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving cines: ' + id);
    db.collection('cines', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('cines', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addCine = function(req, res) {
    var cine = req.body;
    console.log('Adding cine: ' + JSON.stringify(cine));
    db.collection('cines', function(err, collection) {
        collection.insert(cine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateCine = function(req, res) {
    var id = req.params.id;
    var cine = req.body;
    console.log('Updating cine: ' + id);
    console.log(JSON.stringify(cine));
    db.collection('cines', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, cine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating cine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(cine);
            }
        });
    });
}

exports.deleteCine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting cine: ' + id);
    db.collection('cines', function(err, collection) {
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

    var cines = [
        {
            name: "ocine",
            direction: "Rambla 11 de setembre",
            city: "Girona",
            phone: "972972972",
            email: "ocine@ocine.com",
            latitud: "41.992033",
            longitud: "2.818851",
            vote_sum: 0,
            votes: 0
        }];

    db.collection('cines', function(err, collection) {
        collection.insert(cines, {safe:true}, function(err, result) {});
    });

};