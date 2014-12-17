// Use Parse.Cloud.define to define as many cloud functions as you want.

//Parse.Cloud.beforeSave("LocationPost", function (request, response) {
//    console.log("how's it going?!");
//    request.object.set("location", new Parse.GeoPoint(30.0, -20.0));
//    response.success();
    //  if (request.object.set("objectId") == "Dqh2lqXn6N") {
    //    response.error("this user has been denied access");
    //  } else {
    //    response.success();
    //  }
//});
 
// Parse.Cloud.define("requestTowTruckers", function (request, response) {
//     var TowTruckers = Parse.Object.extend("TowTruckers");
//     var query = new Parse.Query(TowTruckers);
//     query.limit(5);
//     query.find({
//       success: function(results) {
//         alert("Successfully retrieved " + results.length + " scores.");
//         // Do something with the returned Parse.Object values
//         for (var i = 0; i < results.length; i++) { 
//           var object = results[i];
//           alert(object.id + ' - ' + object.get('name'));
//         }
//         response.success(results);
//       },
//       error: function(error) {
//         alert("Error: " + error.code + " " + error.message);
//         response.error(error);
//       }
//     });
     
// });


// https://zHvdP3Em9tLrPXURI2NZ4rjbtyj7wlVtVKn6lqON:javascript-
// key=U6cs25utF5nGsph8QYeLD1S2AFMmcJSXKtPuPEH2@api.parse.com/1/classes/LocationPost/
// Ed1nuqPvcm

Parse.Cloud.define("requestTowTruckers", function (request, response) {
    var TowTruckers = Parse.Object.extend("TowTruckers");
    var query = new Parse.Query(TowTruckers);
    query.limit(5);
    var yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    query.lessThan("createdAt", yesterday);
    query.equalTo("anonymous", true);
    //query.greaterThan("createdAt",{"__type":"Date", "iso":"2014-12-01T19:40:47.102Z"})
    query.find({
      success: function(results) {
        alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        
        response.success(results);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
        response.error(error);
      }
    });
     
});

Parse.Cloud.define("cleanUpDatabase",function(request, response) {
  cleaningUp(Parse,request,response,console.log);
});

function cleaningUp(Parse,request,outcome,logger){
  // Set up to modify user data
  Parse.Cloud.useMasterKey();
  // get the location post class
  var LocationPost = Parse.Object.extend("LocationPost");
  // query entries in the location post class
  var query = new Parse.Query(LocationPost);
  // get yesterday's date from the current date at runtime
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-1);
  query.lessThan("updatedAt", yesterday);
  query.find({
    success:function(results) {
      for (var index in results) {
        var locationPost = results[index];
        var user = locationPost.get("user");
        var successFn = (results.length-index<=1)?
        singleCleanLast.bind(null,outcome,logger,locationPost)
        :singleClean.bind(null,logger,locationPost);
        var errorFn = (results.length-index<=1)?
        defaultErrorLast.bind(null,outcome)
        :defaultError;
        if(user){
          user.fetch({
            success:successFn
            ,
            error:errorFn
        });
        }
      }
    },
    error:function(results) {
      outcome.error("Uh oh, something went wrong.");
    }
  });
}

function singleClean(logger,locationPost,parseUser){
  if(parseUser.get("isAnonymous")===true){
    parseUser.destroy();
    locationPost.destroy();
  }
}

function singleCleanLast(outcome,logger,locationPost,parseUser){
  singleClean(logger,locationPost,parseUser);
  outcome.success("Migration completed successfully.");
}

function defaultError(parseUser,error){
  alert(error);
}

function defaultErrorLast(outcome,parseUser,error){
  alert(error);
  outcome.error("Uh oh, something went wrong.");
}

function deleting(Parse,request,outcome,logger){
  Parse.Cloud.useMasterKey();
  
  var query = new Parse.Query(Parse.User);
  query.equalTo("username","cowman");
  query.find({
    success:function(results){
      console.log(results);
      console.log(results[0]);
      if(results[0]){
        var user = results[0];
        user.destroy();
        outcome.success("It is done");
        return;
      }
      outcome.success("It wasn't done!");
    }
    ,
    error:function(parseUser,error){
      outcome.error("Uh oh, something went wrong.");
    }
    });
}

// helper job that gets rid of old and unused anon users
Parse.Cloud.job("cleanUpDatabase",function(request,status){
  cleaningUp(Parse,request,status,console.log);
});

// a helper function to get the User session-
// token given their email, first name or last name
Parse.Cloud.define("getUserSessionToken", function(request, response) {

    Parse.Cloud.useMasterKey();

    var email = request.params.email;

    var query = new Parse.Query(Parse.User);
    query.equalTo("email", email);
    query.limit(1);
    query.find({
        success: function(users) {
            if(users.length)
              response.success(users[0].getSessionToken());
            else
              response.success("null");
        },
        error: function(error) {
            response.error(error.description);
        }
    });

});
