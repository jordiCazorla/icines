/**
 * Created with JetBrains WebStorm.
 * User: Randos
 * Date: 18/05/13
 * Time: 19:33
 * To change this template use File | Settings | File Templates.
 */
function veureGeneres() {
    amagar();

    desactivarMenus();
    $('#menu_pelicules').addClass('active');

    var typeFilms;
    var llistat = '<div id="inici-generes">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="" class="active2">Pel·lícules</a>' +
        '</div>';

    $.getJSON( 'typefilm', {sync: true}, function(data) {
        var typefilms = data;
        var position = '';
        var op;
        //TODO: Per cada un s'haurà de fer una petició
        for(var i=0; i < data.length; i++){
            op = i % 3;
            if (op == 0){
                position = 'first';
                if(i == 3) llistat = llistat + '<div class="menu-conent-boxes" id="second-line">';
                else llistat = llistat + '<div class="menu-conent-boxes">';
            }else if(op == 1) position = 'middle';
            else position = 'last';
            llistat = llistat + '<div class="box" id="'+position+'">'+
                '<img src="img/'+data[i].name+'.jpg" alt="" title="" width="267" height="172" />'+
                '<h3 class="title-box">'+data[i].name+'</h3><div id="genere_'+i+'"></div>' +
                '<span class="small_button_box"><a class="script_function" onclick="javascript:veurePelicules(\''+data[i]._id +'\',\''+data[i].name+'\')">Veure Pel·lícules</a></span>' +
                '</div>'
            if (op == 2) llistat = llistat + '</div>';
        }
        llistat = llistat + '</div>' + '</div>';
        $('#main').append(llistat);
        for(var j=0; j < data.length; j++){
            $.getJSON('filmByType/' + data[j]._id, function(pos) {
                return function(films_result){
                    var llistat_pelis = '';
                    if(films_result.length == 0){
                        llistat_pelis = llistat_pelis + 'No hi ha resultats';
                    }else{
                        llistat_pelis = llistat_pelis + '<ol>';
                        var max = 5;
                        if(films_result.length < max){
                            max = films_result.length;
                        }
                        films_result.sort(compare_film_rating);
                        for(var z = 0; z < max; z++){
                            llistat_pelis = llistat_pelis + '<li><a class="script_function" onclick="javascript:veurePelicula(\''+films_result[z]._id+'\',\''+data[pos].name+'\')">' + films_result[z].title + '</a></li>';
                        }
                        llistat_pelis = llistat_pelis + '</ol>';
                    }
                    $('#genere_' + pos).append(llistat_pelis);
                }
            }(j)
            );
        }
    });
}

function veurePelicules(genereId, genereNom){
    amagar();

    desactivarMenus();
    $('#menu_pelicules').addClass('active');

    var films;
    var llistat = '<div id="inici-pelicules">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureGeneres()">Pel·lícules</a> > <a class="active2" onclick="">'+genereNom+'</a>' +
        '</div>';

    $.getJSON( 'filmByType/'+genereId, function(data) {
        var films = data;
        if (films.length == 0) {
            llistat = llistat + '<div>No tenim pelicules</div>';
        }else{
            //TODO: Per cada un s'haurà de fer una petició
            for(var i=0; i < films.length; i++){
                if(i == 0)    llistat = llistat + '<div class="film-list" ><ul>';

                llistat = llistat + '<li><a class="script_function" onclick="javascript:veurePelicula(\''+films[i]._id+'\',\''+genereNom+'\')">'+films[i].title+'</a> (<a class="script_function" onclick="javascript:veurePelicula(\''+films[i]._id+'\',\''+genereNom+'\')">'+films[i].original_title+'</a>) </li>';

                if(i == films.length-1) llistat = llistat + '</ul></div>'
            }
        }
        llistat = llistat + '</div>' ;
        $('#main').append(llistat);
    });
}

