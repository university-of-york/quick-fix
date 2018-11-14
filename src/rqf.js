//hello

// load jQuery if not included on the page
if (!window.jQuery) {
  (function (d, t) {
    var jq = d.createElement(t), s = d.getElementsByTagName(t)[0];
    jq.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js';
    jq.onload = function() {
      go();
    };
    s.parentNode.insertBefore(jq, s);
  })(document, 'script');
} else {
  go();
}

function go() {

  // Stop conflict with Prototype on Pure
  if (typeof Prototype === 'object') {
    jQuery.noConflict();
  }

  var _LOCATION_TYPE = {
    host: 'hostname',
    path: 'pathname'
  };

  // Pass jQuery's $ to the RQF code
  jQuery(document).ready(function($) {

    var $window = $(window);
    var $html = $('html');
    var $mdcolumn = $('#mdcolumn');
    var isFOI = (window.location.hostname === "yorkfestivalofideas.com") || (window.location.pathname.indexOf("foi-rqf-test") > -1);
    var isConcerts = (window.location.hostname === "yorkconcerts.co.uk") || (window.location.pathname.indexOf("/concerts/") === 0);
    var isStaffStudents =
        (window.location.pathname.indexOf('/students/') > -1) ||
        (window.location.pathname.indexOf('/staff/') > -1) ||
        (window.location.hostname.indexOf('cmstest') > -1); // NOTE - need to fix this because ALL things in test will be classed as staff/student!

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

      this.addClass = function(e) {
        e.preventDefault();
        var that = e.data.that;
        // Change HTML class
        $html.toggleClass(that.pageClass);
        // Update input state
        that.input.attr('checked', $html.hasClass(that.pageClass));
        that.checkContent();
      };

      this.checkContent = function() {

        this.isRQF = $html.hasClass(this.pageClass);

        // Update cookie
        document.cookie = 'rqf='+(this.isRQF ? 'true' : 'false');

        // Update content on page
        this.updateContent();

        if (this.isRQF) {

          // Listen for window resize and debounce
          var that = this;
          var resizeFunction = debounce(function() {
            // If we've changed from mobile to desktop (or vice versa)
            if(that.status !== that.getStatus()) {
              that.updateContent();
            }
          }, 250);
          $window.resize(resizeFunction);
        }
      };

      this.updateContent = function() {

        var $location = $('#location');
        var $mainHeading = $location.children('h1');

        function updateLogo() {
          var newLogoImg = 'https://www.york.ac.uk/static/1.4/img/logo.png';
          var hasSVG = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
          var swapImage = !hasSVG;
          var locationEl = $('#location a');

          var images = {
            logoFOI: 'http://yorkfestivalofideas.com/media/news-and-events/york-festival-of-ideas/foi-logo.gif',
            logoConcertsPNG: 'https://www.york.ac.uk/media/global/responsiveredesign/img/concerts-logo.png',
            logoConcertsSVG: 'https://www.york.ac.uk/media/global/responsiveredesign/img/concerts-logo.svg'
          };

          var urls = {
            FOI: 'http://yorkfestivalofideas.com/',
            concerts: 'http://yorkconcerts.co.uk/'
          };

          if (isFOI === true) {
            newLogoImg = images.logoFOI;
            locationEl.attr('href', urls.FOI);
            swapImage = true;
          }
          if (isConcerts === true) {
            newLogoImg = hasSVG ? images.logoConcertsSVG : images.logoConcertsPNG;
            locationEl.attr('href', urls.concerts);
            // Remove additional logo
            $('#location > img').remove();
            $('body').addClass('york-concerts-page');
            swapImage = true;
          }

          // only swap the image if we have to;
          if(swapImage) {
              // Search IMGs in #location (Vintage) and header (2013)
              $('#location a img, header img, #logo img').each(function (i, img) {
                  img.removeAttribute('width');
                  img.removeAttribute('height');
                  img.src = newLogoImg;
                  img.style.display = 'block';
              });
          }


          if ($mainHeading.length > 0) {
            if ($.trim($mainHeading.text()) === '') {
              // Remove empty headings
              $mainHeading.remove();
              // remove bottom padding
              // $location.css('padding-bottom', 0);
            } else {
              // see if text is spilling out
              checkHeadingHeight();
              $window.resize(debounce(function () {
                checkHeadingHeight();
              }, 250));
            }
          }
        }

        function checkHeadingHeight() {
          // Reset to get default height and padding-bottom
          $location.css('padding-bottom', '');
          var locationPadding = parseInt($location.css('padding-bottom'), 10);
          var headingHeight = $mainHeading.outerHeight();
          var padDiff = Math.max(locationPadding - headingHeight, 0);
          $mainHeading.css('position', 'static');
          var newHeadingHeight = $mainHeading.outerHeight();
          $mainHeading.css('position', 'absolute');
          // Update padding according to padDiff and newHeadingHeight
          $location.css('padding-bottom', padDiff+newHeadingHeight);
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

        function updateSearchTarget() {
          if ($('#university').length > 0) {
            $('#university').prop('checked', true);
          }
        }

        // Update logo
        if (!this.contentUpdated) {

          updateLogo();
          updateBreadcrumb();
          updateSearchTarget();

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

        // do scripts
        this.runScripts();
        // Trigger window onload and hashchange (for tabs)
        $window.trigger('load');
        if ($('.tabs').length > 0) {
          $window.trigger('hashchange');
        }
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

      this.runScripts = function() {
        $('.script-wrapper').each(function(i, scriptWrapper) {
          var $scriptWrapper = $(scriptWrapper);
          //console.log('Script wrapper found', $scriptWrapper);
          if ($scriptWrapper.text().indexOf('document.write') === -1) {
            // Appending a script runs it automatically
            var s = $('<script>').text($scriptWrapper.text());
            // Copy attributes too
            var attrs = $scriptWrapper[0].attributes;
            $.each(attrs, function(i, v) {
              s.attr(v.nodeName, v.nodeValue);
              if (i === attrs.length-1) {
                $scriptWrapper.replaceWith(s);
              }
            });
          }
        });
      };

      this.resetFacebook = function() {
        var t = setInterval(function() {
          try {
            //console.log(FB);
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
          var captionHeights = [];
          var imgHeights = $imgs.map(function(i, img) {
            var $img = $(img);
            var $container = $img.closest('.imagewithcaption');
            // Get caption (if it's .caption or p+p)
            var $caption = $img.next('.caption');
            if ($caption.length === 0) $caption = $container.find('p + p');
            $container.css('display', 'block');
            var imgHeight = $img.height();
            var captionHeight = $caption.outerHeight();
            captionHeights.push(captionHeight);
            $container.css('display', 'none');
            return imgHeight;
          });
          var maxImgHeight = Math.max.apply(null, imgHeights);
          var maxCaptionHeight = Math.max.apply(null, captionHeights);
          $homepagebanner.cycle(cycleOptions);
          if (maxImgHeight > 0) $homepagebanner.height(maxImgHeight);
          var bannerPadding = parseInt($homepagebanner.css('padding-bottom'), 10);
          if(bannerPadding > 0) {
            $homepagebanner.css('padding-bottom', maxCaptionHeight);
          }
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
            var wrapperTop = $tabWrapper.offset().top;
            // Hide headers
            $tabContainers.children('.tab').hide();

            $tabList.addClass('tabNavigation');

            $(window).bind('hashchange', function(e) {

              e.preventDefault();

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
                  // scroll to top of tabs if a tab is selected
                  $(window).scrollTop(wrapperTop);
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
            //if (videoWidthAttr !== videoWidth) {
              var aspectRatio = parseFloat($video.attr('data-aspect-ratio'));
              $video.attr({
                'height': videoWidth/aspectRatio
              });
            //}
          });
        };

        $window.resize(debounce(resizeFunction, 500));
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

      this.loadStaffStudentStyles = function() {

        var head = document.head;
        var link = document.createElement("link");

        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = "https://www.york.ac.uk/static/rqf/rqf-staff.min.css";

        head.appendChild(link);
      };

      this.init = function() {

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

        // Fix feedback form on staff and students
        if (isStaffStudents === true) {
          this.fixFeedbackForm();
          //this.loadStaffStudentStyles();
        }

        this.checkContent();
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
          if ($tabContent.length === 0) {
            $tabContent = $content.find(href+'-content');
          }
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
          // Make sure question is first!
          $tabContent.children('h3.q').prependTo($tabContent);
          r.append($tabContent);

        });
        return r;

      };

      this.fixTable = function($table) {

        var $tableHead = $table.children('thead');
        var $tableBody = $table.children('tbody');
        var $tableContainer = $('<div>').addClass('table-container');
        var tableClasses = $table[0].className;
        var tableSpans = $table.find('td[colspan], td[rowspan]').length;

        // Get header row if needed
        if ($tableHead.length === 0) {
          $tableHead = $tableBody;
        }

        var $tableFirstRow = $tableHead.children('tr:first-child');
        var $tableHeadings = $tableFirstRow.children();

        // Not very tabular - just return the same table
        if ($tableHeadings.length < 3) return $table.clone();

        //If there's colspans or rowspan, return the same table
        if (tableSpans > 0) return $table.clone();

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
          if ($row.hasClass('is-hidden@mobile')) {
            return;
          }
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

        var elClone = $el.clone(true, true);

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

        var childScripts = $container.find('script');
        childScripts.each(function(i, el) {
          var $el = $(el);
          // Wrap scripts to stop them re-running when switching
          var elText = $el.text();
          var scriptWrapper = $('<div>').text(elText);
          // Copy all attributes too
          var attrs = $el[0].attributes;
          $.each(attrs, function(i, v) {
            scriptWrapper.attr(v.nodeName, v.nodeValue);
            if (i === attrs.length-1) {
              scriptWrapper.addClass('script-wrapper').css('display','none');
              $el.replaceWith(scriptWrapper);
            }
          });
        });

        var $originalContent = $container.children();
        if ($originalContent.length === 0) return false;

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
            var thisContentBlock = that.contentBlocks[contentCount];
            if(elClone[0].nodeName === 'SCRIPT') {
              // Stop script tags which have document.write executing twice
              if (elClone[0].innerHTML.indexOf('document.write') === -1) {
                that.contentBlocks[contentCount].append(elClone);
              }
            } else {
              // Append to existing Content Block
              that.contentBlocks[contentCount].append(elClone);
            }
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
  });
}