var globalUser;
var slide_counter = 1;
var started = false;
var interval;
var socket = io.connect('http://localhost:3000/');
$(document).ready(function(){
    selectImagesSlideShow();
    if(!started){
        startAnimation();
        started = true;
    }
    globalUser = null;
    bestFilm(5,"best_films");
    insertGeneresHome();
    selectSubImagesHome();

    socket.on('actualitzar_votar_cinema', function(idCinema, cineNom){
        //veureHome();
        var elms = document.getElementById('inici_cine');
        if(elms != null){
            //amagar();
            veureCine(idCinema, cineNom);
        }
    });
    socket.on('actualitzar_votar_pelicula', function(id, genere){
        //veureHome();
        var elms = document.getElementById('inici-pelicula');
        if(elms != null){
            veurePelicula(id, genere);
        }
    });
    socket.on('actualitzar_comentar_pelicula', function(elementId, genereNom){
        var elms = document.getElementById('inici-pelicula');
        if(elms != null){
            veurePelicula(elementId, genereNom);
        }
    });

});

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

function desactivarMenus(){
    $('#menu_inici').removeClass('active');
    $('#menu_pelicules').removeClass('active');
    $('#menu_cartellera').removeClass('active');
    $('#menu_estrenes').removeClass('active');
    $('#menu_cinemes').removeClass('active');
    $('#menu_ranquing').removeClass('active');
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

function insertGeneresHome(){
    //generes_home_list
    $.getJSON('typefilm', function(typefilms) {
        var randomnumber=Math.floor(Math.random()*typefilms.length);
        var list = '';
        for(var i=0; i < 3; i++){
            if(randomnumber == typefilms.length){
                randomnumber = 0;
            }
            list = list + '<li><a onclick="javascript:veurePelicules(' + "'" + typefilms[randomnumber]._id + "','" + typefilms[randomnumber].name + "')" + '">' +
                typefilms[randomnumber].name  +'</a></li>';
            randomnumber = randomnumber + 1;
        }
        $('#generes_home_list').append(list);
    });
}

function selectSubImagesHome(){
    $.getJSON( 'slideimages', function(data) {
        //image_ranquing
        //image_genere
        if(data.length < 2){
            var image = '<img src="img/example_film1.jpg" alt="" title="" width="267" height="172" />';
            $('#image_ranquing').append(image);
            image = '<img src="img/example_film2.jpg" alt="" title="" width="267" height="172" />';
            $('#image_genere').append(image);
        }
        else
        {
            var randomnumber=Math.floor(Math.random()*data.length);
            if(randomnumber == data.length){
                randomnumber = 0;
            }
            var image = '<a><img src="' + data[randomnumber].url +'" alt="" title="" width="267" height="172" /></a>';
            $('#image_ranquing').append(image);
            randomnumber = randomnumber + 1;
            if(randomnumber == data.length){
                randomnumber = 0;
            }
            image = '<a><img src="' + data[randomnumber].url +'" alt="" title="" width="267" height="172" /></a>';
            $('#image_genere').append(image);
        }
    });
}
