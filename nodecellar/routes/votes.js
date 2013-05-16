var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('votedb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'votedb' database");
        db.collection('votes', {safe:true}, function(err, collection) {
            //if (err) {
                console.log("The 'votes' collection doesn't exist. Creating it with sample data...");
                populateDB();
            //}
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving vote: ' + id);
    db.collection('votes', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('votes', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addVote = function(req, res) {
    var vote = req.body;
    console.log('Adding vote: ' + JSON.stringify(vote));
    db.collection('votes', function(err, collection) {
        collection.insert(vote, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateVote = function(req, res) {
    var id = req.params.id;
    var vote = req.body;
    console.log('Updating vote: ' + id);
    console.log(JSON.stringify(vote));
    db.collection('votes', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, vote, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating vote: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(vote);
            }
        });
    });
}

exports.deleteVote = function(req, res) {
    var id = req.params.id;
    console.log('Deleting vote: ' + id);
    db.collection('votes', function(err, collection) {
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

exports.findByElementAndUser = function(req, res){
    var element_id = req.params.element_id;
    var user_id = req.params.user_id;
    db.collection('votes', function(err, collection) {
        collection.findOne({element_id: element_id, user_id: user_id}, function(err, item) {
            if (item != null) {
                res.send(item);
            } else {
                res.send({'error': 'error'});
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    /*var votes = [
        {
            element_id: ,
            user_id: ,
            vote:
        }];

    db.collection('votes', function(err, collection) {
        collection.insert(votes, {safe:true}, function(err, result) {});
    });*/

};