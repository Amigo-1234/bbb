(function($) {
    "use strict";

    // Preloader
    $(window).on('load', function() {
        $("#loading").fadeOut(1200);
    });

    // Sticky Nav1
    $(document).on("scroll", function() {
        if ($(document).scrollTop() > 150) {
            $(".main-nav").addClass("black");
        } else {
            $(".main-nav").removeClass("black");
        }
    });

    // Sticky Nav2
    $(document).on("scroll", function() {
        if ($(document).scrollTop() > 0) {
            $(".mobile-nav").addClass("black");
        } else {
            $(".mobile-nav").removeClass("black");
        }
    });

    // Scroll Top
    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 0) {
            $('.scroll-top').fadeIn();
        } else {
            $('.scroll-top').fadeOut();
        }
    });
    $('.scroll-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;
    });

    // Mean Menu
    jQuery('.mean-menu').meanmenu({
        meanScreenWidth: "991"
    });

    // Wow  JS
    new WOW({
        offset: 100,
        mobile: true
    }).init();

    // Magnific PopUp
    $(".video-pop").magnificPopup({
        disableOn: 320,
        type: 'iframe',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

    // Owl Carausel 
    $('.home-course-slider').owlCarousel({
        loop: true,
        margin: 20,
        dots: false,
        autoplay: true,
        nav: true,
        navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-next'></i>"],
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            768: {
                items: 2,
            },
            1000: {
                items: 3,
            },
            1300: {
                items: 4,
            }
        }
    });

    $('.course-slider').owlCarousel({
        loop: true,
        margin: 20,
        dots: false,
        autoplay: false,
        nav: true,
        navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-next'></i>"],
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 1,
            },
            768: {
                items: 1,
            },
            1200: {
                items: 1,
            }
        }
    });

    $(".home-slider").owlCarousel({
        animateOut: 'animate__animated animate__slideOutDown',
        animateIn: 'animate__animated animate__slideInDown',
        items: 1,
        loop: true,
        autoplay: false,
        dots: false,
        nav: true,
        navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-next'></i>"],
        autoHeight: true,
        autoplaySpeed: 800,
        mouseDrag: false,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 1,
            },
            768: {
                items: 1,
            },
            1200: {
                items: 1,
            }
        }

    });

    $('.event-slider').owlCarousel({
        loop: true,
        margin: 20,
        dots: false,
        autoplay: false,
        dots: false,
        autoplayHoverPause: true,
        mouseDrag: false,
        navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-next'></i>"],
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 1,
            },
            768: {
                items: 1,
            },
            1200: {
                items: 1,
            }
        }
    });
    $('.news-slider').owlCarousel({
        loop: true,
        margin: 20,
        dots: false,
        autoplay: false,
        dots: false,
        autoplayHoverPause: true,
        mouseDrag: false,
        navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-next'></i>"],
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 1,
            },
            768: {
                items: 1,
            },
            1200: {
                items: 1,
            }
        }
    });

    $('.teacher-slider').owlCarousel({
        loop: true,
        margin: 20,
        dots: false,
        autoplay: false,
        dots: false,
        autoplayHoverPause: true,
        mouseDrag: false,
        navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-next'></i>"],
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 1,
            },
            768: {
                items: 1,
            },
            1200: {
                items: 1,
            }
        }
    });

    // Gallery
    $('.image-pop').magnificPopup({
        type: 'image',
        removalDelay: 300,
        gallery: {
            enabled: true
        },
    });

    // FAQ Accordion
    $('.accordion').find('.accordion-title').on('click', function() {
        $(this).toggleClass('active');
        $(this).next().slideToggle('fast');
        $('.accordion-content').not($(this).next()).slideUp('fast');
        $('.accordion-title').not($(this)).removeClass('active');
    });

    // Count Time 
    function makeTimer() {
    // Get the current date
    var now = new Date();

    // Fixed 2026 admission window
    var endTime = new Date("April 30, 2026 17:00:00 GMT+1");

    // Calculate total seconds left
    var timeLeft = Math.floor((endTime - now) / 1000);
    if (timeLeft < 0) {
        timeLeft = 0;
    }

    // Calculate days, hours, minutes, seconds
    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft % 86400) / 3600);
    var minutes = Math.floor((timeLeft % 3600) / 60);
    var seconds = Math.floor(timeLeft % 60);

    // Pad with zeros if less than 10
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Update HTML
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
}

// Run every second
setInterval(makeTimer, 1000);

// Initial call
makeTimer();


    // Isotope Filter
    $('.gall-list').isotope({
        itemSelector: '.item'
    });
    $('.all-gall li').click(function() {
        $('.all-gall li').removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        $('.gall-list').isotope({
            filter: selector
        });
        return false;
    });

    // Switch Btn
	$('body').append("<div class='switch-box'><label id='switch' class='switch'><input type='checkbox' onchange='toggleTheme()' id='slider'><span class='slider round'></span></label></div>");

}(jQuery));

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('edvi_theme', themeName);
    document.documentElement.className = themeName;
}
// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('edvi_theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}
// Immediately invoked function to set the theme on initial load
(function () {
    if (localStorage.getItem('edvi_theme') === 'theme-dark') {
        setTheme('theme-dark');
        document.getElementById('slider').checked = false;
    } else {
        setTheme('theme-light');
      document.getElementById('slider').checked = true;
    }
})();

