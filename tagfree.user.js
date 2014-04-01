// ==UserScript==
// @name           Tag Free
// @version        0.1
// @namespace      http://classy.dk/tagfree
// @description    Hide all the Twitter groupthink
// @match          https://twitter.com/*
// @require        https://code.jquery.com/jquery-latest.js
// @copyright      2014, Claus Dahl - do what you want with this
// ==/UserScript==


(function () {
    var myControls = $('<div class="tagfree-container"></div>');
    $('.global-nav-inner').append(myControls);
    $('.global-nav-inner').append($('<style>.tagfree-container{padding-bottom:5px;width:100%;background-color:white;float:left;overflow-y:hidden;height:30px}.tagfree-container:hover{height:auto}</style>'));
    // make room for tags
    myControls.parent().height(myControls.parent().height()+30);
    // move the content lower so we're not covering that up
    $('#page-container').first().css('padding-top', 
                                     (parseInt($('#page-container').first().css('padding-top')) + 30) + 'px');
    var enable_for_this_url = true;
    // TODO store a tag object, not just a number with properties to remember e.g. ui state + store controls
    var tagsSeen = {};
    var tagClass = function(tag) {
        return  'hashtag' + tag.replace(/\W/,'');
    };
    var tagToggle = function(tag) {
        $('.' + tagClass(tag)).toggle();
    }
    var tagClick = function(event) {
        var tag = $(event.target).data('tag');
        tagToggle(tag);
    }
    var hideEverythingClick = function(event) {
        //        var keep_last = $('.seen').last();
        //        keep_last.removeClass('seen');
        $('.seen').hide();
        //        keep_last.addClass('seen');
    };
    var toggleTagsClick = function(event) {
        for (var tag in tagsSeen) {
            tagToggle(tag);
        }
    };
    var findTags = function (element) {
        var hidenow = false;
        $(element).find('.twitter-hashtag').each(function(i, tagelem) {
            var tag = $(tagelem).children().last().text();
            tagsSeen[tag] = tagsSeen[tag] || 0;
            tagsSeen[tag] = tagsSeen[tag] + 1;
            // hidenow ||= hideTagPolicy(tag); - replaces hard 5 (remembers tag setting) TODO
            if (tagsSeen[tag]>5) {
                hidenow = true;
            }
            $(element).addClass(tagClass(tag));
        });
        return hidenow;
    };
    var buildControlList = function() {
        var tagarray = [];
        
        // General controls
        var hideeverything = $("<a href='javascript:0;'>Hide all loaded tweets</a>");
        hideeverything.click(hideEverythingClick);
        hideeverything.css('background-color', 'lightgrey');
        var hidetags = $("<a href='javascript:0;'>Toggle all tags</a>");
        hidetags.click(toggleTagsClick);
        hidetags.css('background-color', 'lightgrey');
        tagarray.push(['hide all', 10000, hideeverything]);
        tagarray.push(['hide tags', 9999, hidetags]);
        
        // tag controls
        for (var tag in tagsSeen) {
            var control = $("<a class='tagfree-control'>#" + tag + "(" + tagsSeen[tag] + ")" + "</a>");
            control.attr('href', 'javascript:0;')
            control.data('tag', tag);
            control.click(tagClick);
            //            control.attr('onclick', "$('." + tagClass(tag) + "').parent().toggle();");
            tagarray.push([tag,tagsSeen[tag],control]);
        }
        return tagarray.sort(function(a,b) {
            if (a[1] == b[1]) {
                return a[0].localeCompare(b[0]);
            } else {
                return b[1]-a[1]; // descending order
            }
        });
    };
    var buildControls = function() {
        if (window.location.pathname == '/') {
            enable_for_this_url = true;
        } else {
            enable_for_this_url = false;
            tagsSeen = {};
        }
        myControls.html('');
        if (enable_for_this_url) {
            var controls = buildControlList();
            for (var i in controls) {
                myControls.append(controls[i][2]);
                myControls.append(' ');
            }
        }
    };
    var checkElements = function() {
        if (enable_for_this_url) {  
            $('.content-main .tweet').not('.seen').each(function (i,elem) {
                var hidenow = findTags(elem);
                $(elem).addClass('seen'); // never check this element againg
                // hideElementPolicy(elem, hidenow); -- replaces next basic logic TODO
                if (hidenow) {
                    $(elem).hide();
                }
            });
        }
        buildControls();
        window.setTimeout(function() {checkElements();}, 1000);
    };
    checkElements();
})();
