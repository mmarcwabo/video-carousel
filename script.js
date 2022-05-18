//start video-carousel.js

$(document).ready(function(){

    var $root = $(".video-carousel-root"),
        $slider = $root.find(".video-carousel-slider"),
        $slides = $slider.children("div"),
        slideWidth = $slides.width(),
        $leftButton = $root.find(".video-carousel-button-left"),
        $rightButton = $root.find(".video-carousel-button-right"),
        $allSlideButtons = $root.find(".video-carousel-button-left, .video-carousel-button-right"),
        $slideText = $root.find(".video-carousel-text"),
        isAnimating = false,
        transition = {"left":slideLeftTransition,"right":slideRightTransition},
        slideTimer, myPlayer, video_counter=0;

    setClasses();
    setText();

    if (!supportsTransitions()) transition = {"left":slideLeftNoTransition,"right":slideRightNoTransition};
    $allSlideButtons.click(slideButtonClick);
    $leftButton.click(transition.left);
    $rightButton.click(transition.right);
    //slideTimer = setInterval(transition.right, 7000);

    function slideButtonClick(){
        clearInterval(slideTimer);
        destroyVideoPlayer();
    }
    function slideLeftNoTransition(){
        $slider.prepend($slides.last());
        setClasses();
        setText();
    }
    function slideRightNoTransition(){
        $slider.append($slides.first());
        setClasses();
        setText();
    }
    function slideLeftTransition(){
        if(isAnimating) return;
        isAnimating = true;
        $slideText.empty();

        $slider.css("left", -slideWidth + "px");
        $slider.prepend($slides.last());
        setClasses();
        $slider.animate({left:"0px"}, 500, function(){
            setText();
            isAnimating = false;
        });
    }
    function slideRightTransition(){
        if(isAnimating) return;
        isAnimating = true;
        $slideText.empty();

        $slider.append($slides.first());
        setClasses();
        $slider.prepend($slides.last().clone());
        $slides = $slider.children("div");
        $slider.animate({left:-slideWidth + "px"}, 500, function(){
            $slides.eq(0).remove();
            setClasses();
            $slider.css("left", "0px");
            setText();
            isAnimating = false;
        });
    }


    function setClasses(){
        $slides = $slider.children("div");
        $slides.removeClass();
        $slides.eq(0).addClass("level1");
        $slides.eq(1).addClass("level2");
        $slides.eq(2).addClass("level3");
        $slides.eq(3).addClass("level2");
        $slides.eq(4).addClass("level1");

        $slides.off("click");
        $slides.eq(2).on("click", function(){
			var $this = $(this),
				player_id = $this.attr("id");
            clearInterval(slideTimer);
            createVideoPlayer($this.attr("data-vimeo-id"));
            
			dataLayer.push({'event': 'gaPushEvent','gaEventCategory': dataLayer[0].siteVersion+'_homepage','gaEventAction': 'click','gaEventLabel': player_id});

            video_counter ++;
            var s=s_gi(omniture_rsid);s.linkTrackVars = 'eVar5,eVar7,events';s.eVar5 = video_counter;s.eVar7 = player_id;s.linkTrackEvents="event5";s.events = 'event5';s.tl(this, 'o', 'Home');
			
        });
        $slides.eq(1).on("click", function(){slideButtonClick(); transition.left();});
        $slides.eq(3).on("click", function(){slideButtonClick(); transition.right();});
    }
    function setText(){
        $slideText.html($slides.eq(2).find("p").html());
    }

    function createVideoPlayer(source){
        var $container = $slides.eq(2).find(".panel"),
            playerWidth = $container.width(),
            playerHeight = $container.height(),
            $iframe = $("<iframe class='video' src='//player.vimeo.com/video/"+source+"?title=0&byline=0&portrait=0' width='300' height='168' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>");

        $container.append($iframe);
        myPlayer = $f($iframe[0]);
        $slides.eq(2).off("click");
        myPlayer.addEvent('ready', function() {
            myPlayer.api("play");
            myPlayer.addEvent('finish', destroyVideoPlayer);
        });
    }
    function destroyVideoPlayer(){
        if(myPlayer){
            var $slide = $slides.eq(2);
            myPlayer.api("pause");
            myPlayer = null;
            $slide.find("iframe").remove();
            $slides.eq(2).on("click", function(){
                createVideoPlayer($(this).attr("data-vimeo-id"));
            });
        }
    }

    function supportsTransitions() {
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';
        if (typeof s[p] == 'string') { return true; }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for (var i=0; i<v.length; i++) {
            if (typeof s[v[i] + p] == 'string') { return true; }
        }
        return false;
    }
});

