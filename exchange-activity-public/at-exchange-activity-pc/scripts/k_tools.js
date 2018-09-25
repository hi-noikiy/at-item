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
          var Authorization = $.cookie("token") || '';
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