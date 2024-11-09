
const {  doc, getDoc } = FM.storage
const socket = io('https://moniomok.xyz:3001'); // 수정예정

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
var strbp = ""
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
strb = strbadd("Tg: https://t.me/GenesisofOnlineTerminal", strb);
strb = strbadd("X: https://x.com/OnlineTerminal_", strb);
strb = strbadd(" ", strb);

strb = strbadd("--Press any key to start--", strb);
strbp = strb;
strbp = strbadd('▊', strb);
var lc = "";
const ca ="0xb30AafA433Eae7dF766F6612ab2a070C526F23C3";
const tg = "https://t.me/GenesisofOnlineTerminal";
const x = "https://x.com/OnlineTerminal_";

// 서버에서 초기 메시지 수신
socket.on('init messages', (messages) => {
  console.log("Initial messages received: ", messages);

  messages.forEach((msg) => {
      if(msg.startsWith("result")){//기능일때
          strb = strbadd("ㄴ"+msg, strb); // 메시지에 unknown command 추가
      }
      else{
          strb = strbadd(`online command: "${msg}"`, strb); // 메시지에 unknown command 추가
      }
  });
  draw();
});

// 서버에서 메시지 수신 시 즉시 그리기
socket.on('chat message', (msg) => {
    console.log("New message received: ", msg);
    if(msg.startsWith("result")){//기능일때

        strb = strbadd("ㄴ"+msg, strb); // 메시지에 unknown command 추가
    }
    else{ // 기능이 아닐때
        strb = strbadd(`online command: "${msg}"`, strb); // 메시지에 unknown command 추가
    }
    strbp = strb;
    strbp = strbadd('▊', strb);

    draw();

});

let textCheck = function() {
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

$("#ghost").keyup(async function (e) {
    if (e.keyCode == 13) {
        const message = $("#ghost").val();
        if (message !== "") {
            socket.emit('chat message', message);
            if (message.startsWith("/")) {
                if (message.startsWith("/filter")) {
                    const result = message.split(' ');
                    if (result.length >= 3) {

                        const func_result = addOrUpdateFilter(result[1], result[2]);
                        socket.emit('chat message', "result: " + func_result);
                    }
                } else if (message.startsWith("/filters")) {
                    const func_result = await getFilterStr();
                    socket.emit('chat message', "result:\n" + func_result);

                } else if (message.startsWith("/Delete_filter")) {
                    const result = message.split(' ');
                    if (result.length >= 3) {
                        const func_result = deleteFilter(result[1])
                        if (func_result != null) {
                            socket.emit('chat message', "result: filter deleted: " + result[1]);
                        } else {
                            socket.emit('chat message', "result: There is no filter like: " + result[1]);
                        }
                    }
                } else {
                    const filterName = message.slice(1); // Extract filter name (e.g., "/exampleFilter" -> "exampleFilter")
                    // Try to find the corresponding filter from Firestore
                    const filters = await getFilters(); // Get all filters

                    // Check if there is a filter with the matching trigger
                    const filter = filters.find(filter => filter.trigger === filterName);
                    if (filter) {
                        // If the filter exists, send the response back
                        socket.emit('chat message', "result: " + filter.response+"\n" +
                            "Anyone can register this filter, so do not trust the contents.\n" +
                            "The official ca,x,tg link will appear if you just enter it without a slash.");
                    }
                }

            } else if (message === "ca") {
                socket.emit('chat message', "result: " + ca);
            } else if (message === "x") {
                socket.emit('chat message', "result: " + x);
            } else if (message === "tg") {
                socket.emit('chat message', "result: " + tg);
            }else if (message.toLowerCase() === "make pfp") {
                let popup = document.querySelector(".popup_window");
                popup.style.display = "flex";
            }

            $("#ghost").val(""); // 입력란 초기화
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


let draw = function() {

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

let generateMapping = function() {
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
async function addOrUpdateFilter(trigger, response) {
    try {
        // getFilters 함수를 사용해 모든 필터를 가져옵니다.
        const filters = await getFilters();

        // trigger가 일치하는 필터가 있는지 확인합니다.
        const existingFilter = filters.find(filter => filter.trigger === trigger);

        if (existingFilter) {
            // 기존 필터가 있을 경우, 업데이트
            await updateDoc(doc(db, "filters", existingFilter.id), { response });
            return "Filter updated: " + trigger+"=>"+response;
        } else {
            // 기존 필터가 없을 경우, 새 필터 추가
            const docRef = await addDoc(collection(db, "filters"), { trigger, response });
            return "Filter added: " + trigger+"=>"+response;
        }
    } catch (e) {
        console.error("Error adding or updating filter: ", e);
        return "Error handling filter: " + trigger;
    }
}

async function getFilterStr() {
    let result = "";
    const querySnapshot = await getDocs(collection(db, "filters"));

    querySnapshot.forEach((doc) => {
        result += doc.id+" => "+doc.data()+"\n";
    });
    return result;
}
async function getFilters() {
    let filters = [];
    const querySnapshot = await getDocs(collection(db, "filters"));

    querySnapshot.forEach((doc) => {
        filters.push({ id: doc.id, ...doc.data() });
    });
    return filters;
}
async function deleteFilter(filterId) {
    const filterRef = doc(db, "filters", filterId);
    // 문서가 존재하는지 확인
    const filterSnap = await getDoc(filterRef);
    if (filterSnap.exists()) {
        // 문서가 존재하면 삭제
        await deleteDoc(filterRef);
        return  filterId;
    } else {
        // 문서가 없으면 경고 메시지 출력
       return null;
    }
}
let settings = {
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


