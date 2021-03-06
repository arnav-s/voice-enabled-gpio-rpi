$(function () {
    var socket = io();

    $('.led-li').on('click', function(){
	var li = $(this);
	if(li.hasClass('active')) {
	    socket.emit('off', li.attr('id'));
	    console.log('off ' + li.attr('id'));
	} else {
	    socket.emit('on', li.attr('id'));
	    console.log('on ' + li.attr('id'));
	}
    });

    socket.on('on-success', function(msg) {
	console.log('on ' + msg);
	$('#' + msg).addClass('active');
    });

    socket.on('off-success', function(msg) {
	console.log('off ' + msg);
	$('#' + msg).removeClass('active');
    });

	window.SpeechRecognition = window.SpeechRecognition     ||
                                 window.webkitSpeechRecognition ||
                                 null;

	if (window.SpeechRecognition != null) {
 	    var recognizer = new window.SpeechRecognition();
 	    var transcription = document.getElementById('transcription');

 	    // Recogniser doesn't stop listening even if the user pauses
 	    //recognizer.continuous = true;

 	    // Start recognising
 	    recognizer.onresult = function(event) {
	 	    transcription.textContent = '';
	 	    $('.sound-button').removeClass('listening');
	        $('.sound-button-container').removeClass('listening');

	 	    for (var i = event.resultIndex; i < event.results.length; i++) {
	 			if (event.results[i].isFinal) {
	 	            transcription.textContent = event.results[i][0].transcript;
				} else {
	 	            transcription.textContent += event.results[i][0].transcript;
				}
			}

			var parse = '';
			var dataset = transcription.textContent;
			var dataset_array = dataset.split(" ");
			for(var i = 0; i < dataset_array.length; i++){
				if(dataset_array[i].search('light')!=-1 ||
				 dataset_array[i].search('lights')!=-1 || 
				 dataset_array[i].search('on')!=-1 || 
				 dataset_array[i].search('off')!=-1 || 
				 dataset_array[i].search('fan')!=-1 || 
				 dataset_array[i].search('heater')!=-1 || 
				 dataset_array[i].search('microwave')!=-1 || 
				 dataset_array[i].search('TV')!=-1 ){

	  				parse += dataset_array[i];	
				}
				// else{
				// 	log.innerHTML += dataset_array[i];
				// }
			}
			var match = false;
			//log.innerHTML = parse;
			if(parse=='lighton' || parse=='onlight'||parse=='lightson'||parse=='onlights'){
				// log.innerHTML= "LIT";
				lightOn();
				match = true;
			}
			if(parse=='lightoff' || parse=='offlight'||parse=='lightsoff'||parse=='offlights'){
				// log.innerHTML= "It ain't lit anymore";
				lightOff();
				match = true;
			}
			if(parse=='fanon' || parse=='onfan'){
				// log.innerHTML= "HIGH";
				fanOn();
				match = true;
			}
			if(parse=='fanoff' || parse=='offfan'){
				// log.innerHTML= "LOW";
				fanOff();
				match = true;
			}
			if(parse=='heateron' || parse=='onheater'){
				// log.innerHTML= "HOT";
				heaterOn();
				match = true;
			}
			if(parse=='heateroff' || parse=='offheater'){
				// log.innerHTML= "COOL";
				heaterOff();
				match = true;
			}
			if(parse=='TVon' || parse=='onTV'){
				// log.innerHTML= "SHOWTIME";
				tvOn();
				match = true;
			}
			if(parse=='TVoff' ||  parse=='offTV'){
				// log.innerHTML= "Let's go home";
				tvOff();
				match = true;
			}
			if(parse=='microwaveon' || parse=='onmicrowave'){
				// log.innerHTML= "FOOOODD";
				microwaveOn();
				match = true;

			}
			if(parse=='microwaveoff' || parse=='offmicrowave'){
				// log.innerHTML= "HUNGGRRYYYY";
				microwaveOff();
				match = true;
			}

			if (!match) {
				transcription.innerHTML = 'Did not comprehend<br>"' + transcription.innerHTML + '"'
			}

			//Code for light on

			function lightOn()
			{
				socket.emit('on', "11");
			};


			//Code for light Off

			function lightOff()
			{
				socket.emit('off', "11");
			};

			//Code for Fan on
			function fanOn()
			{
				socket.emit('on', "12");

			};

			//Code for Fan off
			function fanOff()
			{
				socket.emit('off', "12");
			};

			//Code for Heater On
			function heaterOn()
			{
				socket.emit('on', '13');

			};

			//Code for Heater Off
			function heaterOff()
			{
				socket.emit('off', '13');
			};

			//Code for Tv on
			function tvOn()
			{
				socket.emit('on', '15');
			};

			//Code for Tv off
			function tvOff()
			{
				socket.emit('off', '15');

			};

			//Code for Microwave On
			function microwaveOn()
			{
				socket.emit('on', '16');
			};

			//Code for Microwave Off

			function microwaveOff()
			{
				socket.emit('off', '16');
			}
		};


	    // Listen for errors
	    recognizer.onerror = function(event) {
	        transcription.innerHTML = 'Recognition error: ' + event.message;
		$('.sound-button').removeClass('listening');
		$('.sound-button-container').removeClass('listening');
	    };

	    $('.sound-button').on('click', function() {
	        // Set if we need interim results
	        //recognizer.interimResults = document.querySelector('input[name="recognition-type"][value="interim"]').checked;

	        try {
	    		recognizer.start();
	           	transcription.innerHTML = 'Listening...';
	           	$('.sound-button').addClass('listening');
	           	$('.sound-button-container').addClass('listening');
	        } catch(ex) {
	            transcription.innerHTML = 'Recognition error: ' + ex.message;
	        }
	    });

	    // document.getElementById('button-stop-ws').addEventListener('click', function() {
	    //    recognizer.stop();
	    //   log.innerHTML = 'Recognition stopped' + '<br />' + log.innerHTML;
	    // });

	   /* document.getElementById('clear-all').addEventListener('click', function() {
	        transcription.textContent = '';
	        log.textContent = '';
	    });*/
	
    }
});
