/* 96KaiFa原创源码，唯一官网：www.96kaifa.com */

$('IndexSearch_q').val('');
//7*24小时 zzz 开始
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
var T, page = 1, lock = false, auto = false, sound = false, Timer, S = 60, max_id = 1398, againFlag = false,first = true;
$(function () {
    $('.sound').addClass('default');//2016-02-24声音图标默认关闭
    $(".sound").click(function () {
        
        sound = (sound == false) ? true : false;
        if(sound == false)
        {
            $(this).addClass('default');
        }else if(sound == true)
        {
            $(this).removeClass('default');
        }
    });
    
    $('.fresh').addClass('default');//2016-02-24声音图标默认关闭
    $('.fresh').click(function () {
        
        auto = (auto == false) ? true : false;
        if(auto == false)
        {
            $(this).addClass('default');
            clearInterval(Timer);
        }else if(auto == true)
        {
            $(this).removeClass('default');
            againFlag = true;
            auto_refresh();
        }
    });
    //第一次加载
    $.ajax({
        type: "get",
        url: "http://live.123.com.cn/all_1/?p=1&json=1&catid=0&rnd=" + Math.random(),
        dataType: 'jsonp',
        success: function (data) {
            var html = '';
            $.each(data, function (key, val) {
                if (key === 0) {
                    max_id = val.ID;
                }
                var _date = new Date(val.CREATEDATE.substr(0, 19).replace(/-/g, "/"));
                html += '<li><em></em><p>' + val.NEWSCONTENT.replace(/<\/?[^>]*>/g, '') + '</p><div><span>' + checkTime(_date.getHours()) + ':' + checkTime(_date.getMinutes()) + '</span></div></li>';
            });
            $(".time-line ul").append(html);
        },
        error: function (data) {
            //alert('获取7*24小时直播数据出错！');
        }
    });
    auto_refresh();
    if(first){ 
        clearInterval(Timer); 
        first = false;
    }
});
var auto_refresh = function () {
    
    S = (againFlag == true)? Number($('.fresh b').html())-1 : 60;//刷新时间
    S = (S > 0)? S : 60;//刷新时间
    
    $('.fresh').html('<i></i><b>'+S+'</b>秒后自动更新');
    
    setTimeout(function () {
        $('#message').remove();
    }, 10000);
    
    Timer = setInterval(function () {
        S -= 1;
        $('.fresh b').html(S);
        if (S == 0) {
            $('.fresh').html('数据更新中......');
            clearInterval(Timer);
            $.ajax({
                type: "post",
                url: "http://live.123.com.cn/index/checkUpdate.html?rnd=" + Math.random(),
                data: {max_id: max_id, catid: 0, json: 1},
                dataType: 'jsonp',
                success: function (data) {
                    if (data.count != 0) {
                        var html = '';
                        $.each(data.data, function (key, val) {
                            var _date = new Date(val.CREATEDATE.substr(0, 19).replace(/-/g, "/"));
                            html += '<li><em></em><p>' + val.NEWSCONTENT.replace(/<\/?[^>]*>/g, '') + '</p><div><span>' + checkTime(_date.getHours()) + ':' + checkTime(_date.getMinutes()) + '</span></div></li>';
                        });
                        $(".time-line ul li:first").before(html);
                        
                        if (sound) {
                            $('body').append('<embed style="display:none;" id="message" autostart="true" hidden="true" src="http://live.123.com.cn/Public/CloudStatic/live/message.mp3"/>');
                        }
                        max_id = data.max_id;
                    }
                    
                    auto_refresh();
                }
            });
        }
    }, 1000);
};