function veurePelicula(peliculaId, genereNom){
    amagar();
    var film;
    var llistat;

    $.getJSON( 'films/'+peliculaId, function(data) {
        var film = data;
        var rating = parseInt(film.vote_sum) + 0.0;
        if (film.votes != 0){
            rating = rating / film.votes;
        }

        llistat = '<div id="inici-pelicula">' +
            '<div class="breadcrumb">' +
            '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureGeneres()">Pel·lícules</a> > <a class="active2" onclick="javascript:veurePelicules(\''+film.typeFilm+'\',\''+genereNom+'\')">'+genereNom+'</a>' +
            '</div>';

        llistat = llistat + '<div class="pelicula">' +
            '<div class="pelicula-image"><img height="325" width="220" src="'+film.image+'"/></div>' +
            '<div class="pelicula-info">' +
            '<div class="pelicula-title">'+film.title+'</div>' +
            '<div class="pelicula-original-title">'+film.original_title+' (original title)</div>' +
            '<br/>' +
            '<div class="pelicula-duration"><span>Durada:</span> '+film.duration+'</div>' +
            '<div class="pelicula-director"><span>Director:</span> '+film.director+'</div>' +
            '<div class="pelicula-cast"><span>Actors:</span> '+film.cast+'</div>' +
            '<div class="pelicula-type"><span>Genere:</span> <a onclick="javascript:veurePelicules(\''+film.typeFilm+'\',\''+genereNom+'\')">'+genereNom+'</a></div>' +
            '<div class="pelicula-data"><span>Estrena:</span> '+film.dataFilm+'</div>' +
            '<div class="pelicula-rating"><span>Puntuació:</span> '+ (rating == 0? '-' : rating) +'</div>' +
            '<div class="pelicula-review"><span>Sinopsis:</span> '+film.review+'</div>' +
            '</div>' +
            '<div class="votar-film" id="votar-film">Votar: ';
        if(globalUser == null){
            llistat = llistat + '<input type="radio" name="votes" value="1" checked=true> 1 </input>' +
                '<input type="radio" name="votes" value="2"> 2 </input>' +
                '<input type="radio" name="votes" value="3"> 3 </input>' +
                '<input type="radio" name="votes" value="4"> 4 </input>' +
                '<input type="radio" name="votes" value="5"> 5 </input>' +
                '<input class="button-login" type="button" value="Votar" onclick="javascript:votarPelicula(\''+film._id+'\',\''+genereNom+'\')" style="float:none; right:0"/>' +
                '</div>' +
                '<div class="pelicula-trailer"><iframe type="text/html" width="640" height="385" src="http://www.youtube.com/embed/' + film.trailer + '" frameborder="0"></iframe></div>' +
                '</div>';
            $.getJSON('commentsByElem/'+peliculaId, function(data) {
                llistat = llistat + '<div class="comments_peli">'+
                    '<div class="comment_title">Comentaris:</div>';
                for(var i=0; i < data.length; i++){
                    llistat = llistat + '<div class="comment">'+data[i].comment+'</div>';
                }
                llistat = llistat + '<div class="addComment"><textarea id="addComment"></textarea><br/><button onclick="javascript:comentarPelicula(\''+film._id+'\')">Comentar</button></div>' +
                    '</div>';
                llistat = llistat + '</div>';
                $('#main').append(llistat);
            });

        }
        else{
            $.getJSON("votesByElemUser/" + film._id + "/" + globalUser._id, function(vote){
                if(vote.error){
                    llistat = llistat + '<input type="radio" name="votes" value="1" checked=true> 1 </input>' +
                        '<input type="radio" name="votes" value="2"> 2 </input>' +
                        '<input type="radio" name="votes" value="3"> 3 </input>' +
                        '<input type="radio" name="votes" value="4"> 4 </input>' +
                        '<input type="radio" name="votes" value="5"> 5 </input>' +
                        '<input class="button-login" type="button" value="Votar" onclick="javascript:votarPelicula(\''+film._id+'\',\''+genereNom+'\')" style="float:none; right:0"/>' +
                        '</div>' +
                        '<div class="pelicula-trailer"><iframe type="text/html" width="640" height="385" src="http://www.youtube.com/embed/' + film.trailer + '" frameborder="0"></iframe></div>' +
                        '</div>';
                    $.getJSON('commentsByElem/'+peliculaId, function(data) {
                        llistat = llistat + '<div class="comments_peli">'+
                            '<div class="comment_title">Comentaris:</div>';
                        for(var i=0; i < data.length; i++){
                            llistat = llistat + '<div class="comment">'+data[i].comment+'</div>';
                        }
                        llistat = llistat + '<div class="addComment"><textarea id="addComment"></textarea><br/><button onclick="javascript:comentarPelicula(\''+film._id+'\')">Comentar</button></div>' +
                            '</div>';
                        llistat = llistat + '</div>';
                        $('#main').append(llistat);
                    });
                }else{
                    for(var bucle = 1; bucle <= 5; bucle++){
                        if(bucle == vote.vote){
                            llistat = llistat + '<input type="radio" name="votes" value="' + bucle + '" checked> ' + bucle + ' </input>';
                        }
                        else{
                            llistat = llistat + '<input type="radio" name="votes" value="' + bucle + '"> ' + bucle + ' </input>';
                        }
                    }
                    llistat = llistat + '<input class="button-login" type="button" value="Votar" onclick="javascript:votarPelicula(\''+film._id+'\',\''+genereNom+'\')" style="float:none; right:0"/>' +
                        '</div>' +
                        '<div class="pelicula-trailer"><iframe type="text/html" width="640" height="385" src="http://www.youtube.com/embed/' + film.trailer + '" frameborder="0"></iframe></div>' +
                        '</div>';
                    $.getJSON('commentsByElem/'+peliculaId, function(data) {
                        llistat = llistat + '<div class="comments_peli">' +
                            '<div class="comment_title">Comentaris:</div>';
                        for(var i=0; i < data.length; i++){
                            llistat = llistat + '<div class="comment">'+data[i].comment+'</div>';
                        }
                        llistat = llistat + '<div class="addComment"><textarea id="addComment"></textarea><br/><button onclick="javascript:comentarPelicula(\''+film._id+'\')">Comentar</button></div>' +
                            '</div>';
                        llistat = llistat + '</div>';
                        $('#main').append(llistat);
                    });
                }
            });
        }
    });
}

