var IOSAPPGETTOKEN;
var ANDROIDAPPGETTOKEN;
var Authorization = "";
var getToken = null;
// IOS 从android接收数据
ANDROIDAPPGETTOKEN = function(){
  var result = window.android ? window.android.androidAppToken() : null
  if (result) {
    return result;
  }
  return result;
};
(function ($) {
  // var gateway = "https://testwebapi.at3.com/";
  var gateway = "https://testactapi.at3.com/";
  //扩展jQuery对象本身
  jQuery.extend({
    "gateway": gateway,
    "ajaxSendData": function (dataobj, strApi, callback, errorback) {
      var _this = this;
      var data;
      $.ajax({
        type: "POST",
        timeout: 30000, //超时时间设置，单位毫秒
        url: gateway + strApi,
        data: JSON.stringify(dataobj),
        async: true,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        beforeSend: function (xhr) {
            // 1.PC的token
            Authorization = $.cookie("token") || '';
            /*
            * 1.先取得PC的token
            * 2.if再判断获取android的token
            * 3.else然后IOS的token
            * 4.最后是PC没有token为""
            */
            if(!Authorization){
              // 2.Android
              if(window.android){
                var androidRetrunValue = ANDROIDAPPGETTOKEN();
                Authorization = androidRetrunValue;
              }else{
                // 3.IOS
                if(window.location.href.indexOf("token=") !== -1){
                  var iosRetrunValue = window.location.href.split("token=");
                  Authorization = iosRetrunValue[iosRetrunValue.length-1]
                }else{
                  // 4.PC没有token
                  Authorization = '';
                }
              }
            }
            xhr.setRequestHeader("exchange-token", Authorization);
            xhr.setRequestHeader("exchange-client", 'pc');
            xhr.setRequestHeader("exchange-language", 'zh_CN');
        },
        complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
          if (status == 'timeout') { //超时,status还有success,error等值的情况
            return {
              code: -101,
              msg: "请求超时"
            }
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          data = XMLHttpRequest.responseJSON;
        },
        success: function (resdata) {
          if ( resdata.code == 401 || resdata.code == 402 || resdata.code == 403 || resdata.code == 203  ) {
              return;
          }
          if ( resdata.code == 504 ){
              window.location.reload();
              return;
          }else {
              data = resdata;
          }
          
          if(callback){
              callback(resdata);
          }
        }
      });
      return data;
    }
  });
})(window.jQuery);