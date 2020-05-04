var mousePressed = false;
var lastX, lastY;
var canvas;
var ctx;
var color = 'red';
var width = 3;

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
        $("button[name=" + color + "]" ).css({'width': String(30 + width) + 'px', 'height': String(30 + width) + 'px'});
        $("button[name=" + e.target.name + "]" ).css({'width': String(45 + width) + 'px', 'height': String(45 + width) + 'px'});
        color = e.target.name;
    });
}

function onSlide(value) {
    width = value;
    $('.dot').css({'width': String(30 + value) + 'px', 'height': String(30 + value) + 'px'});
    $("button[name=" + color + "]" ).css({'width': String(45 + value) + 'px', 'height': String(45 + value) + 'px'});
}


function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if ($('#selColor').val() === "rgba(255,255,255,0)") {
            console.log($('#selColor').val());
            ctx.globalCompositeOperation = "destination-out";
        }
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
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
