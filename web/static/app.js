Pusher.logToConsole = true;

var pusher = new Pusher('8a86350fabc94179ab01', {
    cluster: 'ap2',
    encrypted: true
});


$(document).ready(function() {
    var totalGained = 0;
    var countTransactions = 0;

    var webUrl = "http://127.0.0.1:8001";
    var apiUrl = "http://127.0.0.1:8002";

    var pendingRequests = [];
    var latestTransactions = {};
    var latestReqIds = [];
    var maxLatestTransactions = 3;

    var timer = null;

    var channel = pusher.subscribe('cp-gain');
    channel.bind('cp-gain-response', function(data) {
        updateResponseHTML(data.request_id, data.capital);
    });

    function getInputs() {
        return {
            inputs: {
                name: $("#txtName").val(),
                favClub: $("#txtFavClub").val(),
                favPlayer: $("#txtFavPlayer").val()
            }
        };
    }

    function jsonToXML(object) {
        // Using: https://github.com/abdmob/x2js
        var x2js = new X2JS();
        return x2js.json2xml_str(object);
    }

    function xmlToJson(xmlStr) {
        // Using: https://github.com/abdmob/x2js
        var x2js = new X2JS();
        return x2js.xml_str2json(xmlStr);
    }

    function getPostInput() {
        var xmlStr = jsonToXML(getInputs());
        var encodedStr = btoa(xmlStr);
        return encodedStr;
    }

    function updateResponses() {
        console.log("inside updateResponses");
        console.log(pendingRequests);
        console.log(latestTransactions);
        var i = pendingRequests.length;
        while (pendingRequests.length > 0 && i > 0) {
            var thisRequestId = pendingRequests.pop();
            $.ajax({
                    type: "GET",
                    url: `${webUrl}/capital/${thisRequestId}/`
                })
                .done(updateResponseSuccess)
                .fail(function(error) {
                    pendingRequests.push(thisRequestId);
                    console.error(error);
                });
            i--;
        }

    }

    function updateResponseSuccess(result) {
        var requestId = result.request_id;
        if (result.available === true) {
            updateResponseHTML(requestId, result.capital);
            if (pendingRequests.length === 0 && timer != null) {
                clearTimeout(timer);
                timer = null;
                console.log("Clearing timer");
            }
        } else {
            pendingRequests.push(requestId)
        }

    }

    function updateResponseHTML(requestId, capital) {
        totalGained ++;
        $("#lastGainedReqId").html(requestId);
        $("#lastGained").html(JSON.stringify(capital));
        $("#capitalGained").html(totalGained);
    }

    function formSubmitSuccess(result) {
        var requestId = result.request_id;
        latestReqIds.push(requestId);
        pendingRequests.push(requestId);
        countTransactions++;
        latestTransactions[requestId] = getInputs();
        if (latestReqIds.length > maxLatestTransactions) latestReqIds.shift();
        var latestTransactionsHtml = "";
        for (var reqId in latestTransactions) {
            if (latestReqIds.indexOf(reqId) === -1) {
                delete latestTransactions[reqId];
                continue;
            }
            var transaction = latestTransactions[reqId];
            latestTransactionsHtml = '\
                <h6 class="card-title">' + reqId + ' </h6> \
                <div class="card-text">' + JSON.stringify(transaction) + '</div><hr />' +
                latestTransactionsHtml;
        }
        $("#latestTransactions").html(latestTransactionsHtml);
        $("#countTransactions").html(countTransactions);
        $("#btnGainCapital").prop('disabled', false);

        // console.log(timer);
        // if (timer == null) {
        //     // Using poll
        //     // TODO: replace this task.
        //     // use socket connection / tools like Pusher.com
        //     console.log("setting timer");
        //     timer = setTimeout(updateResponses, 200);
        // }
    }

    function formSubmitFailed(error) {
        console.error(error);
        $("#latestTransactions").html("failed");
        $("#btnGainCapital").prop('disabled', false);
    }

    $("#btnGainCapital").click(function(e) {
        $("#btnGainCapital").prop('disabled', true);
        e.preventDefault();
        var sendInfo = {
            request: getPostInput(),
            callback_url: `${webUrl}/capital/`
        };
        console.log(sendInfo);
        $.ajax({
                type: "POST",
                url: `${apiUrl}/capital/`,
                data: JSON.stringify(sendInfo),
                dataType: 'json',
                contentType: 'application/json'
            })
            .done(formSubmitSuccess)
            .fail(formSubmitFailed);
    });

});