//云掌财经首页搜索
$(function () {
    $("#IndexSearch p span").click(function(){
        var SubmitTo = $(this).attr('s');
        //赋值s
        if(SubmitTo != 'doctor' && SubmitTo != 'guba')
        {
            $('#IndexSearch_s').val(SubmitTo);
        }
        
        if(SubmitTo == 'guba'){
            $('#IndexSearch').attr('action','http://www.guba.com/search.php?mod=forum');
            $('#IndexSearch').attr('method','post');
            
            $('.srchtxt1').attr('id',"srchtxt" );
            $('.srchtxt2').attr('id',"" );
        }else
        {
            $('#IndexSearch').attr('action','http://zhannei.baidu.com/cse/search');
            $('#IndexSearch').attr('method','get');
        }
    });
    
    $("#IndexSearch2 p span").click(function(){
        var SubmitTo = $(this).attr('s');
        if(SubmitTo != 'doctor' && SubmitTo != 'guba')
        {
            $('#IndexSearch_s2').val(SubmitTo);
        }
        
        if(SubmitTo == 'guba'){
            $('#IndexSearch2').attr('action','http://www.guba.com/search.php?mod=forum');
            $('#IndexSearch2').attr('method','post');
            
            $('.srchtxt2').attr('id',"srchtxt" );
            $('.srchtxt1').attr('id',"" );
        }else
        {
            $('#IndexSearch2').attr('action','http://zhannei.baidu.com/cse/search');
            $('#IndexSearch2').attr('method','get');
        }
    });
    $("#IndexSearch_q2").focus(function(){
        $('.srchtxt2').attr('id',"srchtxt" );
        $('.srchtxt1').attr('id',"" );
    });
    
    $("#IndexSearch_q").focus(function(){
        $('.srchtxt1').attr('id',"srchtxt" );
        $('.srchtxt2').attr('id',"" );
    });
});

//doctor检索
var open_flag = true;
var search_doctor_data;
function checkForm()
{
    var SubmitTo = $("#IndexSearch p span.on").attr('s');
    var key = $('#IndexSearch_q').val();

    //对默认值校验 搜你想要~  doctor 输入股票/基金代码
    if(key == '')
    {   
        if(SubmitTo == '17238891117454760778')
        {
            var jump = $('#topicHref').attr('href');
            window.open(jump);
            return false;
        }
        var msg = (SubmitTo == 'doctor' || SubmitTo == 'guba')? '请输入个股代码或简称' : '请输入关键字';
        alert(msg);
        return false;
    }
    if(SubmitTo == 'doctor')
    {
        $.ajax({
            url: "http://www.123.com.cn/DoctorApi/ajax.php?code="+key,
            dataType: 'json',
            async: false,
            success: function (data) {
                var size =0;
                var flag = false;
                for (key1 in data) {
                    if (data.hasOwnProperty(key1)) size++;
                }
                search_doctor_data = data;
                flag = (size == 1)? true:false;
                open_flag = flag;
                if(!flag)
                {
                    alert('输入的股票不存在');return false;
                }
            }
        });
        if(open_flag) {
            window.open("http://doctor.123.com.cn/"+search_doctor_data[0]['code']+"/");
        }
        //300282       
        return false;
    }else if(SubmitTo == 'guba')
    {
        $('#srchtxt').val(key);
        return true;
    }else{
        return true;
    }
}

//doctor检索
var open_flag2 = true;
var search_doctor_data2;
function checkForm2()
{
    //资讯 股吧 博客 诊股
    var SubmitTo = $(".label-on span").html();
    var key = $('#IndexSearch_q2').val();
    //对默认值校验 搜你想要~  doctor 输入股票/基金代码
    if(key == '')
    {   
        if(SubmitTo == '资讯')
        {
            var jump = $('#topicHref').attr('href');
            window.open(jump);
            return false;
        }
        
        var msg = (SubmitTo == '诊股' || SubmitTo == '股吧')? '请输入个股代码或简称' : '请输入关键字';
        alert(msg);
        return false;
    }
    if(SubmitTo == '诊股')
    {
        $.ajax({
            url: "http://www.123.com.cn/DoctorApi/ajax.php?code="+key,
            dataType: 'json',
            async: false,
            success: function (data) {
                var size =0;
                var flag = false;
                for (key1 in data) {
                    if (data.hasOwnProperty(key1)) size++;
                }
                search_doctor_data2 = data;
                flag = (size == 1)? true:false;
                open_flag2 = flag;
                if(!flag)
                {
                    alert('输入的股票不存在');
                    return false;
                }
            }
        });
        if(open_flag2) {
            window.open("http://doctor.123.com.cn/"+search_doctor_data2[0]['code']+"/");
        }
        //300282       
        return false;
    }else if(SubmitTo == '股吧')
    {
        $('#srchtxt').val(key);
        return true;
    }else{
        return true;
    }
}

//校验股票代码是否存在
function checkStock(key)
{
    var size =0;
    var flag = false;
    $.ajax({
        url: "http://www.123.com.cn/DoctorApi/ajax.php?code="+key,
        dataType: 'json',
        success: function (data) {
            for (key1 in data) {
                if (data.hasOwnProperty(key1)) size++;
            }
            flag = (size == 1)? true:false;
        }
    });
    
    return flag;
}
//7*24小时 zzz 结束
g_quote(0);
stock_interval = setInterval('g_quote(1)', 12000);

