this.jQuery = jQuery.noConflict(true);

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
        var stepWrappers = jQuery(".step-wrapper").map(function() {
            return {
                selector: "#"+jQuery(this).attr("id"),
                name: jQuery(this).attr("id")
            }
        }).get();

        stepWrappers.push({
            selector: "#guide-comments-container",
            name: "guide-comments-container"
        })

        jQuery.screentime({
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
            jQuery.screentime.pauseTimers();
        });

        ifvisible.on("wakeup", function(){
            jQuery.screentime.resumeTimers();
        });
    }

    function monitorStepThumbnailActivity() {
        jQuery(".step-thumbnail").each(function() {
            var thumbnailId = jQuery(this).attr("data-fullimg");
            data.metrics.stepThumbnailHoverCount[thumbnailId] = 0;
            jQuery(this).on("mouseenter",function(){
               data.metrics.stepThumbnailHoverCount[thumbnailId]++;
            });
        });
    }

    function monitorGivePointsActivity() {
        jQuery("#successButton").click(function() {
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
