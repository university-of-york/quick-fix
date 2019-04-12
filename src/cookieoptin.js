(function() {

    // Messaging - PLEASE EDIT THESE VALUES!

    var cookiesPageURL = 'https://www.york.ac.uk/about/legal-statements/cookies/';

    var message = "" +
        "<div class=\"cookie-opt-in__content\">" +
            "<p>By continuing to use the site we assume you're happy with <a href=\""+cookiesPageURL+"\">how we use cookies</a>.</p>" +
        "</div>" +
        "<div class=\"cookie-opt-in__dismiss\">" +
            "<a title=\"Dismiss this notification\" href=\"#\" id=\"btnCloseCookieNotice\">&times;</a>" +
        "</div>";

    // Alert toggle - SET THIS TO 'true' to show the alert
    var showCookieNotice = false,
        cookiesAccepted = 'cookie-banner-dismissed';

    //-----------------------------------------------------------------------------
    //-----------HELPER FUNCTIONS-------------------------------------------------

    function areCookiesEnabled(){
        // Quick test if browser has cookieEnabled host property
        if (navigator.cookieEnabled) {
            return true;
        }
        // Create cookie
        document.cookie = "cookietest=1";
        var ret = document.cookie.indexOf("cookietest=") != -1;
        // Delete cookie
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        return ret;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return false;
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function checkCookie(cname) {
        var cvalue = getCookie(cname);

        if(!cvalue) {
            return false;
        }

        return cvalue;
    }

    function deleteCookie(cname) {
        document.cookie = cname + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }

    function strToBoolValue(str) {
        if(typeof str === 'string') {
            return str !== 'false';
        }

        return false;
    }


    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------



    // jQuery isn't loaded or cookies abilities are set to false/unavailable/turned off/etc.
    if(typeof $ === 'undefined' || !areCookiesEnabled()) {
        return;
    }

    // check if cookie 'cookies-accepted' is present or set to false;
    var acceptedCookieValue = getCookie(cookiesAccepted);

    try {
        if(acceptedCookieValue === false) {
            showCookieNotice = true;
        } else {
            showCookieNotice = !strToBoolValue(acceptedCookieValue);
        }
    } catch(e) {
        showCookieNotice = true;
    }


    // Variables - DO NOT EDIT!
    var cookieContainer = '<div id="cookie-opt-in">{0}</div>',
        docHead = document.getElementsByTagName('head')[0],
        cookieStyles = document.createElement('link');


    function loadCookieNotice() {
        var $body = $('body');

        if($body.length > 0) {

            // inject the message html into the page
            $body.append(cookieContainer.replace('{0}', message));

            // Add body class to bump up footer padding
            $body.addClass( 'has-c-cookie-banner' );

            $('#btnCloseCookieNotice').bind('click', function(e) {

                e.preventDefault();

                // set the cookie to 'true' with a long expiry
                setCookie(cookiesAccepted, 'true', 365);
                // close the notice
                $('#cookie-opt-in').hide();
                // Remove body class to collapse footer padding
                $body.removeClass( 'has-c-cookie-banner' );
            });
        }
    }


    if(showCookieNotice) {

        // inject the global alert styles into the page
        if(typeof docHead !== 'undefined') {
            cookieStyles.rel  = 'stylesheet';
            cookieStyles.type = 'text/css';
            cookieStyles.href = 'https://www.york.ac.uk/static/cookieoptin/cookieoptin.css';
            //cookieStyles.href = '/cookieoptin.css';
            cookieStyles.onload = function() { loadCookieNotice(); };
            docHead.appendChild(cookieStyles);
        }
    }
})();