function decimal(x) {
   var f = parseFloat(x);    
    if (isNaN(f)) {    
        return '0.00';    
    }    
    var f = Math.round(x*100)/100;    
    var s = f.toString();    
    var rs = s.indexOf('.');    
    if (rs < 0) {    
            rs = s.length;    
            s += '.';    
    }    
    while (s.length <= rs + 2) {    
            s += '0';    
    }    
    return s;
}
    
function g_quote(type) {
   if(type == 1)
   {
       var c_time = new Date().getTime();
       var c_time2 = new Date();

       var ymd = c_time2.getFullYear()+'-'+(c_time2.getMonth()+1)+'-'+c_time2.getDate();
       var stock_start_time = Date.parse(ymd+" 09:30:00");
       var stock_stop_time = Date.parse(ymd+" 15:00:00");

       if (!(c_time >= stock_start_time && c_time <= stock_stop_time)) {
           clearInterval(stock_interval);
           return false;
       }
   }

   //全球指数
   $.ajaxSetup({
       cache: true
   });
   $.getScript('http://hq.sinajs.cn/rn=1482662684252&list=s_sh000001,s_sz399001,s_sh000300,s_sz399006,gb_$dji,gb_ixic,gb_$inx,b_TXEQ,r_HSI,b_NKY,b_KOSPI,b_SENSEX,b_UKX,b_INDEXCF,b_DAX,b_CAC', function () {
       var dataName = ['s_sh000001','s_sz399001','s_sh000300','s_sz399006','gb_$dji','gb_ixic','gb_$inx','b_TXEQ','r_HSI','b_NKY','b_KOSPI','b_SENSEX','b_UKX','b_INDEXCF','b_DAX','b_CAC'];
       $.each(dataName,function(index,item){
           addData(eval('hq_str_'+item),index);
       });
   });
}

function addData(str,num){
    var str = str.split(",");
    var className = '';
    var i = 3;
    var _html = '';
    var _li = $('.header-data-con').find('li').eq(num).find('span');
    
    //英国富时指数	俄罗斯MICEX		德国DAX指数		法国CAC40指数
    if(str[0] == 'S&P/TSX平均指数')
    {
        str[0] = '加拿大GSPTSE';
    }else if(str[0] == '俄罗斯MICEX指数')
    {
        str[0] = '俄罗斯MICEX';
    }else if(str[0] == '标普指数')
    {
        str[0] = '标普500';
    }else if(str[0] == '日经225指数')
    {
        str[0] = '日经225';
    }else if(str[0] == '韩国KOSPI指数')
    {
        str[0] = '韩国KOSPI';
    }else if(str[0] == '印度孟买30指数')
    {
        str[0] = '印度SENSEX';
    }else if(str[0] == '富时100指数')
    {
        str[0] = '英国富时';
    }else if(str[0] == '国DAX指数')
    {
        str[0] = '德国DAX';
    }else if(str[0] == '法国CAC40指数')
    {
        str[0] = '法国CAC40';
    }
    
    _li.eq(0).html(str[0]+'：');
    _li.eq(1).html(decimal(str[1]));
    if(str[0] == '道琼斯' || str[0] == '纳斯达克' || str[0] == '标普500')
    {
        i = 2;
    }
    
    if(str[i] != 0)
    {
        _html = "<em></em>";
    }
    _li.eq(2).html(decimal(str[i])+'%'+_html);

    if(str[i] > 0)
    {
        _li.eq(1).removeClass('text-green');
        _li.eq(1).addClass('text-red');
        
        _li.eq(2).removeClass('data-wave-green');
        _li.eq(2).addClass('data-wave-red');
    }else if(str[i] < 0){
        _li.eq(1).removeClass('text-red');
        _li.eq(1).addClass('text-green');
        
        _li.eq(2).removeClass('data-wave-red');
        _li.eq(2).addClass('data-wave-green');
    }else if(str[i] == 0){
        _li.eq(1).removeClass('text-red');
        _li.eq(1).removeClass('text-green');
        
        _li.eq(2).removeClass('data-wave-red');
        _li.eq(2).removeClass('data-wave-green');
    }
}
