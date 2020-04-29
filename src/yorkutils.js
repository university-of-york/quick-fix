function waitForElementToDisplay(selector, time, callback) {
    if($(selector).length > 0) {
        callback();
    }
    else {
        setTimeout(function() {
            waitForElementToDisplay(selector, time, callback);
        }, time);
    }
}

// need to check for presence of jQuery '$' variable first;
var $ = $ || jQuery;

$(document).ready(function(){

    //work out how far down the hierarchy we are:
    // - find all the ul elements with class that starts with "multilevel-linkul-" and put them in an array
    // - count the array size
    var arr = $("#lhcolumn #nav ul[class^='multilevel-linkul-']");
    var highestMulti = arr.length - 1;
    var parentMulti = highestMulti - 1;

    if (highestMulti>=0) {
        $("li .currentbranch"+highestMulti+",  li .currentbranch"+highestMulti+" a").addClass("parent");
        $("#nav ul.multilevel-linkul-"+highestMulti+" li a,   #nav ul.multilevel-linkul-"+highestMulti+" li span").addClass("children");
    }

    // special case for top level menu items that have no children
    if (highestMulti<0) {
        $(".currentbranch0").addClass("parent");
    }

    //find all the spans that contain a link, remove the right hand padding and left positioning
    $("#lhcolumn #nav span>a").each(function() {
        $(this).parent().css("padding","0");
        $(this).css("left","0");
    });

    //Style quotations
    $("blockquote.quote p:first-child").addClass("quotation");
    $("blockquote.quote p:last-child").addClass("attribution");

    //zebra stipes for tables
    $("table.zebra tbody tr:nth-child(even)").addClass("even");

    //zebra stripes for upcoming events
    $("#mdcolumn #upcomingevents>div:nth-child(odd)").addClass("odd");

    // Add tabs to Staff profiles
    $("#profile-content, #research-content, #publications-content, #teaching-content, #external-content").wrapAll('<div class="tabs" id="tab-wrapper-staff-profile"></div>');
    $('#profile-content, #profile').before('<ul class="tabNavigation"><li><a href="#profile-content">Profile</a> </li>\n</ul>');

    var linkList = '';
    if ( $('#research-content').length > 0 ) {
        linkList += '<li><a href="#research-content">Research</a> </li>\n ';
    }
    if ( $('#publications-content').length > 0 ) {
        linkList += '<li><a href="#publications-content">Publications</a> </li>\n ';
    }
    if ( $('#teaching-content').length > 0 ) {
        linkList += '<li><a href="#teaching-content">Teaching</a> </li>\n ';
    }
    if ( $('#external-content').length > 0 ) {
        linkList += '<li><a href="#external-content">External activity</a> </li>';
    }

    $('ul.tabNavigation').append(linkList);
    $('#publications-full').hide().before('<a href="#publications-full" id="showfull">Show full list of publications </a>');
    $('a#showfull').click(function(){
        $('#publications-full').show();
    });

    //'Apply now' button on course pages
    $('#course-apply-now').click(function (e) {
        e.preventDefault();
        tabContainers.hide();
        tabContainers.filter('#course-applying-content').show();
        $('div#tabs ul.tabNavigation a').removeClass('selected');
        $('div#tabs a[hash=#course-applying]').addClass('selected');
        $('html,body').animate({scrollTop:$('#tabs').offset().top}, 700);
        window.location.hash = "course-applying";
    });

    //'Show entry requirements' button on course pages
    $('#show-entry-reqs').click(function (e) {
        e.preventDefault();
        tabContainers.hide();
        tabContainers.filter('#course-applying-content').show();
        $('div#tabs ul.tabNavigation a').removeClass('selected');
        $('div#tabs a[hash=#course-applying]').addClass('selected');
        $('html,body').animate({scrollTop:($('#entry-details').offset().top)-30}, 900);
        window.location.hash = "course-applying";
    });


    //Sortable tables
    if ( $("table.sortable").length > 0){
        $.getScript("/media/global/scripts/jquery.tablesorter.metadata.min.js",function(){
            $("table.sortable").tablesorter();
        });
    }
    if ( $("table.sortable-zebra").length > 0){
        $.getScript("/media/global/scripts/jquery.tablesorter.metadata.min.js",function(){
            $("table.sortable-zebra").tablesorter({
                widgets: ['zebra']
            });
        });
    }

    //Calendar popup
    $("a#calendar-feed").click(function(){
        $("#calendar-feed-menu").toggle();
        return false;
    });

    $("a#close-calendar").click(function(){
        $("#calendar-feed-menu").toggle();
        return false;
    });


    //Sort function
    jQuery.fn.sort = function() {
        return this.pushStack([].sort.apply(this, arguments), []);
    };
    function sortAlpha(a,b){
        return a.id > b.id ? 1 : -1;
    }

    //Sort PhD listing
    $('#phdlist div').sort(sortAlpha).appendTo("#phdlist");
    //Sort staff listing
    $('#stafflist div').sort(sortAlpha).appendTo("#stafflist");

    //Forms
    $('#mdcolumn input[type=radio]').addClass('radio');
    $('#mdcolumn input[type=checkbox]').addClass('checkbox');
    $('#mdcolumn input[type=text]').addClass('text');
    $('#mdcolumn input[type=textarea]').addClass('textarea');
    $('#mdcolumn input[type=password]').addClass('password');

    if ($("p.instruct").length == 0) {
        $("body").addClass("noI");
    }

    $(".text,textarea,.radio,.checkbox,select,.password").focus(function(){
        $("form").not("fsForm").find("li").removeClass("focused");
        $(this).closest("li").addClass("focused");
    });

    if ( $("input.email, input.required, input.digits, input.number").length > 0){
        $.getScript("https://www.york.ac.uk/media/global/scripts/jquery.validate.min.js",function(){
            $("#content-container form").validate();
        });
    }

    //Remove breadcrumb from header files
    $(".breadcrumbs li:last-child:contains('Header')").remove();
    $("#breadcrumb li:last-child:contains('Header')").remove();

    //Height correction for media player
    var videoIframes = $("iframe.video");
    videoIframes.each(function() {
        var videoHeight = $(this).height();
        videoHeight = videoHeight + 50;
        $(this).height(videoHeight);
    });

    //Dropdown menu
    $(".dropdown>a").click(function(){
        $(".submenu").slideToggle("fast");
        return false;
    });

    //Captioned images
    $(".captionedimage").each(function(){
        var $this = $(this);
        var imgWidth = $this.children("img").attr("width");
        $this.css("maxWidth", imgWidth);
        $this[0].style.maxWidth = imgWidth + 'px';
    }) ;

    //switch home icon in breadcrumb trail if background is dark
    var breadcrumbColor = $("#breadcrumb").css("color");
    if (breadcrumbColor == "rgb(255, 255, 255)") {
        $("#breadcrumb>ul>li>a>img").attr("src","/media/global/templateimages/home_white.gif");
    }

    //Current section highlight based on breadcrumb train
    var branchLevelOne = $("ul.breadcrumbs li:nth-child(2)").text().toLowerCase().split(/\b/)[0];;
    var branchLevelTwo = $("ul.breadcrumbs li:nth-child(3)").text().toLowerCase().split(/\b/)[0];;
    $("#main-menu").addClass("level-one-"+branchLevelOne);
    $("#main-menu").addClass("level-two-"+branchLevelTwo);

    // Embed a YouTube player in place of links with a .youtube-video-embed
    $(".youtube-video-embed").each(function () {

        // remove wrapper paragraph, if any
        if (($(this).parent().is("p"))) {
            $(this).unwrap();
        }

        // figure out the Youtube ID

        var youtubeURL = $(this).attr("href");

        if( $(this).is("p") )
        {
            var link = $( $(this).find("a")[ 0 ] );
            if( link ) youtubeURL = link.attr( "href" );
        }
        
        var youtubeID, vPos;
        if (youtubeURL.indexOf("//youtu.be")>0) {
            vPos = youtubeURL.indexOf(".be/");
            youtubeID = youtubeURL.substring(vPos+4, vPos+15);
        } else {
            vPos = youtubeURL.indexOf("v=");
            youtubeID = youtubeURL.substring(vPos+2, vPos+13);
        }
        // create the embed code
        var embedCode = $('<p class="videoembed"><iframe src="//www.youtube.com/embed/' + youtubeID + '?rel=0" allowfullscreen></iframe></p>');
        // replace the original link element with the embed code
        $(this).replaceWith(embedCode);
    });

    //Replace YouTube videos embedded in narrow containers with thumbnails that link to videos
    $("iframe[src*='youtube.com']").each(function(){
        var video = $(this);
        var containerWidth = video.parent().width(); 
        if (containerWidth<320) {
            var src = video.attr("src");
            var embedPos = src.indexOf("/embed/");
            var videoID = src.substring(embedPos+7,embedPos+18);
            var ytURL = "https://www.youtube.com/watch?v="+videoID;
            var imgURL = "https://img.youtube.com/vi/"+videoID+"/mqdefault.jpg";
            var hash = videoID + Math.random();
            $(this).replaceWith("<a class='videothumb' href="+ytURL+"><img id='"+hash+"' width='"+containerWidth+"' src='"+imgURL+"' alt=''/><span class='playbutton'></span></a>");

            // Access the YouTube API and get our video title
            getYoutubeVideoTitle( videoID , function( videoTitle )
            {
                // Add the alt atribute containing the video title to the img 
                var $img = document.getElementById( hash );
                $img.setAttribute( "alt" , videoTitle );
            } );
        }
    });

    // Retrieve a Youtube video title from its ID
    function getYoutubeVideoTitle( videoID , callback ){

        // Authenticate access to API and retreive our video data
        getURL( 'https://www.googleapis.com/youtube/v3/videos/?part=snippet&id='+videoID+'&key=xxxx' , function( data )
        {
            data = JSON.parse( data );

            //Return the video title from the API
            callback( data.items[0].snippet.title );
        });
    }


    // Get the URL
    function getURL(url, success) {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('GET', url);
            xhr.onreadystatechange = function() {
                if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
            };
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send();
            return xhr;
        }


    // Embed a SoundCloud player in place of links with a .soundcloud-embed
    $('a.soundcloud-embed').each(function(){
        var $scLink = $(this);
        var scLinkURL = $scLink.attr('href');
        if (scLinkURL.indexOf('?') > 0) {
            scLinkURL = scLinkURL.substring(0, scLinkURL.indexOf('?'));
        }
        $.getJSON('//soundcloud.com/oembed?format=js&url=' + scLinkURL + '&iframe=true&maxheight=200&callback=?', function(response){
            $scLink.replaceWith(response.html);
        });
    });

    //Remove external link icon from links containing images
    $("a[href^='http://']").add("a[href^='https://']").each(function(i, v) {
        var $this = $(this);
        if ($this.children('img').length > 0) {
            $this.css({ 'background':'none', 'padding':0 , 'display':'inline-block' });
        }
    });

    //Strip zero-width non-joiners
    var zwnjStrip = function (el) {
        if (el.nodeType==3) {
            el.nodeValue = el.nodeValue.replace(/‌/gi, "");
        } else {
            var child = el.firstChild;
            while (child) {
                zwnjStrip(child);
                child = child.nextSibling;
            }
        }
    };
    zwnjStrip(document.body);

    //
    // Filter a list/table based on search input
    //

    var $searchable = $('.c-searchable');

    if ($searchable.length) {

        // Is it a table or a list?
        var $searchableContent = $searchable.children('.c-searchable__content');
        var hasTable = !!$searchableContent.find('table').length;
        var searchElement = hasTable ? 'td:first-child' : 'li' ;

        var filterInput = $('.c-searchable__input');
        var filterValues = $searchableContent.find(searchElement);
        var filterContainer = hasTable ? 'tr' : 'li' ;

        $('.c-searchable__input').keyup(function(e) {
            filterList(filterInput, filterValues, filterContainer);
        });

    }

    function filterList(filterInput, filterValues, filterContainer) {

        var inputContent = filterInput.val().toLowerCase();

        filterValues.each(function(i, v) {
            var $v = $(v);
            var $f = $v.closest(filterContainer);
            var filterText = $v.text().toLowerCase();
            var searchIndex = filterText.indexOf(inputContent);
            if (searchIndex > -1 || inputContent === '') {
                $f.show();
            } else {
                $f.hide();
            }
        });

        return false;
    }



    // sort out clearing following floated columns
    // on floated column types (e.g. '.col-half') there is no containing element that clears the float afterwards
    // this leads to some floating oddities with elements following columns (esp. those that are floated themselves
    // e.g. blockquotes with '.rightBox' class on them.
    // here, we loop through the various column types and add a clearing div
    var colTypes = [
        [".col-1-4", 4],
        [".col-half", 2],
        [".col-third", 3],
    ];

    for(var i=0; i < colTypes.length; i++) {
        var selectorCol = colTypes[i][0];
        var numOfSelectors = colTypes[i][1];
        var selectorStr = selectorCol + '.first-col';

        for(var j=1; j < numOfSelectors; j++) {
            selectorStr += ' + ' + selectorCol;
        }

        $('#mdcolumn ' + selectorStr).after('<div class="clear"></div>');
    }

    //$('.col-half + .col-half').after('<div class="clearing-tom"></div>')
});













