if(window.localStorage.getItem("now_new_lang")){
    langPkg.loadProperties(window.localStorage.getItem("now_new_lang"));
    if(langPkg.now_lang == "zh"){

    }else{

    }
}else{
    langPkg.loadProperties("zh");
}
