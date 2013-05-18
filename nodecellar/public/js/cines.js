function veureCines(){
    amagar();

    desactivarMenus();
    $('#menu_cinemes').addClass('active');

    var cines;
    var llistat = '<div id="inici_cines">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a class="active2">Cines</a>' +
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
            '<a onclick="javascript:veureHome()" style="cursor: pointer;">Home</a> > <a onclick="javascript:veureCines()">Cinemes</a> > <a class="active2">'+cineNom+'</a>' +
            '</div>';

        llistat = llistat + '<div class="cine">' +
            '<div class="cine_image"><img src="'+cine.image+'" alt="" title="'+cine.name+'" height="325" width="320" /></div>' +
            '<div class="cine_info">' +
            '<div class="cine_name">'+cine.name+'</div>' +
            '<div class="cine_direction"><span>Adreça:</span> '+cine.direction+'</div>' +
            '<div class="cine_city"><span>Ciutat:</span> '+cine.city+'</div>' +
            '<div class="cine_phone"><span>Telèfon:</span> '+cine.phone+'</div>' +
            '<div class="cine_email"><span>Email:</span> '+cine.email+'</div>' +
            '<div class="pelicula-rating"><span>Puntuació:</span> '+ (rating == 0? '-':rating) +'</div>' +

            '<div class="votar-cine" id="votar-cine"><span>Votar:</span> ';
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
            latitud = cine.latitud;
            longitud = cine.longitud;
            cine_name = cine.name;
            loadScript();
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
                latitud = cine.latitud;
                longitud = cine.longitud;
                cine_name = cine.name;
                loadScript();
                $('#main').append(llistat);
            });
        }

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
                                        //veureCine(id, cineNom);
                                        socket.emit('votar_cine', id, cineNom);
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
                                        //veureCine(id, cineNom);
                                        socket.emit('votar_cine', id, cineNom);
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
