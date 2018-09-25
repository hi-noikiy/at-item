

/**
 * [getAppUrlFetchLanguage 从app获取得语言设置]
 */
getAppUrlFetchLanguage();
function getAppUrlFetchLanguage(){
  var url = window.location.href;
  alert(url)
  if(url.indexOf("lang=") !== -1){
    var langObj = urlArgs()
    langPkg.loadProperties(langObj.lang);
  }else{
    langPkg.loadProperties("zh");
  }
}

/*
*提取URL的搜索字符串的参数
* @ 这个函数用来解析来自URL的查询串中的name=value参数对
* @ 它将name = value对存储在一个对象的属性中,并返回该对象
* @ 这样来使用它
* @ var args = urlArgs();      //从URL中解析参数
* @ var q = args.q || "";      //如果参数没定义就使用一个默认值
* @ var n = args.n ? parseInt(args.n) : 10;
*/
function urlArgs(){
    var args = {};      //定义一个空对象
    var query = window.location.search.substring(1);    //查找到查询 串,并去掉"?"
    // console.log(query);                         //Alan=123&Alan2=234
    var pairs = query.split("&");               //根据"&"符号将查询字符串分隔开
    // console.log(pairs);                         //["Alan=123", "Alan2=234"]
    for(var i = 0; i < pairs.length; i++){
        var pos = pairs[i].indexOf("=");        //查找"name=value";
        if(pos == -1){                          //如果没找到的话,就跳过
            continue;
        }
        var name = pairs[i].substring(0,pos);   //提取name,  "Alan","Alan2"
        var value = pairs[i].substring(pos+1);  //提取value, "123","234"
        value = decodeURIComponent(value);      //对value进行解码,decodeURIComponent() 对编码后的 URI 进行解码
        args[name] = value;                     //存储为属性
    }
    return args;                                //返回解析后的参数
}