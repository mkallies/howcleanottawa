var counter = 0;
function changeBG(){
    var imgs = [
        "url(../images/1.png)",
        "url(../images/3.png)",
        "url(../images/4.png)",
        "url(../images/5.png)"
      ];

    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);

    counter++;
}

  setInterval(changeBG, 5000);
