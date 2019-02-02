
var commandBuilder = {

   changeCurrentContext: function(context){
       var command = {
           commandName: 'changeCurrentContext',
           commandPayload: {
                changeContextTo: context
            }
      };

      return command;
   },

   deleteContext: function(contextToDelete){
       var command = {
           commandName: 'deleteContext',
           commandPayload: {
                contextToDelete: contextToDelete
            }
      };

      return command;
   },

   createNewContext: function(contextName){
       var command = {
           commandName: 'createNewContext',
           commandPayload: {
                contextName: contextName
            }
      };

      return command;
   },

   queryAllContexts: function(){
       var command = {
           commandName: 'queryAllContexts',
           commandPayload: { }
      };

      return command;
   }

};

var commandBus = {
   send:  function(command, callback) {
        chrome.runtime.sendMessage(command, function(response) {
            callback(response.err, response.payload);
        });
   }
}

var app = {

   "init" : function( ){

        var source   = document.getElementById("main-template").innerHTML;
        var template = Handlebars.compile(source);


       commandBus.send(commandBuilder.queryAllContexts(), function(err, queryResult){

            if(err != null){
                console.log(err);
                return;
            }

            console.log(queryResult);

            var context = queryResult;
            var html    = template(context);

            $('#main-container').html(html);

       });

       var rmvs = $(".context-item");
       
       rmvs.each(function(){
            var contextItem = this;
            var contextName = $(contextItem).data('tcsContext');

            $('.change-context-button', this).click(function(){
                var changeContextCommand = commandBuilder.changeCurrentContext(contextName);

                commandBus.send(changeContextCommand, function(err, response){

                    if(err != null){
                        console.log(err);
                        return;
                    }

                });

            });

            $('.rmv', this).click(function(){
                var deleteContextCommnad = commandBuilder.deleteContext(contextName);

                commandBus.send(deleteContextCommnad, function(err, response){

                    if(err != null){
                        console.log(err);
                        return;
                    }

                    contextItem.remove(); 

                });
            });


       });

       
       $( ".add" ).keypress(function(e) {
           var ENTER = 13;
           var pressedKey = e.which;

	   		if(pressedKey == ENTER) {
	      		var contextName = $(this).val();
                
                var createNewContextCommand = commandBuilder.createNewContext(contextName);

                commandBus.send(createNewContextCommand, function(err, response){


                    if(err != null){
                        console.log(err);
                        return;
                    }

                    var newContextItem = $('<li class="context-item list-group-item justify-content-around">'
                                    + contextName.toUpperCase() + 
                                    '<span class="rmv">remove</span></a></li>');
                    
                    newContextItem.insertBefore($('.scroll-down-button'));
                        

                });

	    	}
	   });
	}
};

$(document).ready(function () {
     app.init();
})