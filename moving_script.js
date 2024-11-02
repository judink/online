// 오른쪽에서 왼쪽으로 움직이는 이미지 함수
function triggerMovingImage() {
    const movingImage = document.getElementById("movingImage");
    movingImage.style.display = "block";
    movingImage.style.animation = "none";

    setTimeout(() => {
        movingImage.style.animation = "";
    }, 10);

    setTimeout(() => {
        movingImage.style.display = "none";
    }, 1000);
}

// 아래에서 위로 튀어나오는 이미지 함수
function triggerPopupImage() {
    const popupImage = document.getElementById("popupImage");
    popupImage.style.display = "block";
    popupImage.style.animation = "none";

    setTimeout(() => {
        popupImage.style.animation = "";
    }, 10);

    setTimeout(() => {
        popupImage.style.display = "none";
    }, 2000);
}

// 첫 번째 이미지를 랜덤한 시간에 이동시키는 함수
function startRandomMovingImage() {
    const randomTime = Math.floor(Math.random() * (30000 - 10000)) + 10000;
    setTimeout(() => {
        triggerMovingImage();
        startRandomMovingImage();
    }, randomTime);
}

// 두 번째 이미지를 랜덤한 시간에 튀어나오게 하는 함수
function startRandomPopupImage() {
    const randomTime = Math.floor(Math.random() * (180000 - 50000)) + 50000;
    setTimeout(() => {
        triggerPopupImage();
        startRandomPopupImage();
    }, randomTime);
}

// 애니메이션 시작
startRandomMovingImage();
startRandomPopupImage();