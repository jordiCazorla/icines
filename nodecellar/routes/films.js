var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('filmsdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'filmsdb' database");
        db.collection('films', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'films' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving films: ' + id);
    db.collection('films', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByIdType = function(req, res) {
    var idType = req.params.idType;
    console.log('Retrieving films: ' + idType);
    db.collection('films', function(err, collection) {
        collection.find({typeFilm: idType}).toArray(function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('films', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addFilm = function(req, res) {
    var film = req.body;
    console.log('Adding film: ' + JSON.stringify(film));
    db.collection('films', function(err, collection) {
        collection.insert(film, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateFilm = function(req, res) {
    var id = req.params.id;
    var film = req.body;
    console.log('Updating film: ' + id);
    console.log(JSON.stringify(film));
    db.collection('films', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, film, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating film: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(film);
            }
        });
    });
}

exports.deleteFilm = function(req, res) {
    var id = req.params.id;
    console.log('Deleting film: ' + id);
    db.collection('films', function(err, collection) {
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

    /*var films = [
        {
        }];

    db.collection('films', function(err, collection) {
        collection.insert(films, {safe:true}, function(err, result) {});
    });*/

};