function veureEstrenes(){
    amagar();

    desactivarMenus();
    $('#menu_estrenes').addClass('active');

    var llistat = '<div id="inici_estrenes">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a class="active2" onclick="javascript:veureEstrenes()">Estrenes</a>' +
        '</div>';

    llistat = llistat +
        '<div class="menu-conent-boxes">' +
        '<div class="box" id="first">' +
        '<h3 class="title-box">Estrenes de la setmana</h3>' +
        '<div class="film_list" id="estrenes"></div>' +
        '</div>' +
        '</div>' +
        '</div>';

    $('#main').append(llistat);

    $.getJSON('films', function(films_result) {
        var llistat_pelis = '';
        if(films_result.length == 0){
            llistat_pelis = llistat_pelis + 'No hi ha resultats';
            $('#estrenes').append(llistat_pelis);
        }else{

            var fi = false;
            var max = films_result.length;
            llistat_pelis = llistat_pelis + '<ol>';
            if(films_result.length > 1){
                films_result.sort(compare_film_date);
            }
            var t = new Date();
            var limit_date = new Date(t.getTime() - 604800000);
            var i = 0;
            while(i < max && !fi){
                $.ajax({
                    url: "typefilm/"+films_result[i].typeFilm,
                    async: false,
                    success: function(genere){

                        if(new Date(films_result[i].dataFilm)  < limit_date) fi = true;
                        else llistat_pelis = llistat_pelis + '<li><a class="script_function" onclick="javascript:veurePelicula(\''+films_result[i]._id+'\',\''+genere.name+'\')">' + films_result[i].title + '</a></li>';

                        i++;
                    }
                });
            }
            llistat_pelis = llistat_pelis + '</ol>';
            $('#estrenes').append(llistat_pelis);
        }
    });
}

function veureRanquings(){
    amagar();

    desactivarMenus();
    $('#menu_ranquing').addClass('active');

    var llistat = '<div id="inici_ranquings">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a class="active2" onclick="javascript:veureRanquings()">Rànquings</a>' +
        '</div>';

    div_id_ranquings = "best_films" + "_ranquings";
    div_id_cinemes = "best_films" + "_cinemes";

    llistat = llistat +
        '<div class="menu-conent-boxes">' +
        '<div class="ranquing_box" id="first">' +
        '<h3 class="title-box" style="text-decoration: underline; font-weight: bold;">Top 10 millor pelicula</h3>' +
        '<div class="film_list" id="' + div_id_ranquings + '"></div>' +
        '</div>' +
        '<div class="ranquing_box" id="last">' +
        '<h3 class="title-box" style="text-decoration: underline; font-weight: bold;">Top cinemes</h3>' +
        '<div class="film_list" id="' + div_id_cinemes + '"></div>' +
        '</div>'
    '</div>';

    bestFilm(10, div_id_ranquings);
    bestCinema(10, div_id_cinemes);

    llistat = llistat + '</div>';

    $('#main').append(llistat);
}