//start jquery-carousel3.js

(function($) {

    $.fn.carousel = function(options) {
        return this.each(function () {
            var $root = $(this),
                $slides = $root.children().addClass("slide"),
                $viewport = $("<div class='viewport'/>").appendTo($root),
                $slideContainer = $("<div class='slides'/>").append($slides).appendTo($viewport),
                $pager = $("<div class='pager'/>").appendTo($root),
                $arrowPrevious = $("<div class='arrow arrow-previous'/>").appendTo($viewport),
                $arrowNext = $("<div class='arrow arrow-next'/>").appendTo($viewport),
                $pagerButtons,
                defaults = {showPager:true},
                settings = $.extend({}, defaults, options);

            if(settings.showPager) buildPager();
            showSlide(0);
            $root.show();

            $arrowPrevious.click(function () {
                showSlide($slideContainer.find(".selected").index() - 1);
            });
            $arrowNext.click(function () {
                showSlide($slideContainer.find(".selected").index() + 1);
            });

            function buildPager() {
                for (var i = 0, len = $slides.length; i < len; i++) {
                    $pager.append("<div class='pager-button'></div>");
                }
                $pagerButtons = $root.find(".pager-button");
                $pagerButtons.click(function () {
                    showSlide($(this).index())
                });
            }

            function showSlide(index) {
                if (index == -1) index = $slides.length - 1;
                else if (index == $slides.length) index = 0;

                $slides.removeClass("selected");
                $slides.eq(index).addClass("selected");

                if(settings.showPager){
                    $pagerButtons.removeClass("selected");
                    $pagerButtons.eq(index).addClass("selected");
                }
            }
        });
    };
}(jQuery));

//start mobile-video-carousel-nopage.js
$(document).ready(function(){

    var $videoMobileRoot = $(".videos-mobile-root"),
        $slider = $videoMobileRoot.find(".slider"),
        $slides = $videoMobileRoot.find(".slide"),
        $players = $slides.find("iframe"),
        $arrowLeft = $videoMobileRoot.find(".arrow-left"),
        $arrowRight = $videoMobileRoot.find(".arrow-right"),
		$allButtons = $videoMobileRoot.find(".arrow-left,.arrow-right"),
        slideWidth = $slides.width(),
        sliderTimer = setInterval(slideRight, 7000),
        isAnimating, allPlayers = [], video_counter=0;

    	
    //Click Events
    $allButtons.click(function(){clearInterval(sliderTimer); stopPlayers();});
    $arrowLeft.click(slideLeft);
    $arrowRight.click(slideRight);

    function slideLeft(){
        var currentIndex = parseInt($slider.css("left")) / -slideWidth;
        if(currentIndex == 0) slideTo($slides.length - 1);
        else slideTo(currentIndex - 1);
    }
    function slideRight(){
        var currentIndex = parseInt($slider.css("left")) / -slideWidth;
        if(currentIndex == $slides.length - 1) slideTo(0);
        else slideTo(currentIndex + 1);
    }
    function slideTo(index){
        if(isAnimating) return;
				isAnimating = true;
        $slider.animate({"left":-slideWidth * index},500, function(){
            isAnimating = false;
        });
    }
    
    $(window).resize(function(){
        slideWidth = $slides.width();        
    });

	$players.each(function(){
		var currentPlayer = $f(this);
		allPlayers.push(currentPlayer);
		currentPlayer.addEvent('ready', playerReady);
    });	
	function playerReady(player_id){
		var player = $f(player_id);
		player.addEvent('ready', function() {
			player.addEvent('play', function(e){
				clearInterval(sliderTimer);				

				//ga('send', 'event', 'v1_homepage', 'video', player_id);
                dataLayer.push({'event': 'gaPushEvent','gaEventCategory': dataLayer[0].siteVersion+'_homepage','gaEventAction': 'click','gaEventLabel': player_id});
				
                video_counter ++;
                var s=s_gi(omniture_rsid);s.linkTrackVars = 'eVar5,eVar7,events';s.eVar5 = video_counter;s.eVar7 = player_id;s.linkTrackEvents="event5";s.events = 'event5';s.tl(this, 'o', 'Home');
				
			});
        });
	}
	function stopPlayers(){
        var i= 0, len = allPlayers.length;
        for(i; i<len; i++){
            allPlayers[i].api("pause");
        }
    }

});