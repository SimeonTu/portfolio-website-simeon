let snowflakes__piece = document.getElementsByClassName('snowflake__piece')
let snowflakes = document.getElementsByClassName('snowflake')
for (let i = 0; i < snowflakes.length; i++) {
    snowflakes__piece[i].style.width = Math.floor(Math.random() * (26 - 15) + 15) + "px";
    do {
        snowflakes[i].style.zIndex = Math.floor(Math.random() * (2 - (-1)) + (-1));
    } while (snowflakes[i].style.zIndex == 0);
}