function bestFilm(numberFilms, div_id){
    $.getJSON('films', function(films_result) {
        var llistat_pelis = '';
        if(films_result.length == 0){
            llistat_pelis = llistat_pelis + 'No hi ha resultats';
            $('#'+div_id).append(llistat_pelis);
        }else{
            var max = numberFilms;
            if(films_result.length < max){
                max = films_result.length;
            }
            llistat_pelis = llistat_pelis + '<ol>';
            if(films_result.length > 1){
                films_result.sort(compare_film_rating);
            }
            for(var z = 0; z < max; z++){
                $.ajax({
                    url: "typefilm/"+films_result[z].typeFilm,
                    async: false,
                    success: function(genere){
                        llistat_pelis = llistat_pelis + '<li><a class="script_function" onclick="javascript:veurePelicula(\''+films_result[z]._id+'\',\''+genere.name+'\')">' + films_result[z].title + '</a></li>';
                    }
                });
            }
            llistat_pelis = llistat_pelis + '</ol>';
            $('#'+div_id).append(llistat_pelis);
        }
    });
}

function bestCinema(numberCinemes, div_id){
    $.getJSON('cines', function(cines_result) {
        var llistat_cines = '';
        if(cines_result.length == 0){
            llistat_cines = llistat_cines + 'No hi ha resultats';
            $('#'+div_id).append(llistat_cines);
        }else{
            var max = numberCinemes;
            if(cines_result.length < max){
                max = cines_result.length;
            }
            llistat_cines = llistat_cines + '<ol>';
            if(cines_result.length > 1){
                llistat_cines.sort(compare_film_rating);
                for(var z = 0; z < max; z++){
                    llistat_cines = llistat_cines + '<li>' + cines_result[z].name + '</li>';
                }
            }else{
                llistat_cines = llistat_cines + '<li>' + cines_result[0].name + '</li>';
            }
            llistat_cines = llistat_cines + '</ol>';
            $('#'+div_id).append(llistat_cines);
        }
    });
}

function showCinemes(){
    amagar();

    desactivarMenus();
    $('#menu_cartellera').addClass('active');
    var llistat = '<div id="inici_cartellera">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:showCinemes()">Cartellera</a>' +
        '</div>' +
        '<div class="menu-conent-boxes">' +
        '<div class="box" id="first">' +
        '<h3 class="title-box" style="text-decoration: underline; font-weight: bold;">Escull el cinema</h3>' +
        '<div class="film_list" id="cartellera_cinema_list">';
    $.getJSON('cines', function(cines_result) {
        if(cines_result.length == 0){
            llistat = llistat + 'No hi ha resultats';
        }else{
            var max = 10;
            if(cines_result.length < max){
                max = cines_result.length;
            }
            llistat = llistat + '<ol>';
            if(cines_result.length > 1){
                cines_result.sort(compare_film_rating);
                for(var z = 0; z < max; z++){
                    llistat = llistat + '<li><a onclick="javascript:cartelleraCinema('+"'" + cines_result[z]._id + "'" + ')">' + cines_result[z].name + '</a></li>';
                }
            }else{
                llistat = llistat + '<li><a onclick="javascript:cartelleraCinema('+"'" + cines_result[0]._id + "'" + ')">' + cines_result[0].name + '</a></li>';
            }
            llistat = llistat + '</ol>';
        }
        llistat = llistat + '</div></div></div></div>';
        $('#main').append(llistat);
    });
}

