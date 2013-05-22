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

    var films = [
     {
     "title": "Todos los días de mi vida",
     "original_title": "The Vow",
     "duration": "104",
     "director": "Michael Sucsy",
     "cast": " Rachel McAdams, Channing Tatum, Jessica Lange",
     "trailer": "7JoXHO3ceUY",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-03-23",
     "review": "A car accident puts Paige in a coma, and when she wakes up with severe memory loss, her husband Leo works to win her heart again.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjE1OTU5MjU0N15BMl5BanBnXkFtZTcwMzI3OTU5Ng@@._V1_SX214_.jpg"
     },
     {
     "title": "Querido John",
     "original_title": "Dear John",
     "duration": "108",
     "director": "Lasse Hallström",
     "cast": " Channing Tatum, Amanda Seyfried, Richard Jenkins",
     "trailer": "NLkTKkNXDp4",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2010-04-23",
     "review": "A romantic drama about a soldier who falls for a conservative college student while he's home on leave.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTk1NDEzMTU5NV5BMl5BanBnXkFtZTcwNTI3MTk5Mg@@._V1_SX214_.jpg"
     },
     {
     "title": "El diario de Noa",
     "original_title": "The Notebook",
     "duration": "123",
     "director": "Nick Cassavetes",
     "cast": "Gena Rowlands, James Garner, Ryan Gosling",
     "trailer": "S3G3fILPQAU",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2004-10-22",
     "review": "A poor and passionate young man falls in love with a rich young woman and gives her a sense of freedom. They soon are separated by their social differences.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTk3OTM5Njg5M15BMl5BanBnXkFtZTYwMzA0ODI3._V1_SX214_.jpg"
     },
     {
     "title": "Un lugar donde refugiarse",
     "original_title": "Safe Haven",
     "duration": "115",
     "director": "LasseHallström",
     "cast": "Julianne Hough, David Lyons, Josh Duhamel",
     "trailer": "q3y8fFPPgdA",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-04-19",
     "review": "A young woman with a mysterious past lands in Southport, North Carolina where her bond with a widower forces her to confront the dark secret that haunts her.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTg4MzcxODA3OV5BMl5BanBnXkFtZTcwMTYzNDkwOQ@@._V1_SX214_.jpg"
     },
     {
     "title": "La vida es bella",
     "original_title": "La vita è bella",
     "duration": "116",
     "director": "Roberto Benigni, Rod Dean",
     "cast": " Roberto Benigni, Nicoletta Braschi, Giorgio Cantarini",
     "trailer": "pysuUJhOnv4",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "1999-02-26",
     "review": "A Jewish man has a wonderful romance with the help of his humour, but must use that same quality to protect his son in a Nazi death camp.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTM3NDg0OTkxOV5BMl5BanBnXkFtZTcwMTk2NzIyMQ@@._V1_SY317_CR4,0,214,317_.jpg"
     },
     {
     "title": "La última canción",
     "original_title": "The Last Song",
     "duration": "107",
     "director": "Julie Anne Robinson",
     "cast": "Miley Cyrus, Greg Kinnear, Bobby Coleman",
     "trailer": "WwLmQqRanvM",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2010-04-16",
     "review": "A drama centered on a rebellious girl who is sent to a Southern beach town for the summer to stay with her father. Through their mutual love of music, the estranged duo learn to reconnect.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjA5NjM5MDA0M15BMl5BanBnXkFtZTcwMjg2NzQwMw@@._V1_SX214_.jpg"
     },
     {
     "title": "Efectos secundarios",
     "original_title": "Side Effectes",
     "duration": "106",
     "director": "Steven Soderbergh",
     "cast": "Rooney Mara, Channing Tatum, Jude Law",
     "trailer": "EFEou3MBLi4",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-04-05",
     "review": "A young woman's world unravels when a drug prescribed by her psychiatrist has unexpected side effects.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTc2MzY0NDAwOF5BMl5BanBnXkFtZTcwMTE1Mzc4OA@@._V1_SY317_CR0,0,214,317_.jpg"
     },
     {
     "title": "El lado bueno de las cosas",
     "original_title": "Silver Linings Playbook",
     "duration": "122",
     "director": "David O. Russell",
     "cast": "Bradley Cooper, Jennifer Lawrence, Robert De Niro",
     "trailer": "Lj5_FhLaaQQ",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-01-25",
     "review": "After a stint in a mental institution, former teacher Pat Solitano moves back in with his parents and tries to reconcile with his ex-wife. Things get more challenging when Pat meets Tiffany, a mysterious girl with problems of her own.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTM2MTI5NzA3MF5BMl5BanBnXkFtZTcwODExNTc0OA@@._V1_SX214_.jpg"
     },
     {
     "title": "Cruce de caminos",
     "original_title": "The Place Beyond the Pines",
     "duration": "140",
     "director": "Derek Cianfrance",
     "cast": " Ryan Gosling, Eva Mendes, Anthony Pizza",
     "trailer": "G07pSbHLXgg",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-03-29",
     "review": "A motorcycle stunt rider turns to robbing banks as a way to provide for his lover and their newborn child, a decision that puts him on a collision course with an ambitious rookie cop navigating a department ruled by a corrupt detective.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjc1OTEwNjU4N15BMl5BanBnXkFtZTcwNzUzNDIwOQ@@._V1_SX214_.jpg"
     },
     {
     "title": "Los miserables",
     "original_title": "Les Misérables",
     "duration": "158",
     "director": "Tom Hooper",
     "cast": "Hugh Jackman, Russell Crowe, Anne Hathaway",
     "trailer": "IuEFm84s4oI",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-12-25",
     "review": "In 19th-century France, Jean Valjean, who for decades has been hunted by the ruthless policeman Javert after he breaks parole, agrees to care for factory worker Fantine's daughter, Cosette. The fateful decision changes their lives forever.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTQ4NDI3NDg4M15BMl5BanBnXkFtZTcwMjY5OTI1OA@@._V1_SX214_.jpg"
     },
     {
     "title": "Lo imposible",
     "original_title": "The impossible",
     "duration": "114",
     "director": "Juan Antonio Bayona",
     "cast": "Naomi Watts, Ewan McGregor, Tom Holland ",
     "trailer": "gfve6tSfMXA",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-10-11",
     "review": "The story of a tourist family in Thailand caught in the destruction and chaotic aftermath of the 2004 Indian Ocean tsunami.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjA5NTA3NzQ5Nl5BMl5BanBnXkFtZTcwOTYxNjY0OA@@._V1_SX214_.jpg"
     },
     {
     "title": "Argo",
     "original_title": "Argo",
     "duration": "120",
     "director": "Ben Affleck",
     "cast": "Ben Affleck, Bryan Cranston, Alan Arkin",
     "trailer": "w918Eh3fij0",
     "typeFilm": "519b9b414195bc5c17000006",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-10-26",
     "review": "A dramatization of the 1980 joint CIA-Canadian secret operation to extract six fugitive American diplomatic personnel out of revolutionary Iran.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTc3MjI0MjM0NF5BMl5BanBnXkFtZTcwMTYxMTQ1OA@@._V1_SY317_CR0,0,214,317_.jpg"
     },
     {
     "title": "Iron Man 3",
     "original_title": "Iron Man 3",
     "duration": "130",
     "director": "Shane Black",
     "cast": "Robert Downey Jr., Gwyneth Paltrow, Don Cheadle",
     "trailer": "AtYYj2FF9Jw",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-04-26",
     "review": "When Tony Stark's world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjIzMzAzMjQyM15BMl5BanBnXkFtZTcwNzM2NjcyOQ@@._V1_SX214_.jpg"
     },
     {
     "title": "Los vengadores",
     "original_title": "The Avengers",
     "duration": "143",
     "director": "Joss Whedon",
     "cast": "Robert Downey Jr., Chris Evans, Scarlett Johansson",
     "trailer": "eOrNdBpGMv8",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-04-27",
     "review": "Nick Fury of S.H.I.E.L.D. brings together a team of super humans to form The Avengers to help save the Earth from Loki and his army.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTk2NTI1MTU4N15BMl5BanBnXkFtZTcwODg0OTY0Nw@@._V1_SY317_CR0,0,214,317_.jpg"
     },
     {
     "title": "Brigada de élite",
     "original_title": "Gangster Squad",
     "duration": "113",
     "director": "Ruben Fleischer",
     "cast": " Sean Penn, Ryan Gosling, Emma Stone",
     "trailer": "qilrVR0miPU",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-02-08",
     "review": "Los Angeles, 1949: A secret crew of police officers led by two determined sergeants work together in an effort to take down the ruthless mob king Mickey Cohen who runs the city.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTcwMjAyMTUzMl5BMl5BanBnXkFtZTcwODgxNzk1OA@@._V1_SY317_CR0,0,214,317_.jpg"
     },
     {
     "title": "Iron Man",
     "original_title": "Iron Man",
     "duration": "126",
     "director": "Jon Favreau",
     "cast": "Robert Downey Jr., Terrence Howard, Jeff Bridges",
     "trailer": "8hYlB38asDY",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2008-04-30",
     "review": "When wealthy industrialist Tony Stark is forced to build an armored suit after a life-threatening incident, he ultimately decides to use its technology to fight against evil.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX214_.jpg"
     },
     {
     "title": "xXx",
     "original_title": "xXx",
     "duration": "124",
     "director": "Rob Cohen",
     "cast": " Vin Diesel, Asia Argento, Marton Csokas",
     "trailer": "77ugzcqPoAI",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2002-10-18",
     "review": "ander Cage is an extreme sports athelete recruited by the government on a special mission.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTIyOTM5MzkzMF5BMl5BanBnXkFtZTYwOTk5OTc5._V1_SY317_CR3,0,214,317_.jpg"
     },
     {
     "title": "Los juegos del hambre",
     "original_title": "The Hunger Games",
     "duration": "142",
     "director": "Gary Ross",
     "cast": "Stanley Tucci, Jennifer Lawrence, Liam Hemsworth",
     "trailer": "SMGRhAEn6K0",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-04-20",
     "review": "Katniss Everdeen voluntarily takes her younger sister's place in the Hunger Games, a televised fight to the death in which two teenagers from each of the twelve Districts of Panem are chosen at random to compete.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjA4NDg3NzYxMF5BMl5BanBnXkFtZTcwNTgyNzkyNw@@._V1_SX214_.jpg"
     },
     {
     "title": "El caballero oscuro: La leyenda renace",
     "original_title": "The Dark Knight Rises",
     "duration": "165",
     "director": "Christopher Nolan",
     "cast": "Christian Bale, Gary Oldman, Tom Hardy",
     "trailer": "g8evyE9TuYk",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-07-20",
     "review": "Eight years on, a new evil rises from where the Batman and Commissioner Gordon tried to bury it, causing the Batman to resurface and fight to protect Gotham City... the very city which brands him an enemy.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_SX214_.jpg"
     },
     {
     "title": "Looper",
     "original_title": "Looper",
     "duration": "119",
     "director": "Rian Johnson",
     "cast": "Joseph Gordon-Levitt, Bruce Willis, Emily Blunt",
     "trailer": "2iQuhsmtfHw",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-10-19",
     "review": "In 2074, when the mob wants to get rid of someone, the target is sent 30 years into the past, where a hired gun awaits. Someone like Joe, who one day learns the mob wants to 'close the loop' by transporting back Joe's future self.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTY3NTY0MjEwNV5BMl5BanBnXkFtZTcwNTE3NDA1OA@@._V1_SY317_CR15,0,214,317_.jpg"
     },
     {
     "title": "Star Trek",
     "original_title": "Star Trek",
     "duration": "127",
     "director": " J.J. Abrams",
     "cast": "Chris Pine, Zachary Quinto, Leonard Nimoy",
     "trailer": "fdneFmLn0Sg",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2009-05-08",
     "review": "The brash James T. Kirk tries to live up to his father's legacy with Mr. Spock keeping him in check as a vengeful, time-traveling Romulan creates black holes to destroy the Federation one planet at a time.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjE5NDQ5OTE4Ml5BMl5BanBnXkFtZTcwOTE3NDIzMw@@._V1_SX214_.jpg"
     },
     {
     "title": "Oblivion",
     "original_title": "Oblivion",
     "duration": "124",
     "director": " Joseph Kosinski",
     "cast": "Tom Cruise, Morgan Freeman, Olga Kurylenko",
     "trailer": "dQ3Mt9yiz6k",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-04-12",
     "review": "A veteran assigned to extract Earth's remaining resources begins to question what he knows about his mission and himself.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTQwMDY0MTA4MF5BMl5BanBnXkFtZTcwNzI3MDgxOQ@@._V1_SX214_.jpg"
     },
     {
     "title": "A todo gas 6",
     "original_title": "Fast & Furious 6",
     "duration": "120",
     "director": "Justin Lin",
     "cast": " Dwayne Johnson, Vin Diesel, Paul Walker",
     "trailer": "C_puVuHoR6o",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-05-24",
     "review": "Agent Luke Hobbs enlists Dominic Toretto and his team to bring down former Special Ops soldier Owen Shaw, leader of a unit specializing in vehicular warfare.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTM3NTg2NDQzOF5BMl5BanBnXkFtZTcwNjc2NzQzOQ@@._V1_SX214_.jpg"
     },
     {
     "title": "El hombre de acero",
     "original_title": "Man of Steel",
     "duration": "148",
     "director": "Zack Snyder",
     "cast": "Henry Cavill, Amy Adams, Russell Crowe",
     "trailer": "T6DJcgm3wNY",
     "typeFilm": "519b9b414195bc5c17000004",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-06-21",
     "review": "A young journalist is forced to confront his secret extraterrestrial heritage when Earth is invaded by members of his race.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjI5OTYzNjI0Ml5BMl5BanBnXkFtZTcwMzM1NDA1OQ@@._V1_SY317_CR1,0,214,317_.jpg"
     },
     {
     "title": "¡Rompe Ralph!",
     "original_title": "Wreck-It Ralph",
     "duration": "108",
     "director": "Rich Moore",
     "cast": "John C. Reilly, Sarah Silverman, Jack McBrayer ",
     "trailer": "87E6N7ToCxs",
     "typeFilm": "519b9b414195bc5c17000007",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-12-25",
     "review": "A video game villain wants to be a hero and sets out to fulfill his dream, but his quest brings havoc to the whole arcade where he lives.",
     "image": "http://ia.media-imdb.com/images/M/MV5BNzMxNTExOTkyMF5BMl5BanBnXkFtZTcwMzEyNDc0OA@@._V1_SX214_.jpg"
     },
     {
     "title": "Epic: El reino secreto",
     "original_title": "Epic",
     "duration": "102",
     "director": "Chris Wedge",
     "cast": "Colin Farrell, Josh Hutcherson, Beyoncé Knowles",
     "trailer": "iUdeQiQejyg",
     "typeFilm": "519b9b414195bc5c17000007",
     "dataFilm": "2013-08-30",
     "review": "A teenager finds herself transported to a deep forest setting where a battle between the forces of good and the forces of evil is taking place. She bands together with a rag-tag group characters in order to save their world -- and ours.",
     "vote_sum": "0",
     "votes": "0"
     },
     {
     "title": "Los increíbles",
     "original_title": "The Incredibles",
     "duration": "115",
     "director": "Brad Bird",
     "cast": " Craig T. Nelson, Holly Hunter, Samuel L. Jackson",
     "trailer": "eZbzbC9285I",
     "typeFilm": "519b9b414195bc5c17000007",
     "dataFilm": "2004-11-26",
     "review": "A family of undercover superheroes, while trying to live the quiet suburban life, are forced into action to save the world.",
     "vote_sum": "0",
     "votes": "0"
     },
     {
     "title": "Indomable",
     "original_title": "Brave",
     "duration": "93",
     "director": "Mark Andrews, Brenda Chapman",
     "cast": " Kelly Macdonald, Billy Connolly, Emma Thompson",
     "trailer": "0gc36idTb3c",
     "typeFilm": "519b9b414195bc5c17000007",
     "dataFilm": "2012-08-10",
     "review": "Determined to make her own path in life, Princess Merida defies a custom that brings chaos to her kingdom. Granted one wish, Merida must rely on her bravery and her archery skills to undo a beastly curse.",
     "vote_sum": "0",
     "votes": "0"
     },
     {
     "title": "El rey león",
     "original_title": "The Lion King",
     "duration": "89",
     "director": "Roger Allers, Rob Minkoff",
     "cast": "Matthew Broderick, James Earl Jones, Jeremy Irons",
     "trailer": "jOIu472cCq0",
     "typeFilm": "519b9b414195bc5c17000007",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "1994-11-08",
     "review": "Tricked into thinking he killed his father, a guilt ridden lion cub flees into exile and abandons his identity as the future King.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjEyMzgwNTUzMl5BMl5BanBnXkFtZTcwNTMxMzM3Ng@@._V1_SY317_CR15,0,214,317_.jpg"
     },
     {
     "title": "Enredados",
     "original_title": "Tangled",
     "duration": "100",
     "director": "Nathan Greno, Byron Howard",
     "cast": "Mandy Moore, Zachary Levi, Donna Murphy ",
     "trailer": "sSx1dYJlJh4",
     "typeFilm": "519b9b414195bc5c17000007",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2011-02-04",
     "review": "The magically long-haired Rapunzel has spent her entire life in a tower, but now that a runaway thief has stumbled upon her, she is about to discover the world for the first time, and who she really is.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjA5NzMwMjA0OV5BMl5BanBnXkFtZTcwNDMzMzc5Mw@@._V1_SX214_.jpg"
     },
     {
     "title": "Ted",
     "original_title": "Ted",
     "duration": "106",
     "director": "Seth MacFarlane",
     "cast": " Mark Wahlberg, Mila Kunis, Seth MacFarlane",
     "trailer": "9fbo_pQvU7M",
     "typeFilm": "519b9b414195bc5c17000005",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-08-10",
     "review": "As the result of a childhood wish, John Bennett's teddy bear, Ted, came to life and has been by John's side ever since - a friendship that's tested when Lori, John's girlfriend of four years, wants more from their relationship.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTQ1OTU0ODcxMV5BMl5BanBnXkFtZTcwOTMxNTUwOA@@._V1_SX214_.jpg"
     },
     {
     "title": "Scary Movie 5",
     "original_title": "Scary MoVie",
     "duration": "86",
     "director": "Malcolm D. Lee",
     "cast": "Ashley Tisdale, Simon Rex, Charlie Sheen",
     "trailer": "RMDZ8M47j0I",
     "typeFilm": "519b9b414195bc5c17000005",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-05-01",
     "review": "A couple begin to experience some unusual activity after bringing their newborn son home from the hospital. With the help of home-surveillance cameras and a team of experts, they learn they're being stalked by a nefarious demon.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTc5OTIxMjQ4NF5BMl5BanBnXkFtZTcwOTAyNDcyOQ@@._V1_SY317_CR0,0,214,317_.jpg"
     },
     {
     "title": "Intocable",
     "original_title": "Intouchables",
     "duration": "112",
     "director": " Olivier Nakache, Eric Toledano",
     "cast": " François Cluzet, Omar Sy, Anne Le Ny",
     "trailer": "34WIbmXkewU",
     "typeFilm": "519b9b414195bc5c17000005",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-03-09",
     "review": "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caretaker.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_SX214_.jpg"
     },
     {
     "title": "Memorias de un zombie adolescente",
     "original_title": "Warm Bodies",
     "duration": "98",
     "director": "Jonathan Levine",
     "cast": " Nicholas Hoult, Teresa Palmer, Analeigh Tipton",
     "trailer": "07s-cNFffDM",
     "typeFilm": "519b9b414195bc5c17000005",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-04-19",
     "review": "After R (a highly unusual zombie) saves Julie from an attack, the two form a relationship that sets in motion a sequence of events that might transform the entire lifeless world.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTQ4MjY2MjMzOV5BMl5BanBnXkFtZTcwMDUxNzIwOQ@@._V1_SX214_.jpg"
     },
     {
     "title": "Por la cara",
     "original_title": "Identity Thief",
     "duration": "111",
     "director": "Seth Gordon",
     "cast": " Jason Bateman, Melissa McCarthy, Amanda Peet",
     "trailer": "GqQg6Rlt6W4",
     "typeFilm": "519b9b414195bc5c17000005",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-03-22",
     "review": "Mild-mannered businessman Sandy Patterson travels from Denver to Miami to confront the deceptively harmless-looking woman who has been living it up after stealing Sandy's identity.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTY3NzM5MTk2Nl5BMl5BanBnXkFtZTcwMDQ4MjQ3OA@@._V1_SX214_.jpg"
     },
     {
     "title": "Resacón en Las Vegas",
     "original_title": "The Hangover",
     "duration": "100",
     "director": "Todd Phillips",
     "cast": "Bradley Cooper, Ed Helms, Zach Galifianakis",
     "trailer": "vhFVZsk3XEs",
     "typeFilm": "519b9b414195bc5c17000005",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2009-08-14",
     "review": "A Las Vegas-set comedy centered around three groomsmen who lose their about-to-be-wed buddy during their drunken misadventures, then must retrace their steps in order to find him.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTU1MDA1MTYwMF5BMl5BanBnXkFtZTcwMDcxMzA1Mg@@._V1_SX214_.jpg"
     },
     {
     "title": "Gravity",
     "original_title": "Gravity",
     "duration": "-",
     "director": "Alfonso Cuarón",
     "cast": " Sandra Bullock, George Clooney, Basher Savage",
     "trailer": "rjb0kD-yht4",
     "typeFilm": "519b9b414195bc5c17000008",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-10-04",
     "review": "Astronauts attempt to return to earth after debris crashes into their space shuttle, leaving them drifting alone in space.",
     "image": "http://ia.media-imdb.com/images/M/MV5BNjE5MzYwMzYxMF5BMl5BanBnXkFtZTcwOTk4MTk0OQ@@._V1_SY317_CR0,0,214,317_.jpg"
     },
     {
     "title": "Prometheus",
     "original_title": "Prometheus",
     "duration": "124",
     "director": "Ridley Scott",
     "cast": "Noomi Rapace, Michael Fassbender, Charlize Theron",
     "trailer": "sftuxbvGwiU",
     "typeFilm": "519b9b414195bc5c17000008",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-08-03",
     "review": "A team of explorers discover a clue to the origins of mankind on Earth, leading them on a journey to the darkest corners of the universe. There, they must fight a terrifying battle to save the future of the human race.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTY3NzIyNTA2NV5BMl5BanBnXkFtZTcwNzE2NjI4Nw@@._V1_SX214_.jpg"
     },
     {
     "title": "El atlas de las nubes ",
     "original_title": "Cloud Atlas",
     "duration": "172",
     "director": "Tom Tykwer, Andy Wachowski",
     "cast": "Tom Hanks, Halle Berry, Hugo Weaving",
     "trailer": "hWnAqFyaQ5s",
     "typeFilm": "519b9b414195bc5c17000008",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-02-22",
     "review": "An exploration of how the actions of individual lives impact one another in the past, present and future, as one soul is shaped from a killer into a hero, and an act of kindness ripples across centuries to inspire a revolution.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTczMTgxMjc4NF5BMl5BanBnXkFtZTcwNjM5MTA2OA@@._V1_SX214_.jpg"
     },
     {
     "title": "Origen",
     "original_title": "Inception",
     "duration": "148",
     "director": "Christopher Nolan",
     "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
     "trailer": "66TuSJo4dZM",
     "typeFilm": "519b9b414195bc5c17000008",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2010-08-06",
     "review": "A skilled extractor is offered a chance to regain his old life as payment for a task considered to be impossible.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX214_.jpg"
     },
     {
     "title": "The Collection ",
     "original_title": "The Collection ",
     "duration": "82",
     "director": "Marcus Dunstan",
     "cast": " Josh Stewart, Emma Fitzpatrick, Christopher McDonald",
     "trailer": "n08aIH-Bhcc",
     "typeFilm": "519b9b414195bc5c17000009",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2013-07-05",
     "review": "A man who escapes from the vicious grips of the serial killer known as \"The Collector\" is blackmailed to rescue an innocent girl from the killer's booby-trapped warehouse.",
     "image": "http://ia.media-imdb.com/images/M/MV5BODQ0MDgzNDA0NV5BMl5BanBnXkFtZTcwNDM4MDQ1OA@@._V1_SX214_.jpg"
     },
     {
     "title": "El Hobbit: Un viaje inesperado",
     "original_title": "The Hobbit: An Unexpected Journey",
     "duration": "169",
     "director": "Peter Jackson",
     "cast": " Ian McKellen, Martin Freeman, Richard Armitage",
     "trailer": "SDnYMbYB-nU",
     "typeFilm": "519b9b414195bc5c17000009",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2012-12-14",
     "review": "A younger and more reluctant Hobbit, Bilbo Baggins, sets out on an \"unexpected journey\" to the Lonely Mountain with a spirited group of Dwarves to reclaim their stolen mountain home from a dragon named Smaug.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMTcwNTE4MTUxMl5BMl5BanBnXkFtZTcwMDIyODM4OA@@._V1_SX214_.jpg"
     },
     {
     "title": "Memento",
     "original_title": "Memento",
     "duration": "113",
     "director": "Christopher Nolan",
     "cast": "Guy Pearce, Carrie-Anne Moss, Joe Pantoliano",
     "trailer": "mV9l1enMqvk",
     "typeFilm": "519b9b414195bc5c17000009",
     "vote_sum": "0",
     "votes": "0",
     "dataFilm": "2001-01-19",
     "review": "A man, suffering from short-term memory loss, uses notes and tattoos to hunt for the man he thinks killed his wife.",
     "image": "http://ia.media-imdb.com/images/M/MV5BMjA3MTkzMzI3N15BMl5BanBnXkFtZTcwNzYwMzQ4MQ@@._V1_SX214_.jpg"
     }];

    db.collection('films', function(err, collection) {
        collection.insert(films, {safe:true}, function(err, result) {});
    });

};