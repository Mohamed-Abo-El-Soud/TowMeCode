// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function (request, response) {
    response.success("Good bye world!");
});
Parse.Cloud.beforeSave("LocationPost", function (request, response) {
    console.log("how's it going?!");
    request.object.set("location", new Parse.GeoPoint(30.0, -20.0));
    response.success();
    //  if (request.object.set("objectId") == "Dqh2lqXn6N") {
    //    response.error("this user has been denied access");
    //  } else {
    //    response.success();
    //  }
});

Parse.Cloud.define("requestTowTruckers", function (request, response) {
    var TowTruckers = Parse.Object.extend("TowTruckers");
    var query = new Parse.Query(TowTruckers);
    query.limit(5);
    query.find({
      success: function(results) {
        alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) { 
          var object = results[i];
          alert(object.id + ' - ' + object.get('name'));
        }
        response.success(results);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
        response.error(error);
      }
    });
    
});

