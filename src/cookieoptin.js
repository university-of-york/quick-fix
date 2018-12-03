(function() {

    // Messaging - PLEASE EDIT THESE VALUES!
    var message = '<p><span>We use cookies on our web site. Find out <a href="https://www.york.ac.uk/about/legal-statements/#tab-5">how to manage cookies from this site</a></span> <button id="btnCloseCookieNotice" class="button">Close</button></p>';



    // Alert toggle - SET THIS TO 'true' to show the alert
    var showCookieNotice = false,
        cookiesAccepted = 'cookies-accepted';


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

            $('#btnCloseCookieNotice').bind('click', function(e) {
                // set the cookie to 'true' with a long expiry
                setCookie(cookiesAccepted, 'true', 365);
                // close the notice
                $('#cookie-opt-in').hide();
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

