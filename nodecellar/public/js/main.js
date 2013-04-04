
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

                var item;
                item = '<div class="loggin" id="info-user-logged"><div style="margin-top:25px;"> Benvingut,  ' + data.name +
                    '. <span/><a onclick="javascript:logut()" style="text-decoration: underline; cursor: pointer !important;">logout</a></div></div>';
                $('#user-info').append(item);
                $('#loggin-box').hide();
            }
            else{
                alert("L'usuari i/o la contrasenya són incorrectes");
            }
        });
    }
}
function logut(){
    $('#info-user-logged').hide();
    $('#login-password').val('');
    $('#loggin-box').show();
}