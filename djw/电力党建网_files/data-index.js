/* 96KaiFa原创源码，唯一官网：www.96kaifa.com */
$(function () {
    $('#data-list-a ul').animate({marginTop: "0px"}, 300);
    $('#data-list-b ul').animate({marginTop: "0px"}, 500);
    $('#data-list-c ul').animate({marginTop: "0px"}, 700);
    $('#data-list-d ul').animate({marginTop: "0px"}, 900);
    setTimeout(function () {
        $('#data-list-a').AudioScroll({
            timer: 1500
        });
        $('#data-list-b').AudioScroll({
            timer: 2000
        });
        $('#data-list-c').AudioScroll({
            timer: 2500
        });
        $('#data-list-d').AudioScroll({
            timer: 3000
        });
    }, 1000);
});

/*
 *  上下滚动函数
 *  @method  fn.AudioScroll({})
 * @returns {undefined}
 */
(function () {
    $.fn.AudioScroll = function (settings) {
        var defaults = {
            timer: 3000,
            autoPlay: true,
            effect: 'slide'    //或slide
        };
        var settings = $.extend(defaults, settings);

        return this.each(function () {
            settings.moduleId = "#" + $(this).attr("id");
            var timerName = settings.moduleId;
            var activeNewsId = 1;

            if (settings.autoPlay)
            {
                timerName = setInterval(function () {
                    modulePlay('top');
                }, settings.timer);

                $(settings.moduleId).hover(function () {
                    clearInterval(timerName);
                }, function () {
                    timerName = setInterval(function () {
                        modulePlay('top');
                    }, settings.timer);
                });
            } else
            {
                clearInterval(timerName);
            }

            function modulePlay(direction) {
                if (direction == "top")
                {
                    $(settings.moduleId + ' ul').animate({
                        marginTop: -($(settings.moduleId + ' ul li').height())
                    }, function () {
                        $(this).css({marginTop: "0px"}).find("li:first").appendTo(this);
                    });
                } else
                {
                    if (activeNewsId - 2 == -1)
                    {
                        activeNewsId = $(settings.moduleId + ' ul li').length;
                    } else
                    {
                        activeNewsId = activeNewsId - 1;
                    }
                }
            }
        });
    };
})(jQuery);