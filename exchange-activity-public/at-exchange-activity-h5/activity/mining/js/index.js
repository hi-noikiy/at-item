/*
* @初始化页面时调用一次
* @api/activity/initPool
* @参数: 无
*/
var Timer = null;
var userId = null;
var options = {
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
};
var number = 0;
var demo = null;
var clock = null;

/**
 * [bounsDetail 重置数据]
 * @param  {[object]} pool_info [接口返回的pool对象]
 */
function bounsDetail(pool_info){
  $("#force").text(pool_info.totalKeys)     // 总算力
  $("#award").text(pool_info.totalBonus)    //总分红
  $("#force_trade").text(pool_info.keysAmount) //获取算力交易额
  //总奖金
  number = pool_info.totalReward;
  demo = new CountUp('in_all_money', 0, number , 2, 0.5, options);
  if (!demo.error) {
    demo.start();
  } else {
    console.error(demo.error);
  }
}

/**
 * [userDetail 用户登陆的算力]
 * @param  {[type]} person [api/activity/initPool返回接口对象]
 */
function userDetail(person){
  if(!(typeof $.cookie("token") === "undefined") && $.cookie("token") !== ""){
    $(".my_user_btn").text(person.user.showNickName)
    if(person.userKeys && typeof(person.userKeys) !== "undefined"){
      $("#my_force").text(person.userKeys.keys)
      userId = person.user.id;
    }else{
      $("#my_force").text(0)
    }
  }else{
    $("#my_force").text("--")
  }
}
/**
 * [timeDonw 倒计时]
 * @param  {[number]} tims [时间戳]
 * callbacks 倒计时结束回调
 */
function timeDonw(tims){
  // 倒计时
  if(tims > 0){
    // 初始化 FlipClock
    clock = new FlipClock($('#clock'), tims, {
      clockFace: 'HourlyCounter',
      countdown: true,
      callbacks: {
        // 倒计时结束
        // stop: function() {
        //   setTimeout(function(){
        //     $(".clock_line").addClass("finish");
        //   }, 1000)
        // }
      }
    });
  }
}

/**
 * [noBouns 没有人中奖, 没有人下单]
 */
function noBouns(){
  $("#bonus_person_one").hide();
  $("#bonus_person_two").hide();
  $(".time_box_wrap, .get_force, .nav_detail").removeClass("show_data").addClass("hide_data");
  $(".winning_window_end").removeClass("hide_data").addClass("show_data");
}
/**
 * [finishBouns 开奖刷新]
 * @param  {[object]} settl [中奖新增加的对象字段]
 */
function finishBouns(settl){
  if (settl && typeof(settl) != "undefined"){
    var userkeysL = settl.userKeys;
    $("#bouns_money_all").text(settl.amount)
    if(userkeysL.length === 0){
      $("#bonus_person_one").hide();
      $("#bonus_person_two").hide();
    }else if(userkeysL.length === 1){
      $("#bonus_person_one em").text(userkeysL[0].phone)
      $("#bonus_person_two").hide();
    }else{
      $("#bonus_person_one em").text(userkeysL[0].phone)
      $("#bonus_person_two em").text(userkeysL[1].phone)
    }
  }
  $(".time_box_wrap, .get_force, .nav_detail").removeClass("show_data").addClass("hide_data");
  $(".winning_window_end").removeClass("hide_data").addClass("show_data");
}

/**
 * getPersonageDetail  ==> 初始化信息
 * api/activity/initPool ==> 请求接口, 一些初始化东西
 */
getPersonageDetail();
function getPersonageDetail(){
  $.ajaxSendData('', "api/activity/initPool", function (resData) {
    console.log(resData.data);
    // 交易金额
    var pools = resData.data.pool;
    bounsDetail(pools)
    userDetail(resData.data)
    // 算力排行
    var ranking_temp = { "list": resData.data.keysRanking};
    var _html = template('rankingTemp', ranking_temp);
    $("#ranking_ul").html(_html);

    // 中奖名单
    var bonusPool = resData.data.rewardName.data;
    if (resData.data.rewardName.totalSize > 0) {
      var da = { "list": bonusPool};
      var _html = template('bonusPoolTemp', da);
      $("#bounds_ul").html(_html);
    }else{
      // 没有中奖列表
      $(".rank_list_item_cup").find(".none_data").removeClass("hide").addClass("show")
      $(".rank_list_item_cup").find(".has_detail").removeClass("show").addClass("hide")
    }
    // 交易获取算力轮播
    var tradelog_temp = { "list": resData.data.tradelog};
    var _html = template('tradelogTemp', tradelog_temp);
    $("#move_force").html(_html);
    // 进行中
    if(resData.data.pool_status === "run"){
      timeDonw(pools.overTime)
      $(".nav_top_wrap, .time_box_wrap, .get_force, .nav_detail").addClass("show_data");
      $(".all_force_get").removeClass("hide").addClass("show");
    }else if(resData.data.pool_status === "end"){
      var pools = resData.data.pool;
      // 已开奖
      if(pools.isSettlement === 1){
        finishBouns(resData.data.settlementInfo)
        if (!resData.data.settlementInfo){
          // $(".bonus_pools p").hide();
          $(".bonus_person").hide();
        }
        
      }else{
        // 未开奖
        $(".clock_line").addClass("finish");
        $(".nav_top_wrap, .get_force, .time_box_wrap").addClass("show_data");
        $(".all_force_get").removeClass("show").addClass("hide");
      }
    }
    connect();
  })
}

/**
 * [connect webSocke调用]
 */
