var OneSignal = require('onesignal-node');

oneSignalClient = new OneSignal.Client({    
    userAuthKey: process.env.USER_AUTH_KEY,
    app: { appAuthKey: process.env.APP_AUTH_KEY, appId: process.env.APP_ID }    
});

module.exports.notifyTeam = function(notificationIds, event) {
    var notification = new OneSignal.Notification({
        contents: {
            "en": "Stints of event " + event.name + " were replanned",
            "de": "Die Stints vom Event " + event.name + " wurden umgeplant"
        },
        include_player_ids: notificationIds,
        data: {
            "eventId":event._id
        }
    });
   
    oneSignalClient.sendNotification(notification, function (err, httpResponse,data) {    
        if (err) {
            console.log('Error sending notification: '+err);    
        }    
    });
}

module.exports.notifyDriver = function(notificationId, teamId, eventId) {
    var notification = new OneSignal.Notification({
        contents: {
            "en": "Upcoming stint for you",
            "de": "Du musst bald einen Stint fahren!"
        },
        include_player_ids: [notificationId],
        data: {
            "eventId":eventId,
            "teamId":teamId
        }
    });
   
    oneSignalClient.sendNotification(notification, function (err, httpResponse,data) {    
        if (err) {
            console.log('Error sending notification: '+err);    
        }    
    });
}

module.exports.sendBroadcast = function(msg) {

    var notification = new OneSignal.Notification({ 
        contents: {"en": msg},
        included_segments: ["Active Users", "Inactive Users"]
    });

    // send this notification to All Users except Inactive ones    
    oneSignalClient.sendNotification(notification, function (err, httpResponse,data) {    
        if (err) {
            console.log('Error sending notification: '+err);    
        }    
    });
}