// ==UserScript==
// @name         iFixit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
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
            clickedGivePoints : false
        }
    }

    function monitorStepTimeActivity() {
        var stepWrappers = $(".step-wrapper").map(function() {
            return {
                selector: "#"+$(this).attr("id"),
                name: "#"+$(this).attr("id")
            }
        }).get();

        $.screentime({
            fields: stepWrappers,
            reportInterval: 1,
            percentOnScreen: "75%",
            callback: function(data, log) {
                data.metrics.stepTimeSpent = log;
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
            metrics.stepThumbnailHoverCount[thumbnailId] = 0;
            $(this).on("mouseenter",function(){
               data.metrics.stepThumbnailHoverCount[thumbnailId]++;
            });
        });
    }

    function monitorGivePointsActivity() {
        $(".successButton").click(function() {
            data.metrics.clickedGivePoints = true;
        });
    }

    monitorStepTimeActivity();
    monitorStepThumbnailActivity();
    monitorGivePointsActivity();

    setInterval(function() {
        console.log(data);
        //Send Metrics!
    }, 5000)

})();