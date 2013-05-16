var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('imagesdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'imagesdb' database");
        db.collection('images', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'images' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving images: ' + id);
    db.collection('images', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('images', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addImage = function(req, res) {
    var image = req.body;
    console.log('Adding image: ' + JSON.stringify(image));
    db.collection('images', function(err, collection) {
        collection.insert(image, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateImage = function(req, res) {
    var id = req.params.id;
    var image = req.body;
    console.log('Updating image: ' + id);
    console.log(JSON.stringify(image));
    db.collection('images', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, image, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating image: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(image);
            }
        });
    });
}

exports.deleteImage = function(req, res) {
    var id = req.params.id;
    console.log('Deleting image: ' + id);
    db.collection('images', function(err, collection) {
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

    /*var images = [
        {
        url
        }];

    db.collection('images', function(err, collection) {
        collection.insert(images, {safe:true}, function(err, result) {});
    });*/

};