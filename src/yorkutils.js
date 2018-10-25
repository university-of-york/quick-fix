/*
 *MODIFIED version of jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);


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

    //Staff profiles
    $("#profile-content, #research-content, #publications-content, #teaching-content, #external-content").wrapAll('<div id="tabs"></div>');
    $('#profile-content').before('<ul class="tabNavigation"><li><a href="#profile">Profile</a> </li>\n</ul>');

    var linkList = '';
    if ( $('#research-content').length > 0 ) {
        linkList += '<li><a href="#research">Research</a> </li>\n ';
    }
    if ( $('#publications-content').length > 0 ) {
        linkList += '<li><a href="#publications">Publications</a> </li>\n ';
    }
    if ( $('#teaching-content').length > 0 ) {
        linkList += '<li><a href="#teaching">Teaching</a> </li>\n ';
    }
    if ( $('#external-content').length > 0 ) {
        linkList += '<li><a href="#external">External activity</a> </li>';
    }

    $('ul.tabNavigation').append(linkList);
    $('#publications-full').hide().before('<a href="#publications-full" id="showfull">Show full list of publications </a>');
    $('a#showfull').click(function(){
        $('#publications-full').show();
    });

    //Tabbed content

    //Moving to class-based tabs

    //Check we're on a page containing tabs
    var $tabs = $('#mdcolumn').find('.tabs');
    if ($tabs.length > 0)  {

        $tabs.each(function(i, tabWrapper) {

            var $tabWrapper = $(tabWrapper);
            // tabId is first 12 characters of e.g. tab-wrapper-12345
            var tabId = $tabWrapper.attr('id').substring(12);
            var $tabList = $tabWrapper.children('ul');
            var $tabLinks = $tabList.find('a');
            var $tabContainers = $tabWrapper.children('div');
            // Hide headers
            $tabContainers.children('.tab').hide();

            $tabList.addClass('tabNavigation');

            $(window).bind('hashchange', function(e, logAnalyticsEvent) {

                //get the value of the hash
                var windowHash = window.location.hash;

                //check that there are no named anchors that match
                //the hash on the current tab before switching
                if ($tabWrapper.find('.currentTab a[name="'+(windowHash.substring(1))+'"]').length === 0) {

                    var firstTab = $tabLinks.first().attr('href');

                    //IE7 returns the full path for .attr('href'), so it needs trimming to get just the fragment
                    firstTab = firstTab.substring(firstTab.indexOf('#'));

                    var hash = firstTab;
                    //If the hash matches the ID of a tab, use that. Otherwise use the first tab.
                    if ($tabContainers.filter(windowHash).length > 0) {
                        hash = windowHash;
                    }
                    // If there's already a selected tab, leave it at that
                    else if ($tabContainers.filter('.currentTab').length > 0) {
                        var selectedHash = $tabContainers.filter('.currentTab').attr('id');
                        hash = '#'+selectedHash;
                    }

                    // Otherwise use the first tab.
                    $tabContainers.hide().removeClass('currentTab');
                    var selectedTabContainer = $tabContainers.filter(hash);
                    selectedTabContainer.show().addClass('currentTab');
                    $tabLinks.removeClass('selected');
                    $tabLinks.filter('[href='+hash+']').addClass('selected');


                    if(typeof(logAnalyticsEvent) === 'undefined' || logAnalyticsEvent !== false) {
                        // track the tab click to Google Analytics
                        //pageTracker._trackEvent(category, action, label, value, true);
                        pageTracker._trackEvent('Tab Clicked', selectedTabContainer.attr('id'), window.location.href, 0, true);
                    }
                }
            });
        });

        $(window).trigger("hashchange", [false]);

    }

    // ID-based tabs
    //Check we're on a page containing tabs
    if ($('#tabs').length > 0)  {

        $('div#tabs > ul').addClass('tabNavigation');
        var tabContainers = $('div#tabs > div');
        tabContainers.hide().filter(':first').show().addClass('currentTab');
        $('#tabs h2.tab').hide();

        $(window).bind('hashchange', function(e, logAnalyticsEvent) {

            //get the value of the hash without the '#' prefix
            var hashOnly = window.location.hash.substring(1);

            //check that there are no named anchors that match the hash on the current tab before switching
            if (!($('#tabs .currentTab a[name="'+hashOnly+'"]').length == 1)) {
                var firstTab = $('div#tabs ul.tabNavigation a:first').attr('href');

                //IE7 returns the full path for .attr('href'), so it needs trimming to get just the fragment
                firstTab = firstTab.substring(firstTab.indexOf('#'));

                //If the hash matches  the ID of a tab, use that. Otherwise use the first tab.
                var hash = firstTab;
                if ($('div#tabs > div'+window.location.hash +'-content').length > 0) {
                    hash = window.location.hash;
                }

                tabContainers.hide().removeClass('currentTab');

                //'-content' suffix added to match renamed tab IDs
                var selectedTabContainer = tabContainers.filter(hash+'-content');
                selectedTabContainer.show().addClass('currentTab');
                $('div#tabs ul.tabNavigation a').removeClass('selected');
                $('div#tabs a[hash=' + hash + ']').addClass('selected');

                if(typeof(logAnalyticsEvent) === 'undefined' || logAnalyticsEvent !== false) {
                    // track the tab click to Google Analytics
                    pageTracker._trackEvent('Tab Clicked', selectedTabContainer.attr('id'), window.location.href, 0, true);
                }
            }
        });

        $(window).trigger("hashchange", [false]);
    }

    // Need to add in a little extra work for tab click-tracking on mobiles as tabs are changed in to accordion items
    // on mobile by the quick-fix js code
    waitForElementToDisplay('.faq-container', 500, function() {
        var faqContainer = $('.faq-container');
        if(faqContainer.length > 0 && faqContainer.find('.currentTab').length > 0) {

            faqContainer.find('h3.q').bind('click', function() {

                var $this = $(this),
                    clickedId = '';

                clickedId = $this.parents('.faq').attr('id');

                pageTracker._trackEvent('Tab Clicked - Mobile', clickedId, window.location.href, 0, true);
            });
        }
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
        var courseName = $('#course-title').text();
        pageTracker._trackEvent('Courses', 'Apply', courseName);
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

    //Log click on 'Applying' tab as an event
    $("a[href='#course-applying'][class='course-tab-link']").click(function() {
        var courseName = $('#course-title').text();
        pageTracker._trackEvent('Courses', 'Click on Applying Tab', courseName, 0 , true);
    });

    //Frequently asked questions
    var qs = $(".q");
    var as = $(".a");

    as.hide();
    qs.wrapInner('<a href="#"></a>');
    qs.click(function(){
        $(this).next().slideToggle("fast");
        $(this).toggleClass('expanded');
        return false;
    });

    //add a "show all" link before the questions
    $(".faq:first").before('<p class="showhide"><a href="#" class="show">Show all</a> / <a href="#" class="hide">Hide all</a></p>');
    $("a.show").click(function(){
        as.slideDown("fast");
        qs.addClass('expanded');
        return false;
    });
    $("a.hide").click(function(){
        as.slideUp("fast");
        qs.removeClass('expanded');
        return false;
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
    $(".captionedimage.right, .captionedimage.left ").each(function(){
        var imgWidth = $(this).children("img").attr("width");
        $(this).css("width", imgWidth);
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
        var youtubeURL = $(".youtube-video-embed").attr("href");
        var youtubeID, vPos;
        if (youtubeURL.indexOf("//youtu.be")>0) {
            vPos = youtubeURL.indexOf(".be/");
            youtubeID = youtubeURL.substring(vPos+4, vPos+15);
        } else {
            vPos = youtubeURL.indexOf("v=");
            youtubeID = youtubeURL.substring(vPos+2, vPos+13);
        }
        // set the height and width
        var videoWidth;
        // Special case for tabs and FAQs containing videos
        if ($(this).parents("#tabs").length == 1) {
            videoWidth = $(".currentTab").width();
        } else if ($(this).parents(".a").length == 1) {
            videoWidth = $(".q").width();
        } else videoWidth = $(this).parent().width();
        var videoHeight = (videoWidth/16)*9;
        // create the embed code
        var embedCode = $('<iframe width="' + videoWidth + '" height="' + videoHeight + '" src="//www.youtube.com/embed/' + youtubeID + '?rel=0" frameborder="0" allowfullscreen></iframe>');
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
            $(this).replaceWith("<a class='videothumb' href="+ytURL+"><img width='"+containerWidth+"' src='"+imgURL+"' /><span class='playbutton'></span></a>");
        }
    });

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
            $this.css({ 'background':'none', 'padding':0 });
        }
    });

    //Track external links, email links and file downloads as events in Google Analytics

    var GADebugMode = false;		//set to true when you're testing so that alerts are displayed instead of the gif being sent to google.

    //if in debug mode this alerts the data, if not in debug mode this sends the data to google.
    sendData = function (category, action, label, value){
        if(!GADebugMode){
            try{
                pageTracker._trackEvent(category, action, label, value, true);
            }catch(err){}
        }else{
            console.log("Category: " + category + ". action: " + action + ". label: " + label);
        }
    };

    //track various outbound and download links
    ga_track = function (target){
        $(target).each(function(index) {
            $(this).click(function (event){
                var href;
                //var hrefTarget = $(this).prop("target");
                var hrefTarget = $(this).attr("target");
                var category;
                var action;
                var label;

                href = $(this).attr('href');

                if(href.match(("(.pdf$)|(.xlsx?$)|(.docx?$)"))){      //if the link ends with .pdf, .xls, .xlsx, .doc, .docx then it's a download
                    category = "Download";
                    action = href.match(/([^/]+)$/)[1];
                }else if(href.match(("^https?://"))){   //if the link starts with http:// or https:// then it's an outbound link
                    category = "Outbound Link";
                    action = href;
                }else if(href.substring(0,7) === "mailto:"){    //if the link starts with mailto: then it's a mailto link
                    category = "Contact";
                    action = href;
                }

                if($(this).find("img").length > 0){    //if this is an image link
                    if($(this).find("img").attr("alt")){
                        label = $(this).find("img").attr('alt');
                    }else{
                        label = "image";
                    }
                }else{
                    label = $(this).text();
                }

                sendData(category,action,label,0);

                if (event.metaKey || event.ctrlKey || hrefTarget == "_blank"){
                    var newTab = true;
                }

                if (!newTab){
                    event.preventDefault();
                    setTimeout('location.href = "'+href+'"', 200); //delay is set before redirection so google gets a chance to send tracking gif
                }
            });
        });
    };

    ga_track("a[href^='mailto']");
    ga_track("a[href$='.pdf']");
    ga_track("a[href$='.xls']");
    ga_track("a[href$='.xlsx']");
    ga_track("a[href$='.doc']");
    ga_track("a[href$='.docx']");

    //outbound links that aren't pdf, xls, xlsx, doc, or docx
    ga_track("a[href^='http://']:not([href$='.pdf'],[href$='.xls'],[href$='.xlsx'],[href$='.jpg'],[href*='york.ac.uk'])");
    ga_track("a[href^='https://']:not([href$='.pdf'],[href$='.xls'],[href$='.xlsx'],[href$='.jpg'],[href*='york.ac.uk'])");


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

});