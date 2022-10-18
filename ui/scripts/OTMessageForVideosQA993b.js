var startCats;
var firstLoad = false;
var oneTrustLoaded = false;
var hasYTVideos = false;
var isDevSite = ((window.location.host.indexOf("qa.dana-farber.org") != -1) || (window.location.host.indexOf("dfciwebdev.org") != -1) || (window.location.host.indexOf("local.dana-farber.org") != -1) ? true : false);
var isDevSiteAndCanTest = (((isDevSite) && (window.location.search == "?testvideomessage=true")) ? true : false);

$(document).ready(function () {

    firstLoad = true;
    oneTrustLoaded = ((typeof OnetrustActiveGroups === 'undefined') || (OnetrustActiveGroups === undefined) || (OnetrustActiveGroups == ",,") || (OnetrustActiveGroups.indexOf("C0001") == -1)) ? false : true;

    if (oneTrustLoaded) {
        startCats = OnetrustActiveGroups;
    }
    else {
        startCats = ",C0001,";
    }

    //TODO
    $("iframe").each(function () {

        var srcAttrCheck = $(this).attr("data-src");

        if (srcAttrCheck == undefined) {
            srcAttrCheck = $(this).attr("src");
        }

        var hasYouTubeVid = (((srcAttrCheck !== undefined) && (srcAttrCheck.indexOf("youtube") != -1)) ? true : false);

        if (hasYouTubeVid) {
            hasYTVideos = true;
            return false;
        }

    });

});

function HTMLCheck() {

    //LIVE or environments where OT works correctly
    var missingAnyCat = (((OnetrustActiveGroups.indexOf("C0002") == -1) || (OnetrustActiveGroups.indexOf("C0003") == -1) || (OnetrustActiveGroups.indexOf("C0004") == -1)) ? true : false);

    //For testing on dev or qa where videos are already loading
    if (isDevSiteAndCanTest) {
        missingAnyCat = true;
    }

    if (missingAnyCat) {

        $("iframe").each(function () {

            var hasBackground = ((($(this).parent().css("padding-bottom") != 0) && ($(this).parent().css("padding-bottom") != "0px")) ? true : false);

            var iframeHeight = $(this).height();
            var iframeWidth = $(this).width();

            //LIVE or environments where OT works correctly
            var srcAttr = $(this).attr("data-src");

            if (isDevSiteAndCanTest) {
                //For testing on dev or qa where videos are already loading 
                srcAttr = $(this).attr("src");
            }

            var containsYouTubeURL = (((srcAttr !== undefined) && (srcAttr.indexOf("youtube") != -1)) ? true : false);

            if (containsYouTubeURL) {

                if (hasBackground) {
                    $(this).replaceWith("<div style='padding:10px 20px;'><p>This video is blocked because your cookie setting prevents us from playing it. Please <a href='javascript:openOT()'>enable cookies</a> if you would like to view this video.</p></div>");
                }
                else {
                    $(this).replaceWith("<div style='padding:10px 20px;width:" + iframeWidth + "px;height:" + iframeHeight + "px;background-color:#eeeeee;'><p>This video is blocked because your cookie setting prevents us from playing it. Please <a href='javascript:openOT()'>enable cookies</a> if you would like to view this video.</p></div>");
                }
            }

        });
    }

}

function openOT() {
    OneTrust.ToggleInfoDisplay();
}

function OptanonWrapper() {

    if (hasYTVideos) {

        oneTrustLoaded = ((typeof OnetrustActiveGroups === 'undefined') || (OnetrustActiveGroups === undefined) || (OnetrustActiveGroups == ",,") || (OnetrustActiveGroups.indexOf("C0001") == -1)) ? false : true;

        if (oneTrustLoaded) {
            HTMLCheck();

            if ((startCats != OnetrustActiveGroups) && (!firstLoad)) {

                SetEndOfPageVariables();
                location.reload();
            }

            SetEndOfPageVariables();
        }
    }
    else {

        SetEndOfPageVariables();
    }
}

function SetEndOfPageVariables() {

    firstLoad = false;
    startCats = OnetrustActiveGroups;

}