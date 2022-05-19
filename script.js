//start video-carousel.js

$(document).ready(function () {

    var $root = $(".video-carousel-root"),
        $slider = $root.find(".video-carousel-slider"),
        $slides = $slider.children("div"),
        slideWidth = $slides.width(),
        $leftButton = $root.find(".video-carousel-button-left"),
        $rightButton = $root.find(".video-carousel-button-right"),
        $allSlideButtons = $root.find(".video-carousel-button-left, .video-carousel-button-right"),
        $slideText = $root.find(".video-carousel-text"),
        isAnimating = false,
        transition = { "left": slideLeftTransition, "right": slideRightTransition },
        video = $('video'),
        slideTimer, myPlayer, video_counter = 0;

    setClasses();
    setText();

    if (!supportsTransitions()) transition = { "left": slideLeftNoTransition, "right": slideRightNoTransition };
    $allSlideButtons.click(slideButtonClick);
    $leftButton.click(transition.left);
    $rightButton.click(transition.right);
    //slideTimer = setInterval(transition.right, 7000);

    function slideButtonClick() {
        clearInterval(slideTimer);
    }
    function slideLeftNoTransition() {
        $slider.prepend($slides.last());
        setClasses();
        setText();
    }
    function slideRightNoTransition() {
        $slider.append($slides.first());
        setClasses();
        setText();
    }
    function slideLeftTransition() {
        if (isAnimating) return;
        isAnimating = true;
        $slideText.empty();

        $slider.css("left", -slideWidth + "px");
        $slider.prepend($slides.last());
        setClasses();
        $slider.animate({ left: "0px" }, 500, function () {
            setText();
            isAnimating = false;
        });
    }
    function slideRightTransition() {
        if (isAnimating) return;
        isAnimating = true;
        $slideText.empty();

        $slider.append($slides.first());
        setClasses();
        $slider.prepend($slides.last().clone());
        $slides = $slider.children("div");
        $slider.animate({ left: -slideWidth + "px" }, 500, function () {
            $slides.eq(0).remove();
            setClasses();
            $slider.css("left", "0px");
            setText();
            isAnimating = false;
        });
    }
    function setClasses() {
        $slides = $slider.children("div");
        $slides.removeClass();
        $slides.eq(0).addClass("level1");
        $slides.eq(1).addClass("level2");
        $slides.eq(2).addClass("level3");
        $slides.eq(3).addClass("level2");
        $slides.eq(4).addClass("level1");

        $slides.off("click");

        $slides.eq(1).on("click", function () { slideButtonClick(); transition.left(); });
        $slides.eq(3).on("click", function () { slideButtonClick(); transition.right(); });
    }
    function setText() {
        $slideText.html($slides.eq(2).find("p").html());
    }
    function supportsTransitions() {
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';
        if (typeof s[p] == 'string') { return true; }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for (var i = 0; i < v.length; i++) {
            if (typeof s[v[i] + p] == 'string') { return true; }
        }
        return false;
    }

    function playVideo() {
        video.play();
    }
    function pauseVideo() {
        video.pause();        
    }
});

const video = document.getElementById("video");
const circlePlayButton = document.getElementById("circle-play-b");

function togglePlay() {
	if (video.paused || video.ended) {
		video.play();
	} else {
		video.pause();
	}
}

circlePlayButton.addEventListener("click", togglePlay);
video.addEventListener("playing", function () {
	circlePlayButton.style.opacity = 0;
});
video.addEventListener("pause", function () {
	circlePlayButton.style.opacity = 1;
});