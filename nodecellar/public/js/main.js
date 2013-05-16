var globalUser;
var slide_counter = 1;
var started = false;
var interval;
$(document).ready(function(){
    selectImagesSlideShow();
    if(!started){
        startAnimation();
        started = true;
    }
    globalUser = null;
    bestFilm(5,"best_films");
});

function compare_film_date(a,b) {
    if (b.dataFilm < a.dataFilm)
        return -1;
    if (b.dataFilm > a.dataFilm)
        return 1;
    return 0;
}

function veureEstrenes(){
    amagar();

    desactivarMenus();
    $('#menu_estrenes').addClass('active');

    var llistat = '<div id="inici_estrenes">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureEstrenes()">Estrenes</a>' +
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
function selectImagesSlideShow(){
    $.getJSON('slideimages', function(data){
        for(var i = 0; i < 3; i++){
            if(data.length <= i){
                var img = '<span><img src="img/example_film' + (i+1) + '.jpg" alt="" title="" class="image-slide-show" width="910" height="352" /></span>';
            }
            else{
                var img = '<span><img src="'+ data[i].url +'" alt="" title="" class="image-slide-show" width="910" height="352" /></span>';
            }
            $('#element'+(i+1)).append(img);
        }
    });
}

function login() {
    var name = $('#login-usuari').val();
    var password = $('#login-password').val();
    if(name ==  '' || password == ''){
        alert("Algun dels parametres es buit");
    }else
    {
        $.getJSON( 'users/' + name + '/' + password, function(data) {
            if(data.result == 'ok'){
                //TODO: guardar l'item en un usuari global
                globalUser = {'name': data.name, 'email': data.email, 'rol': data.rol, '_id': data._id};

                var item;
                item = '<div class="loggin" id="info-user-logged"><div style="margin-top:25px;"> Benvingut,  ' + data.name +
                    '. <span/><a onclick="javascript:logout()" style="text-decoration: underline; cursor: pointer !important;">logout</a></div></div>';

                $('#user-info').append(item);
                $('#loggin-box').hide();

                if(globalUser.rol != 2){
                    desactivarMenus();
                    backoffice_main();
                    var menu = '<a id="loggin_admin_menu" onclick="javascript:backoffice_main()">' + "Menu d'administrador." + '</a>';
                    $('#info-user-logged').append(menu);
                }
            }
            else{
                alert("L'usuari i/o la contrasenya són incorrectes");
            }
        });
    }
}
function logout(){
    $('#info-user-logged').remove();
    $('#login-password').val('');
    $('#loggin-box').show();
    if (globalUser.rol != 2){
        veureHome();
    }
    globalUser = null;
}

function cancelarRegistre(){
    $('#loggin-box').show();
    $('#register-form').hide();
}

function registre(){
    $('#loggin-box').hide();
    $(':input','#register-data')
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $('#register-form').show();
}

function registrar(){
    if(validar()){
        $.post("users",
            {name: $('#register-name').val(), email: $('#register-email').val(), password: $('#register-password').val(), rol: 2},
            function(data){
                $('#register-form').hide();
                $('#login-usuari').val( $('#register-name').val() );
                $('#login-password').val( $('#register-password').val() );
                login();
            },"json");
    }
}

function validar(){
    var validation = true;
    $('.register-error').remove();
    /*
     * Conditions
     */
    var name = $('#register-name').val();

    if(name == ""){
        validation = false;
        $('#register-name').after("<span class='register-error'>* Name cannot be blank</span>");
    }
    else{
        var pattern = /^\w+$/;

        if(!pattern.test(name)){
            validation = false;
            $('#register-name').after("<span class='register-error'>* Name cannot contain simbols like ($,%,&,...)</span>");
        }
        else{
            $.getJSON('exist/' + name, function(data){
                if(data.result == 'ok'){
                    validation = false;
                    $('#register-name').after("<span class='register-error'>* Name already in use</span>");
                }
            });
        }
    }

    /*
     * Conditions
     */
    var email = $('#register-email').val();

    if(email == ""){
        validation = false;
        $('#register-email').after("<span class='register-error'>* Email cannot be blank</span>");
    }
    else{
        var pattern = /^\w+@\w+\.\w+$/;

        if(!pattern.test(email)){
            validation = false;
            $('#register-email').after("<span class='register-error'>* Email error format</span>");
        }
    }

    /*
     * Conditions
     */
    var password = $('#register-password').val();
    var confirm_password = $('#register-confirm-password').val();

    if(password == ""){
        validation = false;
        $('#register-password').after("<span class='register-error'>* Password cannot be blank</span>");
    }
    else{
        var pattern = /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

        if(!pattern.test(password)){
            validation = false;
            $('#register-password').after("<span class='register-error'>* Password cannot contain simbols like ($,%,&,...)</span>");
        }
    }

    if(password != confirm_password){
        validation = false;
        $('#register-confirm-password').after("<span class='register-error'>* Must be equal to the password</span>");
    }

    return validation;
}

function desactivarMenus(){
    $('#menu_inici').removeClass('active');
    $('#menu_pelicules').removeClass('active');
    $('#menu_cartellera').removeClass('active');
    $('#menu_estrenes').removeClass('active');
    $('#menu_cinemes').removeClass('active');
    $('#menu_ranquing').removeClass('active');
}

function veureGeneres() {
    amagar();

    desactivarMenus();
    $('#menu_pelicules').addClass('active');

    var typeFilms;
    var llistat = '<div id="inici-generes">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="">Pel·lícules</a>' +
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

function veurePelicules(genereId, genereNom){
    amagar();
    var films;
    var llistat = '<div id="inici-pelicules">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureGeneres()">Pel·lícules</a> > <a onclick="">'+genereNom+'</a>' +
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
            '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureGeneres()">Pel·lícules</a> > <a onclick="javascript:veurePelicules(\''+film.typeFilm+'\',\''+genereNom+'\')">'+genereNom+'</a>' +
            '</div>';

        llistat = llistat + '<div class="pelicula">' +
            '<div class="pelicula-image"><img height="325" width="220" src="'+film.image+'"/></div>' +
            '<div class="pelicula-info">' +
                '<div class="pelicula-title">'+film.title+'</div>' +
                '<div class="pelicula-original-title">'+film.original_title+' (original title)</div>' +
                '<div class="pelicula-duration">Durada: '+film.duration+'</div>' +
                '<div class="pelicula-director">Director: '+film.director+'</div>' +
                '<div class="pelicula-cast">Actors: '+film.cast+'</div>' +
                '<div class="pelicula-type">Genere: <a onclick="javascript:veurePelicules(\''+film.typeFilm+'\',\''+genereNom+'\')">'+genereNom+'</a></div>' +
                '<div class="pelicula-data">Estrena: '+film.dataFilm+'</div>' +
                '<div class="pelicula-rating">Puntuació: '+ rating +'</div>' +
                '<div class="pelicula-review">Sinopsis: '+film.review+'</div>' +
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
                    llistat = llistat + '</div>';
                    $('#main').append(llistat);
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
                        }
                        llistat = llistat + '</div>';
                        $('#main').append(llistat);
                    });
                }
    });
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
                                        veurePelicula(id, genereNom);
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
                                        veurePelicula(id, genereNom);
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

