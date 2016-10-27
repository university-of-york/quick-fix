//hello

// Stop conflict with Prototype on Pure
if (typeof Prototype === 'object') {
  $.noConflict();
}
// Pass jQuery's $ to the RQF code
jQuery(document).ready(function($) {

  var $window = $(window);
  var $html = $('html');
  var $body = $('body');
  var $mdcolumn = $('#mdcolumn');
  var isLive = (window.location.hostname === "www.york.ac.uk") ||
               (window.location.hostname === "hswebstaff.york.ac.uk") ||
               (window.location.hostname === "www.cs.york.ac.uk") ||
               (window.location.hostname === "cms.york.ac.uk") ||
               (window.location.hostname === "pure.york.ac.uk") ||
               (window.location.hostname === "yorkfestivalofideas.com");
  var isFOI = (window.location.hostname === "yorkfestivalofideas.com") || (window.location.pathname.indexOf("foi-rqf-test") > -1);
  var isStaffStudents = (window.location.pathname.indexOf('/students/') > -1) || (window.location.pathname.indexOf('/staff/') > -1);

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // Set up RQF Object
  var RQF = function() {

    this.status = false;
    this.contentUpdated = false;
    this.pageClass = 'rqf-page';
    this.toggle = $('<div>').addClass('rqf-toggle');
    this.input = $('<input>').attr({ 'type': 'checkbox', 'id': 'rqf-toggle' }).appendTo(this.toggle);
    this.label = $('<label>').attr({ 'for': 'rqf-toggle' }).appendTo(this.toggle);
    this.text = $('<p>').html('Toggle<br>responsive').appendTo(this.toggle);

    this.addToggle = function() {
      this.toggle.prependTo($body);
      this.input.bind('change', { that: this }, this.addClass);
    };

    this.addClass = function(e) {
      e.preventDefault();
      var that = e.data.that;
      // Change HTML class
      $html.toggleClass(that.pageClass);
      // Update input state
      that.input.attr('checked', $html.hasClass(that.pageClass));
      that.checkContent();
    };

    this.addViewportMeta = function() {
      // Add meta viewport tag (if needed)
      if ($('meta[name="viewport"]').length == 0) {
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
      }
      // Also add Typekit (if not already loaded)
      if ($('html').hasClass('wf-active') === false) {
        $('head').append('<script src="//use.typekit.net/dvj8rpp.js"></script><script>try{Typekit.load();}catch(e){}</script>');
      }
      // Update status (sometimes html width stays wide until meta tag is added)
      this.status = this.getStatus();
    };

    this.checkContent = function() {

      this.isRQF = $html.hasClass(this.pageClass);

      // Update cookie
      document.cookie = 'rqf='+(this.isRQF ? 'true' : 'false');

      // Update content on page
      this.updateContent();

      if (this.isRQF) {
        // Add meta viewport tag and font declaration
        if (typeof Typekit === 'undefined') {
          // Add Typekit script
          (function (d, t) {
            var tk = d.createElement(t), s = d.getElementsByTagName(t)[0];
            tk.type = 'text/javascript';
            tk.src = '//use.typekit.net/dvj8rpp.js';
            s.parentNode.insertBefore(tk, s);
          })(document, 'script');
          // Load Typekit fonts
          var p = setInterval(function() {
            try {
              if (Typekit) {
                clearInterval(p);
                Typekit.load();
              }
            } catch (err) {}
          }, 15);
        }
        // Listen for window resize and debounce
        var that = this;
        var resizeFunction = debounce(function() {
          // If we've changed from mobile to desktop (or vice versa)
          if(that.status !== that.getStatus()) {
            that.updateContent();
          }
        }, 250);
        $window.resize(resizeFunction);
      } else {
        //$window.unbind('resize');
      }

    };

    this.updateContent = function() {

      function updateLogo() {
        var newLogoImg = isFOI === true ? 'http://yorkfestivalofideas.com/media/news-and-events/york-festival-of-ideas/foi-logo.gif' : 'https://www.york.ac.uk/static/1.4/img/logo.svg';
        // Modernizr's svg-as-img test
        if (isFOI !== true && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") === true) newLogoImg = 'https://www.york.ac.uk/static/1.4/img/logo.png';
        // Search IMGs in #location (Vintage) and header (2013)
        $('#location img, header img, #logo img').each(function(i, img) {
          img.removeAttribute('width');
          img.removeAttribute('height');
          img.src = newLogoImg;
          img.style.display = 'block';
        });
        if (isFOI === true) {
          $('#location a').attr('href', 'http://yorkfestivalofideas.com/');
        }
      }

      function updateBreadcrumb() {
        var $breadcrumbs = $('#breadcrumb');
        if ($breadcrumbs.length > 0) {
          //switch home icon in breadcrumb trail back to dark
          var $breadcrumbHome = $('#breadcrumb>ul>li>a>img');
          if ($breadcrumbHome[0].src.indexOf('home_white.gif') > -1) {
            $breadcrumbHome.attr('src','https://www.york.ac.uk/media/global/templateimages/home.gif');
          }
          // Adds an 'is-closed' class to breadcrumbs that are three lines or longer
          $breadcrumbs.each(function(i, breadcrumb) {
            function fixBreadcrumb(e) {
              var $breadcrumb = $(breadcrumb);
              $breadcrumb.removeClass('is-closed');
              var $breadcrumbList = $breadcrumb.children('ul');
              var $breadcrumbItems = $breadcrumbList.children('li');
              var breadcrumbHeight = $breadcrumbList.height();
              var breadcrumbLineHeight = parseInt($breadcrumbItems.css('line-height'), 10);
              var lineCount = Math.floor(breadcrumbHeight/breadcrumbLineHeight);
              var toClose = lineCount > 2;
              $breadcrumb.toggleClass('is-closed', toClose);
              // Clicking the third link removes 'is-closed' class
              if (toClose === true) {
                $moreLink = $($breadcrumbItems[2]).children('a');
                $moreLink.one('click', function(e) {
                  e.preventDefault();
                  $breadcrumb.removeClass('is-closed');
                });
              }
            }
            fixBreadcrumb();
            var resizeFn = debounce(function () {
              fixBreadcrumb();
            }, 250);
            $window.resize(resizeFn);
          });
        }
      }

      // Update logo
      if (!this.contentUpdated) {

        updateLogo();
        updateBreadcrumb();

        this.contentUpdated = true;

      }

      // Trigger content rewrite if needed
      this.reorderContent();

      // Reset content after update (Twitter, homepage banner etc.)
      this.resetContent();

    };

    this.reorderContent = function() {

      if (this.status === this.getStatus()) return;

      // Update our status
      this.status = this.getStatus();

      if (this.status === 'mobile') {
        // This should have been defined on page load...
        if (typeof this.mobileContent == 'undefined') {
          this.mobileContent = this.getMobileContent();
        }
        //console.log('Replacing original content with mobile content');
        $mdcolumn.empty().append(this.mobileContent);
        $window.trigger('contentUpdated.mobile');
        return this.mobileContent;
      } else {
        // Put them back the way they were
        if (typeof this.originalContent == 'undefined') return 'Do nothing';
        //console.log('Replacing mobile content with original content');
        $mdcolumn.empty().append(this.originalContent);
        $window.trigger('contentUpdated.original');
        return this.originalContent;
      }

    };

    this.resetContent = function() {

      //console.log('resetContent');

      // Sort out homepage banner
      this.resetHomepageBanner();
      // Replace Twitter timeline
      this.replaceTwitterWidget();
      // Reset tabs
      this.resetTabs();
      // Reset accordion
      this.resetAccordion();
      // Course pages - apply and entry req. buttons
      this.courseButtons();
      // Lightbox
      var lightboxes = $('.gallery-lightbox a');
      if (lightboxes.length > 0 && $.fn.lightBox) {
        $('.gallery-lightbox a').lightBox();
      }
      // Quotation with no attribute
      $('blockquote.quote p:first-child').removeClass("attribution");
      // Reset Facebook feed
      if ($('.fb-page').length > 0) {
       this.resetFacebook();
      }
      // Reset Survey Monkey survey
      this.resetSurvey();
      // Trigger window onload
      $(window).trigger('load');
    };

    this.courseButtons = function() {

      var $applyAccordion = $('#course-applying-content');

      $('#course-apply-now').click(function (e) {
        e.preventDefault();
        if (!$applyAccordion.children('h3').hasClass('expanded')) {
          $applyAccordion.find('.q').click();
        }
        $('html,body').animate({scrollTop:$applyAccordion.offset().top}, 700);
      });

      //'Show entry requirements' button on course pages
      $('#show-entry-reqs').click(function (e) {
        e.preventDefault();
        if (!$applyAccordion.children('h3').hasClass('expanded')) {
          $applyAccordion.find('.q').click();
        }
        $('html,body').animate({scrollTop:$('#entry-details').offset().top}, 700);

      });

    };

    this.resetSurvey = function() {

      try {
        if (SMCX) return false;
        // var surveyJS = $('#smcx-sdk');
        // var surveyDiv = $('#__smcx__');
        // // console.log(surveyJS);
        // if (surveyJS.length > 0) {
        //   var src = surveyJS.attr('src');
        //   var newScript = $('<script>').attr({'src':src, 'id': 'smcx-sdk'});
        //   surveyJS.replaceWith(newScript);
        //   surveyDiv.remove();
        // }
      } catch (e) {}
    };

    this.resetFacebook = function() {
      var t = setInterval(function() {
        try {
          console.log(FB);
          if (!FB) return;
          // Removed 'parse' attr
          $('.fb-page').removeAttr('fb-xfbml-state');
          $('.fb-page').width('100%');
          FB.XFBML.parse();
          clearInterval(t);
        } catch(e) {}
      }, 20);
    };

    this.resetHomepageBanner = function() {
      var cycleOptions = {
        fx:      'fade',
        speed:   1500,
        timeout: 5000,
        pause:   true,
        fit:     1
      };
      var $homepagebanner = $('#homepagebanner');
      if ($homepagebanner.length > 0) {
        $imgs = $homepagebanner.find('img');
        if ($imgs.length === 0) return;
        var imgHeights = $imgs.map(function(i, img) {
          return $(img).height();
        });
        var maxHeight = Math.max.apply(null, imgHeights);
        $homepagebanner.cycle(cycleOptions);
        if (maxHeight > 0) $homepagebanner.height(maxHeight);
        return true;
      }
      return false;
    };

    // Adapted from yorkutils.js
    this.resetAccordion = function() {

      //Check we're on a page containing faqs
      var faqs = $mdcolumn.find('.faq');
      if (faqs.length > 0)  {

        var qs = $(".q");
        var as = $(".a");

        // Click events
        //as.hide();
        qs.unbind('click');
        qs.click(this.clickAccordion);

        var showLink = $("a.show");
        showLink.unbind('click');
        showLink.click(function(){
          // Open all FAQs
          // var theseFAQs = showLink.parent('.showhide').nextAll('.faq');
          var theseFAQs = $('.faq');
          var theseAs = theseFAQs.children('.a');
          var theseQs = theseFAQs.children('.q');
          theseAs.slideDown("fast");
          theseQs.addClass('expanded');
          return false;
        });
        var hideLink = $("a.hide");
        hideLink.unbind('click');
        hideLink.click(function(){
          // Close all FAQs
          // var theseFAQs = hideLink.parent('.showhide').nextAll('.faq');
          var theseFAQs = $('.faq');
          var theseAs = theseFAQs.children('.a');
          var theseQs = theseFAQs.children('.q');
          theseAs.slideUp("fast");
          theseQs.removeClass('expanded');
          return false;
        });

      }

    };

    this.clickAccordion = function(e) {
      $(this).next().slideToggle("fast");
      $(this).toggleClass('expanded');
      return false;
    };

    // Adapted from yorkutils.js
    this.resetTabs = function() {

      //Check we're on a page containing tabs
      var $tabs = $mdcolumn.find('.tabs');

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

          $(window).bind('hashchange', function() {

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

              $tabContainers.hide().removeClass('currentTab');
              $tabContainers.filter(hash).show().addClass('currentTab');
              $tabLinks.removeClass('selected');
              $tabLinks.filter('[href='+hash+']').addClass('selected');

            }
          });
        });

        $(window).trigger("hashchange");

      }
    };

    this.replaceTwitterWidget = function() {

      // Must have a TWid, script on page and not already have been initalised
      if (!this.twitterWidgetId) return false;
      if (typeof twttr == 'undefined') return false;
      if (twttr.init !== true) return false;

      var twitterContainer = $('.twitter-timeline-container');

      if (twitterContainer.length === 0) {
        twitterContainer = $('<div>').addClass('twitter-timeline-container')
                                     .attr({ 'data-widget-id' : this.twitterWidgetId });
        $('.twitter-timeline').replaceWith(twitterContainer);
      } else {
        twitterContainer.empty();
      }

      twttr.widgets.createTimeline(this.twitterWidgetId, twitterContainer[0], {
         chrome: 'noheader'
      });

    };

    this.prepareVideos = function() {

      var $videos = $('iframe[width][height]');

      $videos.each(function(i, video) {
        var $video = $(video);
        var videoWidth = parseInt($video.attr('width'), 10);
        if ($video.attr('width') === '100%') videoWidth = $video.width();
        var videoHeight = parseInt($video.attr('height'), 10);
        var aspectRatio = videoWidth/videoHeight;
        $video.attr('data-aspect-ratio', aspectRatio);
        $video.attr('data-original-width', videoWidth);
      });

      var resizeFunction = function() {
        $videos.each(function(i, video) {
          var $video = $(video);
          var videoWidthAttr = parseInt($video.attr('width'), 10);
          var videoWidth = $video.width();
          // If iframe is hidden, width is 0! Set it to width attr
          if (videoWidth === 0) videoWidth = videoWidthAttr;
          if (videoWidthAttr !== videoWidth) {
            var aspectRatio = parseFloat($video.attr('data-aspect-ratio'));
            $video.attr({
              'height': videoWidth/aspectRatio
            });
          }
        });
      };

      $window.resize(debounce(resizeFunction, 250));
      resizeFunction();

    };

    this.getMobileContent = function() {

      if (typeof this.mobileContent != 'undefined') return this.mobileContent;

      var mainContent = new rqfContent($mdcolumn);
      var sections = mainContent.sections;
      this.originalContent = mainContent.originalContent;

      if (sections === false) return false;
      var mobileContent = $('<div>').addClass('col-mobile');
      $.each(sections, function(i, section) {
        mobileContent.append(section);
      });

      return mobileContent;

    };

    this.getStatus = function() {

      if (this.isRQF !== true) return 'desktop';
      var windowWidth = $html.width();
      if (windowWidth < 588) return 'mobile';
      //if (windowWidth < 962) return 'tablet';
      return 'desktop';
    };

    this.addSubnav = function() {
      var $lhColumn = $('#lhcolumn');
      $lhColumn.click(function(e) {
        e.stopPropagation();
        $lhColumn.toggleClass('is-open');
      });
      $window.click(function(e) {
        $lhColumn.removeClass('is-open');
      });
    };

    this.fixFeedbackForm = function() {
      var $feedback = $('#feedback');
      var $sitemap = $('#sitemap');
      if ($feedback.length > 0 && $sitemap.length > 0) {
        $sitemap.before($feedback);
      }
    };

    this.init = function() {

      // If HTML has rqf-page on already, it's a live page - skip the toggle
      var isLivePage = $('html').hasClass('rqf-page');

      // Get out if we're not in an allowed hostname
      if (isLivePage !== true) {

        // List of places where the toggle is allowed
        var allowedHostnames = [
          'localhost',
          '127.0.0.1',
          '192.168.2.1', // ad-hoc wireless
          'cmsmigrate.york.ac.uk',
          'puretest.york.ac.uk'
        ];

        if ($.inArray(document.location.hostname, allowedHostnames) === -1) return false;
        // Add toggle button
        this.addToggle();
      }

      // Add subnav behaviour
      this.addSubnav();

      // Get video ready
      this.prepareVideos();

      // Starts in desktop view on page load
      this.status = 'desktop';

      // Save Twitter timeline ID
      var tt = $('.twitter-timeline');
      if (tt.length > 0) {
        this.twitterWidgetId = tt.attr('data-widget-id');
      }

      // Load the reordered sections for mobile
      this.mobileContent = this.getMobileContent();

      // Add the meta viewport tag (must be done after getting mobile content)
      this.addViewportMeta();

      // Fix feedback form on staff and students
      if (isStaffStudents === true) {
        this.fixFeedbackForm();
      }

      // CM 21-01 Should we use sessionStorage?
      // Check to see if there's a cookie set already
      if (isLivePage !== true) {

        var cookies = $.map(document.cookie.split(';'), function(c, i) {
          return $.trim(c);
        });

        var that = this;

        $.each(cookies, function(i, c) {
          var thisCookie = c.split('=');
          if (thisCookie[0] === 'rqf') {
            if (thisCookie[1] === 'true') {
              // Dummy event to pass to addClass
              var e = $.Event('click');
              e.data = { that: that };
              that.addClass(e);
            }
            return false;
          }
        });

        // Add Bugherd script
        (function (d, t) {
          var bh = d.createElement(t), s = d.getElementsByTagName(t)[0];
          bh.type = 'text/javascript';
          bh.src = 'https://www.bugherd.com/sidebarv2.js?apikey=d9mx89fgx7vlnnx0cutxyw';
          s.parentNode.insertBefore(bh, s);
        })(document, 'script');

      } else {

        this.checkContent();

      }

    };

  };

  // Set up RQF Content Object
  var rqfContent = function($container) {

    this.getOffset = function($content, contentCount) {
      thisOffset = $content.offset();
      // Ignore margins on floats
      if ($content.hasClass('right') || $content.hasClass('left')) {
        var topMargin = parseFloat($content.css('margin-top'), 10);
        thisOffset.top-= topMargin;
      }
      // If it's a script, there's no offset
      if ($content.is('script')) return false;
      // We can't be subpixel-perfect...
      thisOffset.top = Math.floor(thisOffset.top);
      thisOffset.left = Math.floor(thisOffset.left);
      return thisOffset;
    };

    this.makeAccordion = function($content) {

      var that = this;
      var r = $('<div>').addClass('faq-container');

      var tabNav = $content.children('.tabNavigation').find('a').map(function(i, el) {
        var href = el.href.substring(el.href.indexOf('#'));
        var $tabContent = $content.find(href);
        var tabSections = new rqfContent($tabContent);
        var sectionContent = '';
        $.map(tabSections.contentBlocks, function(a, j) {
          sectionContent+= a.html();
        });
        // Replace with reordered content
        $tabContent.empty().append(sectionContent);
        $tabContent.show().addClass('faq');
        var $tabQuestion = $tabContent.find('h2.tab');
        $tabQuestion.replaceWith(function() {
          var thisHTML = $(this).html();
          return $('<h3>').addClass('q').html(thisHTML).click(that.clickAccordion);
        });
        var $tabAnswer = $('<div>').addClass('a').hide();
        $tabContent.children().not('h3.q').wrapAll($tabAnswer);
        r.append($tabContent);

      });
      return r;

    };

    this.fixTable = function($table) {

      var $tableHead = $table.children('thead');
      var $tableBody = $table.children('tbody');
      var $tableContainer = $('<div>').addClass('table-container');
      var tableClasses = $table[0].className;

      // Get header row if needed
      if ($tableHead.length === 0) {
        $tableHead = $tableBody;
      }

      var $tableFirstRow = $tableHead.children('tr:first-child');
      var $tableHeadings = $tableFirstRow.children();

      // Not very tabular - just return the same table
      if ($tableHeadings.length < 3) return $table.clone();

      var hasHeaderRow = $tableFirstRow.find('th').length > 0;
      if (hasHeaderRow === true) {
        $tableFirstRow.remove();
      }

      // If headings span more than one column, normalise them
      $tableHeadings.each(function(i, heading) {
        var $heading = $(heading);
        var colspan = $heading.attr('colspan') || 1;
        if (colspan > 1) {
          $heading.attr('colspan', 1);
          var newHeading = $('<th>');
          var j = 1;
          // Add in as many haedings as colspans
          for (;j < colspan; j++) {
            $tableHeadings.splice(i+1, 0, newHeading.clone());
          }
        }
      });

      var $tableRows = $tableBody.children('tr');
      var $thisTableBody = $('<tbody>');
      var $thisTable = $('<table>').append($thisTableBody).addClass(tableClasses);

      $tableRows.each(function(i, row) {
        var $row = $(row);
        var colCount = 0;
        var $rowCells = $($tableRows[i]).children();
        // Make a row for each heading
        $tableHeadings.each(function(j, heading) {
          var $heading = $(heading);
          var $thisRow = $('<tr>');
          if (hasHeaderRow) {
            var $thisHeading = $('<th>').html($heading.html());
            $thisRow.append($thisHeading);
          }
          // Main row content
          if ($rowCells[j]) {
            thisColspan = parseInt($rowCells[j].getAttribute('colspan'), 10);
            if (thisColspan > 1) {
              $rowCells[j].removeAttribute('colspan');
              $rowCells[j].setAttribute('rowspan', thisColspan);
            }
            $thisRow.append($rowCells[j]);
          }
          $thisTableBody.append($thisRow);
        });
        if (i < $tableRows.length) {
          var $spacerRow = $('<tr>').addClass('spacer-row');
          $thisTableBody.append($spacerRow);
        }
      });
      $tableContainer.append($thisTable);

      return $tableContainer;
    };

    this.processContent = function($el) {

      var elClone = $el.clone();

      // Redo any tabs
      if ($el.is('#tabs') || $el.is('.tabs')) {
        elClone = this.makeAccordion(elClone);
      }

      var childTables = elClone.find('table');
      // Redo any tables
      if ($el.is('table')) {
        elClone = this.fixTable(elClone);
      }
      // Redo tables within descendants
      else if (childTables.length > 0) {
        var that = this;
        childTables.each(function(i, table) {
          var $table = $(table);
          $tableClone = that.fixTable($table);
          if (!$tableClone.is($table)) $table.replaceWith($tableClone);
        });
      }

      // Remove inline float styles
      var elStyles = elClone[0].style;
      $.each(elStyles, function(i, style) {
        if (style === 'float') {
          elStyles.float = "none";
        }
      });

      return elClone;

    };

    this.getSections = function($container) {

      var $originalContent = $container.children();
      if ($originalContent.length === 0) return false;
      var childScripts = $container.find('script');
      // Stop script tags which have document.write executing twice
      childScripts.each(function(i, el) {
        if ($(el).text().indexOf('document.write') === -1) return;
        el.type = 'text/xml';
      });
      // Remove image gallery newlines
      var $newlines = $originalContent.find('.newline-narrow-gallery, .newline-wide-gallery');
      if ($newlines.length > 0) {
        $newlines.remove();
      }
      // Save clone of original order
      this.originalContent = $originalContent.clone(true);
      this.contentBlocks = [];
      var contentCount = -1;
      var that = this;

      var processContentBlock = function($block) {
        var $rightBoxes = $block.find('.rightBox');
        if ($rightBoxes.length === 0) return;
        $rightBoxes.each(function(i, box) {
          var $box = $(box);
          var $boxParent = $box.parent();
          $box.remove().appendTo($boxParent);
        });
      };

      var addContent = function(index, el) {

        var $el = $(el);
        var elClone = that.processContent($el);
        var colClass = $el.parents('.col-half, .col-third').length > 0 ? 'col-half' : '' ;

        if (that.isContentStart($el) || index === 0) {

          // Deal with previous Content Block
          if (index > 0) processContentBlock(that.contentBlocks[contentCount]);

          // Get offset position
          var thisOffset = that.getOffset($el, contentCount);

          // Add new Content Block
          var wrapper = $('<div>').addClass(colClass);
          if (thisOffset !== false) {
            wrapper.attr({
              'data-offset-top': thisOffset.top,
              'data-offset-left': thisOffset.left
            });
          }
          wrapper.append(elClone);
          that.contentBlocks[++contentCount] = wrapper;
        } else {
          // Append to existing Content Block
          that.contentBlocks[contentCount].append(elClone);
        }

      };

      $originalContent.each(function(i, content) {

        var $content = $(content);

        if ($content.hasClass('col-half') || $content.hasClass('col-third')) {

          $contentChildren = $content.children();
          $contentChildren.each(addContent);

        } else {

          addContent(i, content);

        }

      });

      // Deal with last Content Block
      processContentBlock(this.contentBlocks[contentCount]);

      // Sort into positional order
      this.contentBlocks.sort(function(a, b) {
        var $a = $(a);
        var $b = $(b);
        // Sort by top position first
        var topA = $a.attr('data-offset-top');
        var topB = $b.attr('data-offset-top');
        if (!topA && !topB) return 0;
        if (topA !== topB) return topA - topB;
        // Same top, but if one is floated right, put that first
        if ($a.hasClass('right') || $a.hasClass('quote')) return -1;
        if ($b.hasClass('right') || $b.hasClass('quote')) return 1;
        // Then by left position
        var leftA = $a.attr('data-offset-left');
        var leftB = $b.attr('data-offset-left');
        if (leftA !== leftB) return leftA - leftB;
        // OK, it seems that these are in exactly the same position...
        return 0;
      });

      return this.contentBlocks;

    };

    this.isContentStart = function($el) {

      var headings = ['h1','h2']; //,'h3','h4','h5','h6'];
      // Is it a header?
      var isHeader = function($eo) {
        return $eo[0] && $.inArray($eo[0].nodeName.toLowerCase(), headings) > -1;
      };
      // Is it a boxout?
      var isBoxout = function($en) {
        return ($en.hasClass('boxout') === true || $en.hasClass('boxoutAlt') === true);
      };
      // Is it an FAQ container?
      var isFAQ = function($ep) {
        return ($ep.hasClass('faq-container') === true);
      };
      // Is it a tabs container?
      var isTabs = function($eq) {
        return ($eq.attr('id') === 'tabs');
      };
      // Header images are unpadded, have an img child and are followed by a heading or boxout
      var isHeaderImage = function($em) {
        var nextEl = $em.next();
        if (nextEl.length == 0) return false;
        if ($em.hasClass('unpadded') && $em.find('img').length > 0 && (isHeader(nextEl) || isBoxout(nextEl))) {
          return true;
        }
        return false;
      };
      // Floated images have a class 'left' or 'right' and contain an image
      var isFloatImage = function($em) {
        if (($em.hasClass('left') || $em.hasClass('right')) && $em.children('img').length > 0) {
          return true;
        }
        return false;
      };
      var $elPrev = $el.prev() || false;
      // First, see if it's a header image
      if (isHeaderImage($el)) return true;
      // Next, see if it's floated left or right
      if (isFloatImage($el) && !isHeader($elPrev)) return true;
      // Next, see if it's a heading tag
      if (isHeader($el)) {
        // Unless it's preceded by header image
        if (isHeaderImage($elPrev) === true) return false;
        // ...or a floated image
        if (isFloatImage($elPrev) === true) return false;
        return true;
      }
      // Next, check for boxouts with first-child headings
      if (isBoxout($el)) {
        if (($el.children().length > 0) && (isHeader($el.children().first()))) {
          // Unless it's preceded by header image
          if (isHeaderImage($elPrev) === true) return false;
          // ...or any image (maybe)
          if ($elPrev.length > 0 && $elPrev[0].nodeName.toLowerCase() === 'img') return false;
          return true;
        }
      }
      // Then, check for faq containers
      if (isFAQ($el)) return true;
      if (isTabs($el)) return true;
      return false;
    };

    this.sections = this.getSections($container);

  };

  var rqf = new RQF();
  rqf.init();

  // For debugging - comment out before going live
  if (!isLive) {
    window.rqf = rqf;
  }
});