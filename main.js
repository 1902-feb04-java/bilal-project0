'use strict'
window.onload = function() {
let canvas = document.getElementById('workspace');
canvas.width = 800;
canvas.height = 450;
let game = canvas.getContext('2d');
// game.fillStyle = 'FF0000';
// game.fillRect(0, 0, 800, 450); 

    var track = document.getElementById("track");
    var audio = document.getElementById("audio");

    track.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
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

        var barWidth = (trackWidth/bufferLength)*2.5;
        var barHeight;
        var x = 0;

        function renderFrame(){
            requestAnimationFrame(renderFrame);
            x = 0;
            analyser.getByteFrequencyData(dataArray);

            game.fillStyle = "#000";
            game.fillRect(0, 0, trackWidth, trackHeight);

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
        audio.play();
        renderFrame();
    }   
};