function cartelleraCinema(idCinema){
    amagar();
    desactivarMenus();
    $('#menu_cartellera').addClass('active');
    $.getJSON('cines/' + idCinema, function(cinema_result) {
        var llistat = '<div id="inici_cartellera_cinema">' +
            '<div class="breadcrumb">' +
            '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:showCinemes()">Cartellera</a>' +
            ' > <a class="active2" onclick="javascript:cartelleraCinema(' + "'" + idCinema + "'" + ')">'+ cinema_result.name +'</a>' +
            '</div>';

        llistat = llistat + '<h2>La cartellera de ' + cinema_result.name + ' és: </h2>';
        llistat = llistat + '<div id="general_content_cartellera"></div>';

        $.getJSON('findAllPeliFromCine/' + cinema_result._id, function(cartellera_result){
            for(var bucle = 0; bucle < cartellera_result.length; bucle++){
                $.getJSON('films/' + cartellera_result[bucle].peli_id, function(pelicula) {
                    var title = '<div id="cartellera_'+ pelicula._id + '"><h3 id="' + pelicula._id +'">' + pelicula.title + '</h3></div>';
                    $('#general_content_cartellera').append(title);
                    $.getJSON('findAllBillboard/' + cinema_result._id + "/" + pelicula._id, function(billboards){
                        for(var billboard_bucle = 0; billboard_bucle < billboards.length; billboard_bucle++){
                            $.getJSON('timetable/' + billboards[billboard_bucle].timetable_id, function(time){
                                var temps = '<li>' + time.time +'</li>';
                                $('#cartellera_'+pelicula._id).append(temps);
                            });
                        }
                    });
                });
            }
        });
        $('#main').append(llistat);




    });
}

function comentarPelicula(elementId){
    if(globalUser != null){
        var comment = $('#addComment').val();
        var nou_comentari = {
            element_id: elementId,
            comment:  comment
        };
        //Hem de crear
        $.post("comments",
            nou_comentari,
            function(final_result){
                if(!final_result.error){ //tot ha anat be
                    alert("dins del votar");
                    veurePelicula(elementId, genereNom);
                }
            },"json");
    }
    else{
        alert("Has d'estar logat per poder votar");
    }

}

function votarPelicula(id, genereNom){
    if(globalUser != null){
        var votacio = $('input[name=votes]:checked', '#votar-film').val();

        $.getJSON( 'films/'+id, function(film) {
            var votes = parseInt(film.votes) + 1;
            var vote_sum = parseInt(film.vote_sum) + parseInt(votacio);
            var data = {
                title: film.title,
                original_title: film.original_title,
                duration: film.duration,
                director: film.director,
                cast: film.cast,
                trailer: film.trailer,
                typeFilm: film.typeFilm,
                dataFilm: film.dataFilm,
                review: film.review,
                vote_sum: vote_sum,
                votes: votes
            };

            $.getJSON( 'votesByElemUser/'+film._id+'/'+globalUser._id, function(votation_result) {
                var nova_votacio = {
                    element_id: film._id,
                    user_id: globalUser._id,
                    vote:  parseInt(votacio)
                };
                if(!votation_result.error){
                    //Hem d'actualitzar
                    $.ajax({
                        url: '/votes/' + votation_result._id,
                        type: 'PUT',
                        data: nova_votacio,
                        success: function(result){
                            if(!result.error){ //tot ha anat be
                                data.vote_sum = data.vote_sum - votation_result.vote;
                                data.votes = data.votes - 1;
                                $.ajax({
                                    url: '/films/' + id,
                                    type: 'PUT',
                                    data: data,
                                    success: function(result){
                                        //veurePelicula(id, genereNom);
                                        socket.emit('votar_peli', id, genereNom);
                                    }
                                });
                            }
                        }
                    });
                }
                else{
                    //Hem de crear
                    $.post("votes",
                        nova_votacio,
                        function(final_result){
                            if(!final_result.error){ //tot ha anat be
                                $.ajax({
                                    url: '/films/' + id,
                                    type: 'PUT',
                                    data: data,
                                    success: function(result){
                                        //veurePelicula(id, genereNom);
                                        socket.emit('votar_peli', id, genereNom);
                                    }
                                });
                            }
                        },"json");
                }
            });

        });
    }
    else{
        alert("Has d'estar logat per poder votar");
    }
}

function compare_film_rating(a,b) {
    var ratinga = parseInt(a.vote_sum) + 0.0;
    if (a.votes != 0){
        ratinga = ratinga / a.votes;
    }
    var ratingb = parseInt(b.vote_sum) + 0.0;
    if (b.votes != 0){
        ratingb = ratingb / b.votes;
    }
    if (ratingb < ratinga)
        return -1;
    if (ratingb > ratinga)
        return 1;
    return 0;
}

function compare_film_date(a,b) {
    if (b.dataFilm < a.dataFilm)
        return -1;
    if (b.dataFilm > a.dataFilm)
        return 1;
    return 0;
}