function connect() {
  var socket = new SockJS($.gateway + "/api/socket");
  var stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
      stompClient.debug = function(message) {
          return null;
      };
      if(userId){
        /*
        * 1.用户总算力
        * return {JSON}
        */
        stompClient.subscribe('/topic/user/total_keys/' + userId, function(message){
          $("#my_force").text(message.body)
          userDetail(resData.data)
        });
      }

      /*
      * 2.算力滚动
      * return {String}
      */
      stompClient.subscribe('/topic/pool/total_keys/log', function(message){
        var data = JSON.parse(message.body);
        // console.log(data)
        $("#move_force").prepend("<li>用户" + data.phone + "通过交易获得" + toChinese(data.keys) + "个算力</li>")
        if($("#move_force li").length > 10){
          setTimeout(function(){
            $("#move_force").find("li:last").remove();
          }, 1000)
        }
      });

      /*
      * 3.算力排行
      * return {JSON}
      */
      stompClient.subscribe('/topic/pool/keys_ranking', function(message){
        var data = JSON.parse(message.body);
        var keysranking = { "list": data};
        var _html = template('rankingTemp', keysranking);
        $("#ranking_ul").html(_html);
      });
      /*
      * 4.活动中奖奖池
      * return {JSON}
      */
      stompClient.subscribe('/topic/pool/pool_info', function(message){
        var data = JSON.parse(message.body);
        bounsDetail(data)
        timeDonw(data.overTime)
      });

      // 订阅活动开奖信息，返回值JSON
      stompClient.subscribe('/topic/pool/pool_result_info', function(message){
        if(message.body == 'NO_RESULT'){
          noBouns();
        }else{
          var data = JSON.parse(message.body);
          finishBouns(data)
        }
      });
  });
}

function disconnect() {
  if (stompClient != null) {
      stompClient.disconnect();
  }
}

function sendMessage() {
  var message = $("#message").val();
  var topic = $("#topic").val();
  stompClient.send(topic, {}, message);
}

var bounsNumber = 10;
$(".rank_cup_more").on("click", "a", function(){
  bounsNumber += 10;
  bonusFun(bounsNumber)
})

/**
 * [bonusFun 中奖名单点击更多请求]
 * @param  api/activity/queryRewardNameList
 * @param pageSize 页面显示多少条
 */
function bonusFun(pageSize){
  var bonusPool = null;
  var param = {
    pageNo: 1,     //页码
    pageSize: pageSize   //每页大小
  }
  $.ajaxSendData(param, "api/activity/queryRewardNameList", function (resData) {
    bonusPool = resData.data.pool_status;
    var da = { "list": resData.data.data};
    var _html = template('bonusPoolTemp', da);
    $("#bounds_ul").html(_html);
  })
}


// 弹窗
$(".rule_btn").on("click", function(){
  $(".shadow_popUp").show();
  setTimeout(function(){
    $(".shadow_popUp").addClass("active");
  }, 0)
});

$(".shadow_pop, .shadow_close").on("click", function(){
  $(".shadow_popUp").removeClass("active");
  setTimeout(function(){
    $(".shadow_popUp").hide();
  }, 300)
})

// 切换
$(".rank_nav").on("click", "a", function(){
  var i = $(".rank_nav a").index($(this));
  $(".rank_nav a").eq(i).addClass("active").siblings().removeClass("active");
  $(".rank_list_wrap .rank_list_item").eq(i).addClass("active").siblings().removeClass("active");
})

/**
 * [toChinese 数字转化中文]
 * @param  {[number]} section [数字]
 */
function toChinese (number) {
  /*
   * 单位
   */
  var units = '个十百千万@#%亿^&~';
  /*
   * 字符
   */
  var chars = '零一二三四五六七八九';
  var a = (number + '').split(''), s = [];
  if (a.length > 12) {
    throw new Error('too big');
  } else {
    for ( var i = 0, j = a.length - 1; i <= j; i++) {
      if (j == 1 || j == 5 || j == 9) {// 两位数 处理特殊的 1*
        if (i == 0) {
          if (a[i] != '1')
            s.push(chars.charAt(a[i]));
        } else {
          s.push(chars.charAt(a[i]));
        }
      } else {
        s.push(chars.charAt(a[i]));
      }
      if (i != j) {
        s.push(units.charAt(j - i));
      }
    }
  }
  // return s;
  return s.join('').replace(/零([十百千万亿@#%^&~])/g, function(m, d, b) {// 优先处理 零百 零千 等
    b = units.indexOf(d);
    if (b != -1) {
      if (d == '亿')
        return d;
      if (d == '万')
        return d;
      if (a[j - b] == '0')
        return '零'
    }
    return '';
  }).replace(/零+/g, '零').replace(/零([万亿])/g, function(m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
    return b;
  }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function(m) {
    return {
      '@' : '十',
      '#' : '百',
      '%' : '千',
      '^' : '十',
      '&' : '百',
      '~' : '千'
    }[m];
  }).replace(/([亿万])([一-九])/g, function(m, d, b, c) {
    c = units.indexOf(d);
    if (c != -1) {
      if (a[j - c] == '0')
        return d + '零' + b
    }
    return m;
  });
}

/*
* APP跳到交易市场
 */
// IOS 从APP接收数据
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

setupWebViewJavascriptBridge(function(bridge) {
  var callbackButton = document.getElementById('goAPP_page')
  callbackButton.onclick = function(e) {
      bridge.callHandler('goTrade', function responseCallback(response) {
          
      })
  }
})

var goAppAndroidPage = function(){
  var result = window.android ? window.android.toTradeCenter() : null
  if (result) {
    // alert ("可以调用, token值是:" + result)
    return result;
  }else{
    $("#goAPP_page").attr("href", "https://testm.at3.com/tradingCenter/quotation")
  }
};
$("#goAPP_page").on("click", function(){
  goAppAndroidPage();
})

