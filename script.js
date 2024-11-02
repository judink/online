// Socket.IO 연결 설정
const socket = io('https://moniomok.xyz:3001');

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback){
            window.setTimeout(callback, 1000 / 60);
          };
})();


$("#ghost").focus();
(function($) {
    $.fn.getCursorPosition = function() {
        var input = this.get(0);
        if (!input) return;
        if ('selectionStart' in input) {
            return input.selectionStart;
        } else if (document.selection) {
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }
})(jQuery);

var strbadd = function(str, strb) {
    strb += str;
    for (let i = 0; i < 41 - (str.length % 41); i++) {
        strb += " ";
    }
    if (strb.length > (25 * 41)) {
        strb = strb.slice(strb.length - (25 * 41), strb.length);
    }
    return strb;
};

var strb = "";
strb = strbadd(" ", strb);
strb = strbadd("Genesis of Online Terminal", strb);
strb = strbadd(" ", strb);
strb = strbadd("The first chat terminal that actually works in real time on Ethereum", strb);
strb = strbadd(" ", strb);
strb = strbadd("Be $online", strb);
strb = strbadd(" ", strb);
strb = strbadd("Ethereum is a network", strb);
strb = strbadd("and the network is communication", strb);
strb = strbadd(" ", strb);
strb = strbadd("Connection + community = human.", strb);
strb = strbadd(" ", strb);
strb = strbadd("Ca: 0xb30AafA433Eae7dF766F6612ab2a070C526F23C3", strb);
strb = strbadd(" ", strb);
strb = strbadd("-Press any key to start-", strb);
strbp = strb;
strbp = strbadd('▊', strb);
var lc = "";
let ca ="0xb30AafA433Eae7dF766F6612ab2a070C526F23C3"
// 서버에서 초기 메시지 수신
socket.on('init messages', (messages) => {
  console.log("Initial messages received: ", messages);
  messages.forEach((msg) => {
    strb = strbadd(`online command: "${msg}"`, strb); // 메시지에 unknown command 추가
  });
  draw();
});

// 서버에서 메시지 수신 시 즉시 그리기
socket.on('chat message', (msg) => {
   console.log("New message received: ", msg);
    strb = strbadd(`online command: "${msg}"`, strb); // 메시지에 unknown command 추가
    draw();
    if(msg === "ca"){
        strb = strbadd("result: "+ca, strb); // 메시지에 unknown command 추가
        draw();
        alert(ca);
    }

});

textCheck = function() {
    if (settings.stickfocus) {
        $("#ghost").focus();
    }
    if ($("#ghost").getCursorPosition() != lc) {
        lc = $("#ghost").getCursorPosition();
        strbp = strbadd($("#ghost").val().slice(0, lc) + '▊' + $("#ghost").val().slice(lc, $("#ghost").val().length), strb);
        draw();
    }
};

$(window).on('keydown keyup', function() {
    textCheck();
});

$("#ghost").keyup(function(e) {
    if (e.keyCode == 13) {
        const message = $("#ghost").val();
        if (message !== "") {
            socket.emit('chat message', message); // 입력한 메시지를 서버로 전송

            $("#ghost").val(""); // 입력란 초기화
            draw();

        }
    }
});

// 캔버스 설정 및 그리기 함수
var width = 512;
var height = 512;

var spherize = function(px, py) {
    var x = px - width / 2;
    var y = py - height / 2;
    var r = Math.sqrt(x * x + y * y);
    var maxr = width / settings.maxRadius;
    if (r > maxr) return {
        'x': px,
        'y': py
    };
    var a = Math.atan2(y, x) * settings.atanscale;
    var k = (r / maxr) * (r / maxr) * settings.k + 0.2;
    var dx = Math.cos(a * settings.xscale) * r * k * settings.oxscale;
    var dy = Math.sin(a * settings.yscale) * r * k * settings.oyscale;
    return {
        'x': dx + width / 2,
        'y': dy + height / 2
    };
};

var src = document.getElementById('source');
var dst = document.getElementById('projection');
var input = src.getContext('2d');
var output = dst.getContext('2d');


var draw = function() {
    input.fillRect(0, 0, 512, 512);
    input.font = '20px Monospace';
    input.fillStyle = '#74F9FF';
    input.shadowBlur = 30;
    input.shadowColor = "blue";
    input.shadowOffsetX = 0;
    input.shadowOffsetY = 0;
    for (let i = 0; i < (25 * 41); i += 41) {
        input.fillText(strbp.slice(i, i + 41), 10, ((i + 41) / 41) * 20);
    }

    input.shadowBlur = 0;
    input.shadowColor = "black";
    input.fillStyle = 'black';

    for (var i = 2; i < width; i += 1.5) {
        input.beginPath();
        input.moveTo(i * 2, 2);
        input.lineTo(i * 2, 512);
        input.lineWidth = 0.8;
        input.strokeStyle = 'hsl(0,0%,0%)';
        input.stroke();

        input.beginPath();
        input.moveTo(2, i * 2);
        input.lineTo(512, i * 2);
        input.lineWidth = 0.8;
        input.strokeStyle = 'hsl(0,0%,0%)';
        input.stroke();
    }
    // 그리기 완료 후 매핑
    generateMapping();
};

generateMapping = function() {
    output.fillRect(0, 0, 512, 512);
    var bitmap = input.getImageData(0, 0, 512, 512);
    var texture = input.getImageData(0, 0, 512, 512);
    var map = [];

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var t = spherize(x, y);
            map[(x + y * height) * 2 + 0] = Math.max(Math.min(t.x, width), 0);
            map[(x + y * height) * 2 + 1] = Math.max(Math.min(t.y, height), 0);
        }
    }

    var colorat = function(x, y, channel) {
        return texture.data[(x + y * height) * 4 + channel];
    };

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var u = map[(i + j * height) * 2];
            var v = map[(i + j * height) * 2 + 1];
            var x = Math.floor(u);
            var y = Math.floor(v);
            var kx = u - x;
            var ky = v - y;
            for (var c = 0; c < 4; c++) {
                bitmap.data[(i + j * height) * 4 + c] = (colorat(x, y, c) * (1 - kx) + colorat(x + 1, y, c) * kx) * (1 - ky) +
                    (colorat(x, y + 1, c) * (1 - kx) + colorat(x + 1, y + 1, c) * kx) * (ky);
            }
        }
    }

    output.putImageData(bitmap, 0, 0);
};

settings = {
    maxRadius: 0.561,
    k: 0.115,
    atanscale: 1,
    xscale: 1,
    yscale: 1,
    oxscale: 4.7,
    oyscale: 4.7,
    stickfocus: true,
    applyMapping: function() {
        generateMapping();
    }
};


