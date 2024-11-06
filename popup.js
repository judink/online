window.onload = function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');

    const assets = {
        background: ['bg1.png', 'bg2.png', 'bg3.png','bg4.png', 'bg5.png', 'bg6.png', 'bg7.png', 'bg8.png', 'bg9.png','bg10.png', 'bg11.png', 'bg12.png', 'bg13.png', 'bg14.png', 'bg15.png', 'bg16.png', 'bg17.png', 'bg18.png', 'bg19.png', 'bg20.png'],
        deco: ['none.png','deco1.png','deco2.png','deco3.png','deco4.png','deco5.png','deco6.png','deco7.png','deco8.png','deco9.png','deco10.png', 'deco11.png', 'deco12.png'],
        aura: ['none.png','yellow.png','green.png', 'pink.png', 'white.png','angel.png','devil.png','cutie.png'],
        character: ['body0.png','body1.png', 'body2.png', 'body3.png', 'body4.png', 'body5.png', 'body6.png', 'body7.png', 'body8.png', 'body9.png', 'body10.png'],
    };

    let currentAvatar = {
        background: assets.background[0],
        deco: assets.deco[0],
        aura: assets.aura[0],
        character: assets.character[0],

    };

    function loadImage(category, src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = `./img/${category}/${src}`;
            img.onload = () => resolve(img);
        });
    }

    async function drawAvatar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const layer in currentAvatar) {
            const img = await loadImage(layer, currentAvatar[layer]);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }

    function initOptions() {
        for (const category in assets) {
            const container = document.querySelector(`#${category} .options`);
            assets[category].forEach(item => {
                const img = document.createElement('img');
                img.src = `./img/${category}/${item}`;
                img.onclick = () => {
                    document.querySelectorAll(`#${category} .options img`).forEach(img => img.classList.remove('selected'));
                    img.classList.add('selected');
                    currentAvatar[category] = item;
                    drawAvatar().then(r => "");
                };
                container.appendChild(img);
            });
        }
    }

    document.getElementById('randomize').addEventListener('click', () => {
        for (const category in assets) {
            const items = assets[category];
            currentAvatar[category] = items[Math.floor(Math.random() * items.length)];
        }
        drawAvatar();
    });

    document.getElementById('download').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'avatar.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    document.getElementById('tweet').addEventListener('click', () => {
        const tweetText = encodeURIComponent("I'm online now!");
        const tweetUrl = `https://twitter.com/intent/tweet?text=Hello%20I'm%20%24Online%20now!`;
        window.open(tweetUrl, '_blank');
    });
    document.getElementsByClassName('x')[0].addEventListener('click', () => {
        let popup = document.querySelector(".popup_window");
        popup.style.display = "none";
    });
    document.getElementsByClassName('x')[1].addEventListener('click', () => {
        let popup = document.querySelector(".popup_window");
        popup.style.display = "none";
    });
    document.getElementsByClassName('popup_btn')[0].addEventListener('click', () => {
        let popup = document.querySelector(".popup_window");
        popup.style.display = "flex";
    });

    initOptions();
    drawAvatar();
};