function veureCines(){
    amagar();

    desactivarMenus();
    $('#menu_cinemes').addClass('active');

    var cines;
    var llistat = '<div id="inici_cines">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a>Cines</a>' +
        '</div>';

    $.getJSON(url = "cines/", function(data){
        var cines = data;

        var position = '';
        var op;
        //TODO: Per cada un s'haurà de fer una petició
        for(var i=0; i < cines.length; i++){
            op = i % 3;
            if (op == 0){
                position = 'first';
                if(i == 3) llistat = llistat + '<div class="menu-conent-boxes" id="second-line">';
                else llistat = llistat + '<div class="menu-conent-boxes">';
            }else if(op == 1) position = 'middle';
            else position = 'last';
            llistat = llistat + '<div class="box" id="'+position+'">'+
                '<img src="'+cines[i].image+'" alt="" title="" width="267" height="172" />'+
                '<h3 class="title-box">'+cines[i].name+'</h3>' +
                '<span class="small_button_box"><a class="script_function" onclick="javascript:veureCine(\''+cines[i]._id+'\',\''+cines[i].name+'\')">Veure Cinema</a></span>' +
                '</div>'
            if (op == 2) llistat = llistat + '</div>';
        }
        llistat = llistat + '</div>' + '</div>';
        $('#main').append(llistat);
    });
}

var latitud;
var longitud;
var cine_name;
function initializeMap(){
    var mapOptions = {
        center: new google.maps.LatLng(latitud,longitud),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("cine_map"), mapOptions);

    var myLatlng = new google.maps.LatLng(latitud,longitud);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:cine_name
    });
}

function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDEsCaFJWuB1z79UlfELSpITu2RGz-azyc&sensor=false&callback=initializeMap";
    document.body.appendChild(script);
}

function veureCine(cineId, cineNom){
    amagar();
    var cine;
    var llistat;

    $.getJSON( 'cines/'+cineId, function(data) {
        var cine = data;
        var rating = parseInt(cine.vote_sum) + 0.0;
        if (cine.votes != 0){
            rating = rating / cine.votes;
        }

        llistat = '<div id="inici_cine">' +
            '<div class="breadcrumb">' +
            '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureCines()">Cinemes</a> > <a>'+cineNom+'</a>' +
            '</div>';

        llistat = llistat + '<div class="cine">' +
            '<div class="cine_image"><img src="'+cine.image+'" alt="" title="'+cine.name+'" width="300" height="350" /></div>' +
            '<div class="cine_info">' +
                '<div class="cine_name">'+cine.name+'</div>' +
                '<div class="cine_direction">Adreça: '+cine.direction+'</div>' +
                '<div class="cine_city">Ciutat: '+cine.city+'</div>' +
                '<div class="cine_phone">Telèfon: '+cine.phone+'</div>' +
                '<div class="cine_email">Email: '+cine.email+'</div>' +
                '<div class="pelicula-rating">Puntuació: '+ rating +'</div>' +

                '<div class="votar-cine" id="votar-cine">Votar: ';
        if(globalUser == null){
            llistat = llistat + '<input type="radio" name="votes" value="1" checked=true> 1 </input>' +
                '<input type="radio" name="votes" value="2"> 2 </input>' +
                '<input type="radio" name="votes" value="3"> 3 </input>' +
                '<input type="radio" name="votes" value="4"> 4 </input>' +
                '<input type="radio" name="votes" value="5"> 5 </input>' +
                '<input class="button-login" type="button" value="Votar" onclick="javascript:votarCine(\''+cine._id+'\',\''+cineNom+'\')" style="float:none; right:0"/>' +
                '</div>' +
                '</div>' +
                '<div class="cine_map" id="cine_map"></div>' +
                '</div>';
            llistat = llistat + '</div>';
            $('#main').append(llistat);
        }
        else{
            $.getJSON("votesByElemUser/" + cine._id + "/" + globalUser._id, function(vote){
                if(vote.error){
                    llistat = llistat + '<input type="radio" name="votes" value="1" checked=true> 1 </input>' +
                        '<input type="radio" name="votes" value="2"> 2 </input>' +
                        '<input type="radio" name="votes" value="3"> 3 </input>' +
                        '<input type="radio" name="votes" value="4"> 4 </input>' +
                        '<input type="radio" name="votes" value="5"> 5 </input>' +
                        '<input class="button-login" type="button" value="Votar" onclick="javascript:votarCine(\''+cine._id+'\',\''+cineNom+'\')" style="float:none; right:0"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="cine_map" id="cine_map"></div>' +
                        '</div>';
                }else{
                    for(var bucle = 1; bucle <= 5; bucle++){
                        if(bucle == vote.vote){
                            llistat = llistat + '<input type="radio" name="votes" value="' + bucle + '" checked> ' + bucle + ' </input>';
                        }
                        else{
                            llistat = llistat + '<input type="radio" name="votes" value="' + bucle + '"> ' + bucle + ' </input>';
                        }
                    }
                    llistat = llistat + '<input class="button-login" type="button" value="Votar" onclick="javascript:votarCine(\''+cine._id+'\',\''+cineNom+'\')" style="float:none; right:0"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="cine_map" id="cine_map"></div>' +
                        '</div>';
                }
                llistat = llistat + '</div>';
                $('#main').append(llistat);
            });
        }
        latitud = cine.latitud;
        longitud = cine.longitud;
        cine_name = cine.name;
        loadScript();
        //initializeMap(cine.latitud, cine.longitud);
    });
}

