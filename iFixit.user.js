// ==UserScript==
// @name         iFixitClientMetrics
// @namespace    https://www.ifixit.com
// @version      0.2.4
// @description  Tracks anonymized metrics on iFixit
// @author       CSC 484 - Cal Poly
// @match        https://www.ifixit.com/Guide/*
// @require      jquery-3.3.1.min.js
// @require      screentime.js
// @require      ifvisible.min.js
// @require      browser-cuid.min.js
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    var data = {
        meta: {
            sessionId : cuid(),
            page : window.location.pathname,
        },
        metrics: {
            stepTimeSpent : {},
            stepThumbnailHoverCount : {},
            clickedGivePoints : false,
            commentsTimeSpent: 0
        }
    }

    function monitorPageSectionTimeActivity() {
        var stepWrappers = $(".step-wrapper").map(function() {
            return {
                selector: "#"+$(this).attr("id"),
                name: $(this).attr("id")
            }
        }).get();

        stepWrappers.push({
            selector: "#guide-comments-container",
            name: "guide-comments-container"
        })

        $.screentime({
            fields: stepWrappers,
            reportInterval: .25,
            percentOnScreen: "75%",
            callback: function(stData, stLog) {
                data.metrics.stepTimeSpent = JSON.parse(JSON.stringify(stLog));
                data.metrics.commentsTimeSpent = data.metrics.stepTimeSpent["guide-comments-container"];
                delete data.metrics.stepTimeSpent["guide-comments-container"];
            }
        });

        ifvisible.on("idle", function(){
            $.screentime.pauseTimers();
        });

        ifvisible.on("wakeup", function(){
            $.screentime.resumeTimers();
        });
    }

    function monitorStepThumbnailActivity() {
        $(".step-thumbnail").each(function() {
            var thumbnailId = $(this).attr("data-fullimg");
            data.metrics.stepThumbnailHoverCount[thumbnailId] = 0;
            $(this).on("mouseenter",function(){
               data.metrics.stepThumbnailHoverCount[thumbnailId]++;
            });
        });
    }

    function monitorGivePointsActivity() {
        $("#successButton").click(function() {
            data.metrics.clickedGivePoints = true;
        });
    }

    window.addEventListener('load', function() {
        monitorPageSectionTimeActivity();
        monitorStepThumbnailActivity();
        monitorGivePointsActivity();

        setInterval(function() {
            console.log(data);
            //Send Metrics!
        }, 5000)
    })

})();
