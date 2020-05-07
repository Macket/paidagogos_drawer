var mousePressed = false;
var lastX, lastY;
var canvas;
var ctx;
var color = 'red';
var width = 3;
var textarea = null;
var rotationCounter = 0;

function InitThis() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext("2d");

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });

    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });

    $('.dot').on('click', function(e) {
        $("button[name=" + color + "]" ).css({'width': '35px', 'height': '35px'});
        $("button[name=" + e.target.name + "]" ).css({'width': '50px', 'height': '50px'});
        color = e.target.name;
        if (textarea) {
            textarea.style.color = color;
        }
        $('#drawer-demo').css({'background-color': color});
    });

    var textareaIcon = document.getElementById('textareaIcon');
    textareaIcon.addEventListener('click', function(e) {
        if (!textarea) {
            textarea = document.createElement('textarea');
            textarea.className = 'textarea';
            textarea.addEventListener('mousedown', mouseDownOnTextArea);
            document.getElementById('myCanvasContainer').appendChild(textarea);
        }
        textarea.placeholder = 'Напишите здесь';
        textarea.style.top = '50%';
        textarea.style.left = '50%';
        textarea.style.color = color;
        textarea.style.fontSize = '24px';
        textarea.style.fontWeight = 'bold';
        textarea.style.cursor = 'grab';
    }, false);
}

function onSlide(value) {
    width = value;
    $('#drawer-demo').css({'height': String(value) + 'px'});
}


function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if ($('#selColor').val() === "rgba(255,255,255,0)") {
            ctx.globalCompositeOperation = "destination-out";
        }
        ctx.lineJoin = "round";
        ctx.moveTo(lastX + 12, lastY + 40);
        ctx.lineTo(x + 12, y + 40);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function putImage() {
    if (textarea) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = color;
        var textX = textarea.offsetLeft - (document.body.clientWidth - 1050) + 2;
        var textY = textarea.offsetTop + 18;
        ctx.fillText(textarea.value, textX, textY);
    }

    var data = {
        imgBase64: canvas.toDataURL('image/jpeg', 0.5),
        chat_id: document.getElementById('chatId').innerHTML,
    };
    if  (document.getElementById('messageId')) {
        data['message_id'] = document.getElementById('messageId').innerHTML
    }
    if (document.getElementById('submissionId')) {
        data['submission_id'] = document.getElementById('submissionId').innerHTML;
    }
    $.ajax({
      type: "POST",
      url: "/drawer/",
      data: data
    }).done(function(o) {
      console.log('saved');
    });
}


function mouseDownOnTextArea(e) {
    var x = textarea.offsetLeft - e.clientX,
        y = textarea.offsetTop - e.clientY;
    function drag(e) {
        textarea.style.left = e.clientX + x + 'px';
        textarea.style.top = e.clientY + y + 'px';
    }
    function stopDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function rotate() {
    clearArea();
    rotationCounter += 1;
    ctx.translate(500, 500);
    ctx.rotate(-rotationCounter * Math.PI / 2);
    ctx.translate(-500, -500);
    var imageObj = new Image();
    var imageBytes = document.getElementById('imageBytes').innerHTML;
	imageObj.src = 'data:image/png;base64,' + imageBytes;
    imageObj.onload = function() {
    	fitImageOn(canvas, ctx, imageObj)
    };
}