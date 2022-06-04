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
    //addPlayButton(video);

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
        $slides.eq(2).on("click", function () { playPause(this);});
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

    function addPlayButton(toVideo) {
        var buttonContainer = $(".play-button-wrapper");
        buttonContainer.html(
            '<div title="Play video" class="play-gif" id="circle-play-b"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path d="M40 0a40 40 0 1040 40A40 40 0 0040 0zM26 61.56V18.44L64 40z" /></svg></div>'
        );
    }

    /* Tests purposes */
    var $videos_ = $('.video');
    var playButtonSGV = '<div title="Play video" class="play-gif" id="circle-play-b">';
    playButtonSGV += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">';
    playButtonSGV += '<path d="M40 0a40 40 0 1040 40A40 40 0 0040 0zM26 61.56V18.44L64 40z" /></svg></div>';


});

function playPause(video) {

    // Hide the play / pause bouton

    /*var videos_ = document.getElementsByClassName("play-button-wrapper");
    videos_.forEach(element => {
        element.hide();
    });*/

    if (video.paused) {
        video.play();
        playButtonSGV.hide();

    } else {
        video.pause();
        playButtonSGV.show();
    }
}