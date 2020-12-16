// Cookies! Adapted from code found on W3Schools
function setCookie(name, value) {
  const date = new Date();
  date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();

  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;`;
}

function getCookie(name) {
  const _name = name + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(_name) == 0) {
      return cookie.substring(_name.length, cookie.length);
    }
  }

  return '';
}

// Asynchronous sleep function
const sleep = (milliseconds = 50) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

$(() => {
  // Define useful DOM elements
  const $window = $(window);
  const $banner = $('.banner');
  const $bg = $('.bg');
  const $logo = $('.logo');
  const $content = $('.content');
  const $container = $content.children('.content-container');
  const $ul = $container.children('ul');

  // GDPR banner
  switch (getCookie('gdpr')) {
    case '':
      setCookie('gdpr', 'false');
    case 'false':
      $banner.show();
      break;
    case 'true':
      $banner.hide();
      break;
  }

  // Dismiss banner and remember clicked state for next visit
  $banner.on('click', '.close', function (event) {
    event.preventDefault();
    $banner.hide();
    setCookie('gdpr', 'true');
  });

  // Update background and blurred container
  const landscape = true;
  const portrait = false;
  let currentBackground = landscape;
  const changeBackground = () => {
    $bg.toggleClass('landscape').toggleClass('portrait');
    currentBackground = !currentBackground;
  };

  // Define window dimensions
  let windowDims = {
    width: $window.width(),
    height: $window.height(),
  };

  // Click-to-scroll logo
  $logo.on('click touchstart', (event) => {
    event.preventDefault();
    $content.animate(
      { scrollTop: Math.ceil(windowDims.height - $logo.outerHeight()) },
      1000,
    );
  });

  // Calculate size and layout of various elements when page dimensions change
  const update = async () => {
    // Window dimensions
    windowDims = {
      width: $window.width(),
      height: $window.height(),
    };

    // Some browsers require 100vh to be defined in pixels
    $('.bg, .bg::before, .bg::after').css({ height: `${windowDims.height}px` });

    // .content
    let logoHeight;
    const updateContent = () => {
      // Switch orientation modes based on values of windowDims
      if (windowDims.width > windowDims.height) {
        $ul.css({ 'flex-direction': 'row' });
        if (currentBackground === portrait) {
          changeBackground();
        }
      } else {
        $ul.css({ 'flex-direction': 'column' });
        if (currentBackground === landscape) {
          changeBackground();
        }
      }
    };

    // Keep updating content in 50ms intervals until logo updates with a max.
    // timeout of three seconds
    updateContent();
    for (let i = 0; logoHeight < 100 && i < 60; i++) {
      await sleep();
      updateContent();
    }
  };

  // Set update listener and call initially
  $window.on('resize orientationchange', update);
  update();
});
