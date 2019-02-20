'use strict'
window.onload = function() {
    let canvas = document.getElementById("workspace");
    canvas.width = 800;
    canvas.height = 450;
    let game = canvas.getContext("2d");
    game.fillStyle = "FF0000";
    game.fillRect(0, 0, 800, 450); 

    // let palette = document.getElementById("palette");
    


    let mode1 = document.getElementById("mode1");
    let mode2 = document.getElementById("mode2");
    let mode3 = document.getElementById("mode3");


    var track = document.getElementById("track");
    var audio = document.getElementById("audio");

    // palette.addEventListener('click', () => {
    //     fetch("http://colormind.io/api/")
    //         // .then(data => {
    //         //     colours = foundPalette;
    //         // })
    //         .catch(err=> {
    //             console.log(err)
    //         });
    // // });

    // function newPalette(onSuccess,onFailure = console.log){
    //     let request = new XMLHttpRequest();

    //     request.addEventListener("readystatechange",() => {
    //         console.log(`readyState: ${request.readyState}`);
    //         if (request.readyState === 4){
    //             let response = request.response;
    //             console.log(response);
    //             if (request.status >= 200 && request.status < 300){
    //                 let foundPalette = JSON.parse(response);
    //                 colours = foundPalette;
    //             } else {
    //                 console.log('Failure');
    //             }
    //         }
    //     });

    //     request.open("get", "http://colormind.io/api/");
    //     request.send();
    // }


    track.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        

        audio.load(); //autoload
        // audio.play(); - autoplay
        var context = new AudioContext();
        var source = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        source.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 256;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var trackWidth = canvas.width;
        var trackHeight = canvas.height;

        
        var x = 0;

        var mode = 1;

        mode1.addEventListener("click",() => {
            mode = 1;
        });
        mode2.addEventListener("click",() => {
            mode = 2;
        });
        mode3.addEventListener("click",() => {
            mode = 3;
        });





        function renderMode1(){
            let barWidth = (trackWidth/bufferLength)*2.5;
            let barHeight;
            
            
            for (var i = 0; i < bufferLength; i++){
                barHeight = dataArray[i];
                
                var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;
        
                game.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                game.fillRect(x, trackHeight - barHeight, barWidth, barHeight);
        
                x += barWidth + 1;
            }
        }

        function renderMode2() {
            let barWidth = (trackWidth/bufferLength)*2.5;
            let barHeight;
           
            for (var i = 0; i < bufferLength; i++){
                barHeight = dataArray[i] * .75;
                
                var b = barHeight + (25 * (i/bufferLength));
                var r = 250 * (i/bufferLength);
                var g = 50;
        
                game.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                game.fillRect(x, (trackHeight/2) - barHeight, barWidth, barHeight);
                game.fillRect(x, (trackHeight/2) + barHeight, barWidth, 0 - barHeight);
                x += barWidth + 1;
            }

        }

        function renderMode3() {
            let barWidth = (trackWidth/bufferLength)*2.5;
            let barHeight;
           
            for (var i = 0; i < bufferLength; i++){
                barHeight = dataArray[i] * .5;
                
                var r = 50;
                var g= barHeight + (25 * (i/bufferLength));
                var b = 250 * (i/bufferLength);
        
                game.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                game.fillRect(x, (trackHeight) - barHeight, barWidth, barHeight);
                game.fillRect(x, (trackHeight) - barHeight, barWidth, - barHeight*0.5);
                x += barWidth + 1;
            }


        }


        
        function renderFrame(){ //the rendering of the visualizer
            requestAnimationFrame(renderFrame);
            x = 0;
            analyser.getByteFrequencyData(dataArray);

            game.fillStyle = "#000";
            game.fillRect(0, 0, trackWidth, trackHeight);

            if(mode ===1 ){ //different visualizers
                renderMode1();   
            } else if(mode ===2){
                renderMode2();
            } else if(mode ===3){
                renderMode3();
            }

            
        }
    



        document.body.onkeyup = function(e){ //play and pause functions mapped to keys
            if (e.keyCode == 13){
                audio.play();
                renderFrame();
            }
            if (e.keyCode == 32){
                audio.pause();
            }
            
        }

    }   
};
