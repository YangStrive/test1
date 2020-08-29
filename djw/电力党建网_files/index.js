/* 96KaiFa原创源码，唯一官网：www.96kaifa.com */
/**
 * index js file
 *
 * @author: Hu Yali <huyali@123.com.cn>
 * @link:  www.123.com.cn
 * @copyright: Copyright 安徽黄埔网络科技有限公司All Rights Reserved
 */
$(function() {
    /**
     * 幻灯片播放
     */
    $(".fullSlide").slide({
        titCell: ".hd ul",
        mainCell: ".bd ul",
        effect: "leftLoop",
        vis: "auto",
        autoPlay: true,
        autoPage: true,
        interTime: 5000,
        trigger: "click"
    });

    /**
     * 推荐观点
     */
    $(".picScroll-top").slide({
        titCell: ".hd ul",
        mainCell: ".bd ul",
        autoPage: true,
        effect: "topLoop",
        autoPlay: true,
        vis: 3
    });


    /**
     * 时间轴滚动条
     */
    $('.time-line .slimscroll').slimScroll({
        height: '372px',
        size: '2px',
        color: '#666',
        borderRadius: '0',
        railVisible: false,
        alwaysVisible: false
    });

    /**
     * 通栏选项导航交互
     */
    $('.nav-tab a').mouseover(function() {
        var tabIndex = $(this).parent().index();
        var activeContent = $(this).closest('.module').find('.tab-cont').eq(tabIndex);
        var linkMore = $(this).closest('ul').next('.nav-tab-more').find('a');

        $(this).parent('li').addClass('active').siblings().removeClass('active');
        if (activeContent.hasClass('dn')) {
            activeContent.removeClass('dn').siblings('.tab-cont').addClass('dn').fadeOut(200);
            linkMore.eq(tabIndex).removeClass('dn').siblings().addClass('dn');
        }
    });
    $(".daodu .title-mod h3").hover(function() {
        $(this).addClass("daodu-current").siblings().removeClass("daodu-current");
        $(".daodu-tab>div").eq($(this).index()).removeClass('dn').siblings().addClass('dn');
        $(this).parent().find("div").eq($(this).index()).removeClass('dn').siblings().addClass('dn');

    });

    /**
     * 7*24小时
     */
    $('.hours-opt li').click(function() {
        if ($(this).hasClass('default')) {
            $(this).removeClass('default');
        } else {
            $(this).addClass('default');
        }
    });
    /**
     * 侧边栏交互
     */
    $('.sidebar li').hover(function() {
        $(this).addClass('open');
    }, function() {
        $(this).removeClass('open');
    });

    $('#scrollFloor li a').click(function() {
        var target = $(this).attr('href');
        var targetOffsetTop = $(target).offset().top;
        var barOffsetTop = ($(window).height() - $('#scrollFloor').height()) / 2 - 70;

        scrollBody(targetOffsetTop - barOffsetTop);

        return false;
    });

    $('#backTop a').click(function() {
        scrollBody(0);

        return false;
    });

    /*
     * 浏览器滚动条滚动事件
     */
    $(window).scroll(function() {
        var scrollTop = $(document).scrollTop();
        var windowHeight = $(window).height();
        var headerHeight = $('.nav').height() + $('.nav-log').height();
        //导航区顶部距离浏览器窗口位置
        var barOffsetTop = ($(window).height() - $('#scrollFloor').height()) / 2;
        //通栏模块滚动绑定位置与导航对齐
        var videoTop = $('#video').offset().top - barOffsetTop;
        var stockTop = $('#stock').offset().top - barOffsetTop;
        var financyTop = $('#financy').offset().top - barOffsetTop;
        var investTop = $('#invest').offset().top - barOffsetTop;

        /*侧边栏跟悬浮导航同时出现*/
        if (scrollTop > headerHeight) {
            $('#sidebar').addClass('show');
            $('.search-roll').slideDown();
        } else {
            $('#sidebar').removeClass('show');
            $('.search-roll').slideUp();
        }

        /*绑定滚动位置和侧边导航标签显示*/
        if (scrollTop > videoTop && scrollTop < stockTop) {
            $('#scrollFloor .floor1').addClass('open').siblings('li').removeClass('open');
        } else if (scrollTop > stockTop && scrollTop < financyTop) {
            $('#scrollFloor .floor2').addClass('open').siblings('li').removeClass('open');
        } else if (scrollTop > financyTop && scrollTop < investTop) {
            $('#scrollFloor .floor3').addClass('open').siblings('li').removeClass('open');
        } else if (scrollTop > investTop && scrollTop < ($('#invest').height() + $('#invest').offset().top - 300)) {
            $('#scrollFloor .floor4').addClass('open').siblings('li').removeClass('open');
        } else {
            $('#scrollFloor li').removeClass('open');
        }
    });

    //品牌栏目
    $(".column ul li").first().find("i").addClass("dn");
    $(".column ul li").hover(function() {
        $(this).find("p").removeClass("dn").parent("li").siblings().children("p").addClass("dn");
        $(this).find("i").addClass("dn").parent("li").siblings().children("i").removeClass("dn");
    });
});


//行情中心

var gupiaoDomain = '';
var optionalSecurityIDs = '';
var url = "http://hq.9666.cn";
var staticImageRoot = "http://img.9666sr.com/sr";
$(function() {
    new optionSecurity(url, optionalSecurityIDs, 5000, "");
    new categoryRank(url, 5000);
    creatExpMinChart(url, 60000);
});
$("#hqTu .menuNo").click(function() {
    var text = $(this).find('.menuName .menuName-text').text();
    $(this).find('.blank').append($('.zoushi'));
    $(this).find("#expTip span i").text(text);
});
$('#hqTu li').each(function(i, n) {
    var dataId = $(n).attr('id');
    var dataUrl = url + "/exp/min?securityID=" + dataId + '&callback=?'; //获取数据的链接
    $.ajax({
        type: 'get',
        url: dataUrl,
        dataType: 'jsonp',
        success: function(data) {
            if (data.minData.length < 1) return false;
            var dataContainer = $(n).find('.chartData').eq(0);
            var dataLength = data.minData.length; //获取数据的长度
            var stringData = data.minData[dataLength - 1].split('|'); //获取最新的数据
            var price = Number(stringData[1]).toFixed(2); //保留2位小数
            var precent1 = stringData[2];
            var precent2 = stringData[3] + '%';
            if (stringData[2] > 0) //判断大小，正数添加加号，颜色变红
            {
                dataContainer.addClass('red');
                precent1 = '+' + stringData[2];
            }
            var dataHtml = '<b>' + price + '<\/b>' + '<em>' + precent1 + '<\/em>' + '<em>' + precent2 + '<\/em>';
            dataContainer.html(dataHtml);
        }
    });
});