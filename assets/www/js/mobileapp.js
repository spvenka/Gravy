(function($){
 
 var enpointURL = "http://ankara.herokuapp.com";
 
 $(document).ready(function(){ $(document).bind('deviceready', function(){ onDeviceReady() })});   
 
 function onDeviceReady(){
    //log call, in this case of type info. Other choices include debug, warn, and error.
    window.plugins.App47.info(["android cordova sample app started up"]);
 }

 $(function(){

    $("#submit_deal").submit(function(event, info) {   
		    
        window.plugins.App47.debug(["DEBUG android cordova sample app deal submitted!"]);             

        window.plugins.App47.getConfigurationGroupNames(function(result){            
            var data = JSON.parse(result);
            console.log("first group name from data is " + data[0]);
          }, 
          function(error){
            console.log("got an error " + error);
          });          
  

        var timedEventID = 0;
        //starting a timed event -- this returns an ID which is then 
        //used to mark the completion of the event
        window.plugins.App47.startTimedEvent(["deal submission"],  
                    function(result){ timedEventID = result; });        
        

        window.plugins.App47.getConfiguration("PG Demo", 
          function(result){
            console.log("got a result from getConfiguration" + result);
            var demoData = JSON.parse(result);
            console.log("PG Demo amount is " + demoData['amount']);
          }, 
          function(error){
            console.log("got an error " + error);
          });

        window.plugins.App47.getValue("PG Demo", "amount", 
          function(result){
            console.log("PG Demo amount is " + result);
          }, 
          function(error){
            console.log("PG Demo amount errored out " + error);
          });


        window.plugins.App47.getConfiguration("Demo", 
          function(result){
            console.log("got a DEMO result! " + result);
            window.plugins.App47.debug("got a result from DEMO getConfiguration: " + result);
            var demoData2 = JSON.parse(result);
            console.log("Demo amount is " + demoData2['test']);
          }, 
          function(error){
            console.log("got an error with Group DEMO " + error);
          });
        //runtime configuration, in this case in group PG with a key of endpoint_2
        //the value returned is a string (URL). The use case here is that various 
        //values can be updated/changed without redeploying new instances of an App
        // window.plugins.App47.getValue("PG_2", "endpoint_2", 
        //     function(result){
        //       enpointURL = result;
        //     }, 
        //     function(error){
        //       enpointURL =  "http://localhost:8080/";
        //     });
        
        var descp = $("input[id=description]", this);
        var tgs = $("input[id=tags]", this);
                             
        descp.blur();
        tgs.blur();
                             
        $.ajax({
              type: "PUT",
              //endpointURL was obtained via App47 SDK configuration value above 
              url: enpointURL, 
              data: JSON.stringify({ deal_description: descp.val() , all_tags: tgs.val() }),
              contentType: 'application/json', 
              dataType: 'json', 
              success: function(msg) { 
                $('#notice').empty();
                $("#notice").fadeIn(3, function() { 
                    $("#notice").append("Deal submitted!");
                    $('form :input').val("");	        
                    $("#notice").fadeOut(4200);
                     
                });
                //generic events have no notion of time -- they are similar to log stmts
               window.plugins.App47.sendGenericEvent(["Android deal submitted"]);
              }
        });
        //end the timed event started above
        if(timedEventID != 0){
               	window.plugins.App47.endTimedEvent([timedEventID]); 
        }
               return false;       
    });
 });
 
})(jQuery);