function votarCine(id, cineNom){
    if(globalUser != null){
        var votacio = $('input[name=votes]:checked', '#votar-cine').val();

        $.getJSON( 'cines/'+id, function(cine) {
            var votes = parseInt(cine.votes) + 1;
            var vote_sum = parseInt(cine.vote_sum) + parseInt(votacio);
            var data = {
                name: cine.name,
                direction: cine.direction,
                city: cine.city,
                phone: cine.phone,
                email: cine.email,
                latitud: cine.latitud,
                longitud: cine.longitud,
                image: cine.image,
                vote_sum: vote_sum,
                votes: votes
            };
            $.getJSON( 'votesByElemUser/'+cine._id+'/'+globalUser._id, function(votation_result) {
                var nova_votacio = {
                    element_id: cine._id,
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
                                    url: '/cines/' + id,
                                    type: 'PUT',
                                    data: data,
                                    success: function(result){
                                        veureCine(id, cineNom);
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
                                    url: '/cines/' + id,
                                    type: 'PUT',
                                    data: data,
                                    success: function(result){
                                        veureCine(id, cineNom);
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

function veureHome(){
    //Eliminar tot possible div que s'hagi pogut afegir en algun moment
    amagar();
    desactivarMenus();
    $('#menu_inici').addClass('active');
    //Mostrar el div inicial
    $('#inici-info').show(); //TODO: revisar si s'ha de canviar per hide
    bestFilm(5,"best_films")
    startAnimation();
}

function amagar(){
    $('#inici-info').hide(); //Home
    $('#best_films').children().remove(); //Content of a Ranquing home
    $('#inici-generes').remove(); //Genere
    $('#inici-pelicules').remove(); //Pelicules
    $('#inici-pelicula').remove(); //Pelicula
    $('#inici_ranquings').remove(); //Ranquings
    $('#inici_cines').remove(); //Cines
    $('#inici_cine').remove(); //Cine
    $('#inici_cartellera').remove(); //Cartellera
    $('#inici_cartellera_cinema').remove(); //Mostrar Cartellera de cinema
    $('#inici_estrenes').remove(); //Estrenes
    $('#backoffice_admin_main').remove(); //Backoffice main
    $('#backoffice_admin_pelis').remove(); //Backoffice pelis
    $('#backoffice_admin_new_peli').remove(); //Backoffice new peli
    $('#backoffice_admin_list_pelis').remove(); //Backoffice list pelis
    $('#backoffice_admin_edit_peli').remove(); //Backoffice edit pelis
    $('#backoffice_admin_detail_peli').remove(); //Backoffice detail pelis
    $('#backoffice_admin_cines').remove(); //Backoffice cines
    $('#backoffice_admin_list_cines').remove(); //Backoffice list cines
    $('#backoffice_admin_detail_cine').remove(); //Backoffice detail cines
    $('#backoffice_admin_new_cinema').remove(); //Backoffice new cines
    $('#backoffice_admin_edit_cine').remove(); //Backoffice edit cines
    $('#backoffice_admin_pelis_cinema').remove(); //Backoffice pelis cinema
    $('#backoffice_admin_pelis_cinema_choose_peli').remove(); //Backoffice pelis cinema choose film
    $('#backoffice_admin_pelis_cinema_timetable').remove(); //Backoffice pelis cinema timetable
    $('#backoffice_admin_info_pelis_cinema_timetable').remove(); //Backoffice info peli cinema timetable
    $('#backoffice_admin_slideshow').remove(); //Backoffice slideshow
    $('#backoffice_admin_list_slideshow').remove(); //Backoffice slideshow list
    $('#backoffice_admin_new_slideshow').remove(); //Backoffice slideshow list
    $('#backoffice_admin_slideshow_element').remove(); //Backoffice slideshow detail



    window.clearInterval(interval);
}

function startAnimation(){
    $('#element1').hide();
    $('#element2').hide();
    $('#element3').hide();

    $('#element'+slide_counter).show();

    interval = setInterval(function(){ animation() },5000);
    //animation();
}

function animation(){
    var cur = $('#element'+slide_counter);
    cur.fadeOut( 1000, function(){
        if (slide_counter == 3){
            slide_counter = 1;
        }else{
            slide_counter=slide_counter+1;
        }

        cur = $('#element'+slide_counter);
        cur.fadeIn( 1000 );

      // timeout = setTimeout(function(){animation()}, 1000000000000000000000);
    });
}

function backoffice_main(){
    //TODO: comprovar si ha de ser un remove o un hide, depen de si canviem l'slideshow.
    amagar();


    //Mirem quin tipus d'usuari estem. Si som admins o cinema
    var item;
    if (globalUser.rol == 1){
        item= '<div class="backoffice_admin_main" id="backoffice_admin_main">'+
            "<h2>Menú backoffice rol d'admin</h2>" +
            '<ul><li><a onclick="javascript:gestioPelicules()"> Gestió de pel·lícules </a></li>'+
            '<li><a onclick="javascript:gestioCinemes()"> Gestió de cinemes </a></li>' +
            '<li><a onclick="javascript:gestioPeliculaCinema()"> Gestió de pel·lícules a cinema </a></li>' +
            '<li><a onclick="javascript:gestioSlideshow()">' + " Gestió de l'slideshow </a></li>" +
            '</ul>' +
            '<input class="button-login" type="button" value="Pàgina principal" onclick="javascript:veureHome()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
        '</div>';
        $('#main').append(item);
    }
}

function gestioSlideshow(){
    amagar();
    var item;
    item= '<div class="backoffice_admin_slideshow" id="backoffice_admin_slideshow">'+
        "<h2>Gestió de l'slideshow</h2>" +
        '<ul><li><a onclick="javascript:llistatSlideshow()">' + " Llistat de l'slideshow </a></li>" +
        '<li><a onclick="javascript:crearMenuSlideshow()"> Crear slideshow </a></li>' +
        '</ul>' +
        '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
        '</div>';
    $('#main').append(item);
}

function llistatSlideshow(){
    amagar();

    $.getJSON( 'slideimages', function(data) {
        var slideshows = data;
        var item;
        item = '<div class="backoffice_admin_list_slideshow" id="backoffice_admin_list_slideshow">'+
            "<h2>Llistat de l'slideshow</h2>";
        for(var i=0; i < data.length; i++){
            item = item +
                '<a onclick="javascript:detallSlideshow(' +
                "'" + data[i]._id + "'" + ')"><img src="' + data[i].url + '" width="300px" height="150px" style="float:left;"></a>';
        }
        item = item +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioSlideshow()" style="float: left; clear: both;  margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });

}

function crearMenuSlideshow(){
    amagar();

    var item;
    item= '<div class="backoffice_admin_new_slideshow" id="backoffice_admin_new_slideshow">' +
        "<h2>Creació de la imatge</h2>" +
        '<div class="new" id="new-form">' +
        '<div id="register-data" style=" margin-top: 30px;">' +
        '<label class="form-field FBLabel">Url de la imatge:</label>' +
        '<br/>' +
        '<input id="new_url" class="form-field FBInput" />' +
        '<br/>' +
        '<input class="button-login form-field" type="button" value="Nova imatge" onclick="javascript:crearSlideshow()" style="float: left;   margin-top: 10px; "/>' +
        '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:llistatSlideshow()" style="float: left; margin: 10px 0px 0px 10px"/>' +
        '</div>' +
        '</div>'+
        '</div> ';
    $('#main').append(item);
}

function crearSlideshow(){
    var data = {
        url: $('#new_url').val()
    };

    $.post("slideimages",
        data,
        function(data){
            llistatSlideshow();
        },"json");
}

function detallSlideshow(idSlideshow){
    amagar();
    $.getJSON( 'slideimages/' + idSlideshow, function(data) {
        var slideshows = data;
        var item;
        item = '<div class="backoffice_admin_slideshow_element" id="backoffice_admin_slideshow_element">'+
            "<h2>Imatge</h2>" +
            '<img src="' + data.url + '" width="300px" height="150px" style="float:left;" >' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:llistatSlideshow()" style="float: left; clear: both;  margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Eliminar" onclick="javascript:eliminaSlideshow('+ "'" + idSlideshow +"'" +')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function eliminaSlideshow(idSlideshow){
    $.ajax({url: "/slideimages/" + idSlideshow,
        type: 'DELETE',
        success: function(result){
            llistatSlideshow();
        }});
}

 function gestioPelicules(){
     $('#backoffice_admin_main').remove();
     $('#backoffice_admin_list_pelis').remove();
     var item;
     item= '<div class="backoffice_admin_pelis" id="backoffice_admin_pelis">'+
         "<h2>Gestió de pel·lícules</h2>" +
     '<ul><li><a onclick="javascript:llistatPelicules()"> Llistat de pel·lícules </a></li>' +
     '<li><a onclick="javascript:crearPelicules()"> Crear pel·lícula </a></li>' +
     '</ul>' +
         '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
     '</div>';
     $('#main').append(item);
 }

 function llistatPelicules(){
     amagar();

     $.getJSON( 'films', function(data) {
         var films = data;
         var item;
         item = '<div class="backoffice_admin_list_pelis" id="backoffice_admin_list_pelis">'+
             "<h2>Llistat de pel·lícules</h2>" +
             '<table class="film-list">' +
             '<tr><th>Titol</th><th>Titol original</th></tr>';
         for(var i=0; i < data.length; i++){
            item = item + '<tr><th>' +
                '<a onclick="javascript:detallPelicula(' +
                "'" + data[i]._id + "'" + ')">' + data[i].title + '</a></th>' +
                '<th>' + data[i].original_title + '</th></tr>';
         }
         item = item + '</table>' +
             '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioPelicules()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
             '</div>';
         $('#main').append(item);
     });

 }

 function crearPelicules(){
     amagar();
     $.getJSON( 'typefilm', function(data) {

         var item;

         item= '<div class="backoffice_admin_new_peli" id="backoffice_admin_new_peli">' +
             "<h2>Creació d'una pel·lícula</h2>" +
             '<div class="new" id="new-form">' +
             '<div id="register-data" style=" margin-top: 30px;">' +
             '<label class="form-field FBLabel">Títol:</label>' +
             '<br/>' +
             '<input id="new-title" class="form-field FBInput" />' +
             '<br/>' +
             '<label class="form-field FBLabel">Titol original:</label>' +
             '<br/>' +
             '<input id="new-original-title" class="form-field FBInput"/>' +
             '<br/>' +
             '<label class="form-field FBLabel">Durada:</label>' +
             '<br/>' +
             '<input id="new-duration" class="form-field FBInput"/>' +
             '<br/>' +
             '<label class="form-field FBLabel">Director:</label>' +
             '<br/>' +
             '<input id="new-direction" class="form-field FBInput"/>' +
             '<br/>' +
             '<label class="form-field FBLabel">Cast:</label>' +
             '<br/>' +
             '<input id="new-cast" class="form-field FBInput"/>' +
             '<br/>' +
             '<label class="form-field FBLabel">Trailer:</label>' +
             '<br/>' +
             '<input id="new-trailer" class="form-field FBInput"/>' +
             '<br/>' +
             '<label class="form-field FBLabel">Genere:</label>' +
             '<br/> <select id="new-genere">';
             for(var i=0; i < data.length; i++){
                item = item + '<option value="' + data[i]._id + '">' + data[i] .name + '</option>';
             }
             item = item +
             '</select><br/>' +
             '<label class="form-field FBLabel">Data:</label>' +
             '<br/>' +
             '<input type="date" id="new-data" class="form-field FBInput"/>' +
             '<br/>' +
             '<label class="form-field FBLabel">Resum:</label>' +
             '<br/>' +
             '<input id="new-review" size="100px" type="text" class="form-field FBInput"/>' +
             '<br/>' +
             '<label class="form-field FBLabel">Imatge:</label>' +
             '<br/>' +
             '<input id="new-image" size="100px" type="text" class="form-field FBInput"/>' +
             '<br/>' +
             '<input class="button-login form-field" type="button" value="Nova pel·lícula" onclick="javascript:crearPelicula()" style="float: left;   margin-top: 10px; "/>' +
             '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:cancelarNovaPelicula()" style="float: left; margin: 10px 0px 0px 10px"/>' +
             '</div>' +
         '</div>'+
         '</div> ';
         $('#main').append(item);
     });
 }

function cancelarNovaPelicula(){
    amagar();
    gestioPelicules();
}

function detallPelicula(id){
    amagar();
    $.getJSON( 'films/' + id, function(data) {
        var item;
        var rating = parseInt(data.vote_sum) + 0.0;
        if (data.votes != 0){
            rating = rating / data.votes;
        }
        item = '<div class="backoffice_admin_detail_peli" id="backoffice_admin_detail_peli">' +
            "<h2>Detall d'una pel·lícula</h2>" +
            '<label id="title">Títol:</label>' + data.title +
            '</br><label id="original_title">Títol original:</label>' + data.original_title +
            '</br><label id="duration">Durada:</label>' + data.duration +
            '</br><label id="director">Director:</label>' + data.director +
            '</br><label id="cast">Casting:</label>' + data.cast +
            '</br><label id="trailer">Trailer:</label>' + data.trailer +
            '</br><label id="Genere">Genere:</label><div style="display: inline;" id="genere_name"></div>' +
            '</br><label id="dataFilm">Data de la pel·lícula:</label>' + data.dataFilm +
            '</br><label id="rating">Puntuació:</label>' + rating +
            '</br><label id="review">Resum:</label>' + data.review +
            '</br><label id="image">Imatge:</label>' + data.image +
            '</br>' +
            '<input class="button-login" type="button" value="Editar" onclick="javascript:editMenuPelicula(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Eliminar" onclick="javascript:eliminarPelicula(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Llistat de Pel·lícules" onclick="javascript:llistatPelicules()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Menú backoffice" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>'
            '</div> ';
        $('#main').append(item);

        $.getJSON( 'typefilm/' + data.typeFilm, function(data) {
            $('#genere_name').append(data.name);
        });
    });
}

function eliminarPelicula(id){
    $.ajax({url: "/films/" + id,
        type: 'DELETE',
        success: function(result){
            llistatPelicules();
    }});
}

function crearPelicula(){
    var data = {
            title: $('#new-title').val(),
            original_title: $('#new-original-title').val(),
            duration: $('#new-duration').val(),
            director: $('#new-direction').val(),
            cast: $('#new-cast').val(),
            trailer: $('#new-trailer').val(),
            typeFilm: $('#new-genere option:selected').val(),
            vote_sum: 0,
            votes: 0,
            dataFilm: $('#new-data').val(),
            review: $('#new-review').val(),
            image: $('#new-image').val()
    };

        $.post("films",
        data,
        function(data){
            llistatPelicules();
        },"json");
}

function editMenuPelicula(id){
    amagar();

    $.getJSON( 'films/' + id, function(data) {
        var item;

        item= '<div class="backoffice_admin_edit_peli" id="backoffice_admin_edit_peli">' +
            "<h2>Edita una pel·lícula</h2>" +
            '<div class="new" id="new-form">' +
            '<div id="register-data" style=" margin-top: 30px;">' +
            '<label class="form-field FBLabel">Títol:</label>' +
            '<br/>' +
            '<input id="new-title" class="form-field FBInput" value="' + data.title + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Titol original:</label>' +
            '<br/>' +
            '<input id="new-original-title" class="form-field FBInput" value="' + data.original_title + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Durada:</label>' +
            '<br/>' +
            '<input id="new-duration" class="form-field FBInput" value="' + data.duration + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Director:</label>' +
            '<br/>' +
            '<input id="new-direction" class="form-field FBInput" value="' + data.director + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Cast:</label>' +
            '<br/>' +
            '<input id="new-cast" class="form-field FBInput" value="' + data.cast + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Trailer:</label>' +
            '<br/>' +
            '<input id="new-trailer" class="form-field FBInput" value="' + data.trailer + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Genere:</label>' +
            '<br/>' +
            '<select id="new-genere" class="form-field FBInput"></select>' +
            '<br/>' +
            '<label class="form-field FBLabel">Data:</label>' +
            '<br/>' +
            '<input id="new-data" class="form-field FBInput" value="' + data.dataFilm + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Resum:</label>' +
            '<br/>' +
            '<input id="new-review" size="100px" type="text" class="form-field FBInput" value="' + data.review + '"/>' +
            '<br/>' +
            '<input id="edit-vote-sum" value=' + data.vote_sum + ' type="hidden" />' +
            '<input id="edit-votes" value=' + data.votes + ' type="hidden" />' +
            '<input class="button-login form-field" type="button" value="Editar" onclick="javascript:editPelicula(' + "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; "/>' +
            '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:detallPelicula(' + "'" + data._id + "'" + ')" style="float: left; margin: 10px 0px 0px 10px"/>' +
            '</div>' +
            '</div>'+
            '</div> ';
        $('#main').append(item);
        $.getJSON( 'typefilm/' + data.typeFilm, function(data) {
            var item;
            var gen= data._id;
            item = '<option selected value=' + data._id + '>' + data.name + '</option>';
            $('#new-genere').append(item);
            $.getJSON( 'typefilm', function(data) {
                var item;
                for(var i=0; i < data.length; i++){
                    if( data[i]._id != gen){
                        item= item + '<option value=' + data[i]._id + '>' + data[i].name + '</option>';
                    }
                }
                $('#new-genere').append(item);
            });
        });

    });

}

function editPelicula(id){
    var data = {
        title: $('#new-title').val(),
        original_title: $('#new-original-title').val(),
        duration: $('#new-duration').val(),
        director: $('#new-direction').val(),
        cast: $('#new-cast').val(),
        trailer: $('#new-trailer').val(),
        typeFilm: $('#new-genere option:selected').val(),
        dataFilm: $('#new-data').val(),
        review: $('#new-review').val(),
        vote_sum: $('#edit-vote-sum').val(),
        votes: $('#edit-votes').val()
    };
    $.ajax({
        url: '/films/' + id,
        type: 'PUT',
        data: data,
        success: function(result){
            detallPelicula(id);
        }
    });
}

function gestioCinemes(){
    amagar();

    var item;
    item= '<div class="backoffice_admin_cines" id="backoffice_admin_cines">'+
        "<h2>Gestió de cinemes</h2>" +
        '<ul><li><a onclick="javascript:llistatCinemes()"> Llistat de cinemes </a></li>' +
        '<li><a onclick="javascript:crearMenuCinema()"> Crear Cinema </a></li>' +
        '</ul>' +
        '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
        '</div>';
    $('#main').append(item);
}

function llistatCinemes(){
    amagar();

    $.getJSON( 'cines', function(data) {
        var cines = data;
        var item;
        item = '<div class="backoffice_admin_list_cines" id="backoffice_admin_list_cines">'+
            "<h2>Llistat de cinemes</h2>" +
            '<table class="cines-list">' +
            '<tr><th>Nom</th><th>Ciutat</th></tr>';
        for(var i=0; i < data.length; i++){
            item = item + '<tr><th>' +
                '<a onclick="javascript:detallCinema(' +
                "'" + data[i]._id + "'" + ')">' + data[i].name + '</a></th>' +
                '<th>' + data[i].city + '</th></tr>';
        }
        item = item + '</table>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioCinemes()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function crearMenuCinema(){
    amagar();

    var item;
    item= '<div class="backoffice_admin_new_cinema" id="backoffice_admin_new_cinema">' +
        "<h2>Creació d'una pel·lícula</h2>" +
        '<div class="new" id="new-form">' +
        '<div id="register-data" style=" margin-top: 30px;">' +
        '<label class="form-field FBLabel">Nom:</label>' +
        '<br/>' +
        '<input id="new-name" class="form-field FBInput" />' +
        '<br/>' +
        '<label class="form-field FBLabel">Direcció: </label>' +
        '<br/>' +
        '<input id="new-direction" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Ciutat: </label>' +
        '<br/>' +
        '<input id="new-city" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Telefon: </label>' +
        '<br/>' +
        '<input id="new-phone" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Email: </label>' +
        '<br/>' +
        '<input id="new-email" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Latitud: </label>' +
        '<br/>' +
        '<input id="new-latitud" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Longitud: </label>' +
        '<br/>' +
        '<input id="new-longitud" class="form-field FBInput"/>' +
        '<br/>' +
        '<input class="button-login form-field" type="button" value="Nou cinema" onclick="javascript:crearCinema()" style="float: left;   margin-top: 10px; "/>' +
        '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:cancelarNouCinema()" style="float: left; margin: 10px 0px 0px 10px"/>' +
        '</div>' +
        '</div>'+
        '</div> ';
    $('#main').append(item);
}

function crearCinema(){
    var data = {
        name: $('#new-name').val(),
        direction: $('#new-direction').val(),
        city: $('#new-city').val(),
        phone: $('#new-phone').val(),
        email: $('#new-email').val(),
        latitud: $('#new-latitud').val(),
        longitud: $('#new-longitud').val()
    };

    $.post("cines",
        data,
        function(data){
            llistatCinemes();
        },"json");
}

function cancelarNouCinema(){
    amagar();
    gestioCinemes();
}

function detallCinema(id){
    amagar();
    $.getJSON( 'cines/' + id, function(data) {
        var item;
        item = '<div class="backoffice_admin_detail_cine" id="backoffice_admin_detail_cine">' +
            "<h2>Detall d'un cinema</h2>" +
            '<label id="title">Nom: </label>' + data.name +
            '</br><label id="direction">Direcció: </label>' + data.direction +
            '</br><label id="city">Ciutat: </label>' + data.city +
            '</br><label id="phone">Telefon: </label>' + data.phone +
            '</br><label id="email">Email: </label>' + data.email +
            '</br><label id="latitud">Latitud: </label>' + data.latitud +
            '</br><label id="longitud">Longitud: </label>' + data.longitud +
            '</br><label id="image">Imatge: </label>' + data.image +
            '</br>' +
            '<input class="button-login" type="button" value="Editar" onclick="javascript:editMenuCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Eliminar" onclick="javascript:eliminarCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:llistatCinemes()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div> ';
        $('#main').append(item);

        $.getJSON( 'typefilm/' + data.typeFilm, function(data) {
            $('#genere_name').append(data.name);
        });
    });
}

function editMenuCinema(id){
    amagar();
    $.getJSON( 'cines/' + id, function(data) {
        var item;
        item = '<div class="backoffice_admin_edit_cine" id="backoffice_admin_edit_cine">' +
            "<h2>Detall d'un cinema</h2>" +
            '<label class="form-field FBLabel">Nom:</label>' +
            '<br/>' +
            '<input id="new-name" class="form-field FBInput" value="' + data.name + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Direcció:</label>' +
            '<br/>' +
            '<input id="new-direction" class="form-field FBInput" value="' + data.direction + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Ciutat:</label>' +
            '<br/>' +
            '<input id="new-city" class="form-field FBInput" value="' + data.city + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Telefon:</label>' +
            '<br/>' +
            '<input id="new-phone" class="form-field FBInput" value="' + data.phone + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Email:</label>' +
            '<br/>' +
            '<input id="new-email" class="form-field FBInput" value="' + data.email + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Latitud:</label>' +
            '<br/>' +
            '<input id="new-latitud" class="form-field FBInput" value="' + data.latitud + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Longitud:</label>' +
            '<br/>' +
            '<input id="new-longitud" class="form-field FBInput" value="' + data.longitud + '"/>' +
            '</br>' +
            '<label class="form-field FBLabel">Imatge:</label>' +
            '<br/>' +
            '<input id="new-image" class="form-field FBInput" value="' + data.image + '"/>' +
            '</br>' +
            '<input class="button-login" type="button" value="Editar" onclick="javascript:editCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:detallCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div> ';
        $('#main').append(item);
    });
}

function editCinema(id){
    var data = {
        name: $('#new-name').val(),
        direction: $('#new-direction').val(),
        city: $('#new-city').val(),
        phone: $('#new-phone').val(),
        email: $('#new-email').val(),
        latitud: $('#new-latitud').val(),
        longitud: $('#new-longitud').val(),
        image: $('#new-image').val()
    };
    $.ajax({
        url: '/cines/' + id,
        type: 'PUT',
        data: data,
        success: function(result){
            detallCinema(id);
        }
    });
}

function eliminarCinema(id){
    $.ajax({url: "/cines/" + id,
        type: 'DELETE',
        success: function(result){
            llistatCinemes();
        }});
}

function gestioPeliculaCinema(){
    amagar();
    $.getJSON( 'cines', function(data) {
        var cines = data;
        var item;
        item = '<div class="backoffice_admin_pelis_cinema" id="backoffice_admin_pelis_cinema">'+
            "<h2>Escull el teu cinema</h2><ul>";

        for(var i=0; i < data.length; i++){
            item = item +
                '<li>' +
                '<a onclick="javascript:escollirPelicula(' +
                "'" + data[i]._id + "'" + ')">' + data[i].name + '</a>' +
                '</li>';

        }
        item = item + '</ul>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function escollirPelicula(idCine){
    amagar();
    $.getJSON( 'films', function(data) {
        var films = data;
        var item;
        item = '<div class="backoffice_admin_pelis_cinema_choose_peli" id="backoffice_admin_pelis_cinema_choose_peli">'+
            "<h2>Escull una pel·lícula</h2><ul>";

        for(var i=0; i < data.length; i++){
            item = item +
                '<li>' +
                '<a onclick="javascript:veureTimetables(' +
                "'" + data[i]._id + "','" + idCine + "'"+ ')">' + data[i].title + '</a>' +
                '</li>';

        }
        item = item + '</ul>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioPeliculaCinema()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function veureTimetables(idPeli, idCine){
    amagar();
    $.getJSON( 'timetable', function(data) {
        $.getJSON( 'findAllBillboard/' + idCine + '/' + idPeli, function(billboards) {
            //var timetable = data;
            var item;
            item = '<div class="backoffice_admin_pelis_cinema_timetable" id="backoffice_admin_pelis_cinema_timetable">'+
                "<h2>Escull l'horari </h2>" +
                "<h3>(has de mantenir seleccionat la tecla 'Control' per seleccionar més d'un valor)</h3>" +
                "<select multiple style='height: 500px' id='timetable_list'>";

            for(var i=0; i < data.length; i++){
                var trobat = false;
                var j = 0;
                if(billboards.length == 0){
                    item = item +
                        '<option value="'+data[i]._id+'">' + data[i].time +'</option>' ;
                }else{
                    while(!trobat && j < billboards.length){
                        if(billboards[j].timetable_id == data[i]._id){
                            trobat = true;
                            item = item +
                                '<option value="'+data[i]._id+'" selected>' + data[i].time +'</option>' ;
                        }
                        j=j+1;
                    }
                    if(!trobat){
                        item = item +
                            '<option value="'+data[i]._id+'">' + data[i].time +'</option>' ;
                    }
                }
            }
            item = item + '</select>' +
                '<input class="button-login" type="button" value="Submit" onclick="javascript:assignCineFilm('+"'" + idPeli + "','" + idCine + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
                '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:escollirPelicula(' + "'" + idCine + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
                '</div>';
            $('#main').append(item);
        });
    });
}

function assignCineFilm(idPeli, idCine){

    var selectedValues = [];
    $("#timetable_list :selected").each(function(){
        selectedValues.push($(this).val());
    });

    amagar();
    $.getJSON('findAllBillboard/' + idCine + '/' + idPeli, function(results){
        for(var j = 0; j < results.length; j++){
            $.ajax({url: "/billboard/" + results[j]._id,
                type: 'DELETE',
                async: false,
                success: function(result){}});
        }
        for (var i = 0; i < selectedValues.length; i++){
            var data = {
                cine_id: idCine, peli_id: idPeli, timetable_id: selectedValues[i]
            };
            $.ajax({url: "/billboard",
                type: 'POST',
                data: data,
                async: false
            });
        }
        mostrarPeliculaTimetable(idPeli, idCine);
    });

}

function mostrarPeliculaTimetable(idPeli, idCine){
    amagar();

    $.getJSON( 'findAllBillboard/'+idCine+'/'+idPeli, function(billboard_result) {
        if(!billboard_result.error){
            //Tenim resultats
            $.getJSON( 'cines/'+idCine, function(cine) {
                var item =  '<div class="backoffice_admin_info_pelis_cinema_timetable" id="backoffice_admin_info_pelis_cinema_timetable">'+
                    "<h2>Cinema, pel·lícula i horari </h2>" +
                    '<label id="cine_title">El cinema es: </label>' + cine.name + '</br>';
                $.getJSON( 'films/'+idPeli, function(peli) {
                    item = item + '<label id="peli_title">La pel·lícula es: </label>' + peli.title + '</br>' +
                        '<label id="list_timetable">Llistat d'+"'" + 'horaris: </label> ';
                    item = item + '</div>';
                    $('#main').append(item);
                    for(var i = 0; i < billboard_result.length; i++){
                        if(i == billboard_result.length -1){
                            $.getJSON( 'timetable/'+billboard_result[i].timetable_id, function(timetable) {
                                var time = timetable.time + '<br/>';
                                $('#list_timetable').append(time);
                            });

                        }else{
                            $.getJSON( 'timetable/'+billboard_result[i].timetable_id, function(timetable) {
                                var time = timetable.time + '<br/>';
                                $('#list_timetable').append(time);
                            });
                        }
                    }
                });
            });
        }
        else{
            alert("quelcom ha anat malament");
        }
    });
}

function veureRanquings(){
    amagar();

    desactivarMenus();
    $('#menu_ranquing').addClass('active');

    var llistat = '<div id="inici_ranquings">' +
        '<div class="breadcrumb">' +
            '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureRanquings()">Rànquings</a>' +
        '</div>';

    div_id_ranquings = "best_films" + "_ranquings";
    div_id_cinemes = "best_films" + "_cinemes";

    llistat = llistat +
        '<div class="menu-conent-boxes">' +
            '<div class="box" id="first">' +
                '<h3 class="title-box" style="text-decoration: underline; font-weight: bold;">Top 10 millor pelicula</h3>' +
                '<div class="film_list" id="' + div_id_ranquings + '"></div>' +
            '</div>' +
        '</div>' +
            '<div class="box" id="middle">' +
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
        '<h3 class="title-box" style="text-decoration: underline; font-weight: bold;">Top 10 millor pelicula</h3>' +
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
                llistat = llistat + '<li><a onclick="javascript:cartelleraCinema('+"'" + cines_result[0]._id + "'" + ')">' + cines_result[z].name + '</a></li>';
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
            ' > <a onclick="javascript:cartelleraCinema(' + "'" + idCinema + "'" + ')">'+ cinema_result.name +'</a>' +
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