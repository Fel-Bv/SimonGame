// Get DOM elements
const $round_img = document.getElementById('round-img');
const $start_btn = document.querySelector('.start-btn');
const $circles = document.querySelectorAll('.circle');
const $timer = document.querySelector('.timer');
const $round = document.querySelector('.round');
const $flash = document.querySelector('.flash');

// Game timer seconds
const game_time = 60;

// Boolean variable to set game started, this avoids the user to reset the timer
var game_started = false;

// Buttons to be pressed, at the first round: 4
var pressed_buttons = 4;

var user_pressed_buttons;
var random_buttons;

var buttons_press_interval_ID;
var timer_interval_ID;

let button_idx = 0;

var timer = 0;
var round = 0;

function setRightImage() {
    setTimeout(() => {
        $round_img.classList.toggle('show');
        $round_img.src = '';
    }, 500);
    $round_img.classList.toggle('show');
    $round_img.src = '/static/img/right.png';
}

function setWrongImage() {
    setTimeout(() => {
        $round_img.classList.toggle('show');
        $round_img.src = '';
    }, 500);
    $round_img.classList.toggle('show');
    $round_img.src = '/static/img/wrong.png';
}

function setCirclesClickable() {
    $circles.forEach(($circle) => {
        $circle.classList.remove('non-clickable');
    }); 
}

function setCirclesNonClickable() {
    $circles.forEach(($circle) => {
        $circle.classList.add('non-clickable');
    }); 
}

function changeFlashColor() {
    // Turn flash color to red or green
    if ($flash.classList.contains('red')) {
        $flash.classList.replace('red', 'green');
    } else {
        $flash.classList.replace('green', 'red');
    }
}

function setTimer() {
    $timer.innerHTML = -- timer;
    // Set timer text format 2 digits
    $timer.innerHTML = $timer.innerHTML.length === 1?
        '0' + $timer.innerHTML:
        $timer.innerHTML;

    // If timer gets zero, then the game has finished
    if (timer === 0) {
        finishGame();
    }
}

function finishGame() {
    clearInterval(timer_interval_ID);
    setCirclesNonClickable();
    changeFlashColor();
    game_started = false;
}

function getRandomButtons() {
    let buttons = [];

    for (let i = 0; i < pressed_buttons; i++) {
        buttons.push(Math.floor(Math.random() * 4));
    }

    return buttons;
}

function clickButtons(buttons) {
    if (timer === 0) {
        clearInterval(buttons_press_interval_ID);
        button_idx = 0;

        return;
    }

    let $button = $circles[buttons[button_idx]];
    // Animates the button to indicate which has been pressed
    setTimeout(() => {
        $button.classList.remove('clicked');
    }, 400);
    $button.classList.add('clicked');

    // Increases the button index to use the next 
    // button from the random buttons list
    button_idx ++;

    if (button_idx == pressed_buttons) {
        clearInterval(buttons_press_interval_ID);
        button_idx = 0;

        // Allows user to press the buttons
        setCirclesClickable();
    }
}

function circlesClickEventListener(event) {
    // Get the element that has been clicked
    let $target = event.target;

    // If the element clicked is a circle, save its ID number
    // as user pressed button
    if ($target.classList.contains('circle')) {
        user_pressed_buttons.push(Number($target.id.replace('circle-', '')) - 1);
        // If the user has pressed the quantity of buttons 
        // to be pressed, then finish round
        if (user_pressed_buttons.length === pressed_buttons) {
            document.removeEventListener('click', circlesClickEventListener);
            finishRound();
        }
    }
}

function nextRound() {
    // Increases round counter
    round ++;
    $round.innerHTML = round;

    setCirclesNonClickable();

    // Press buttons in random order
    random_buttons = getRandomButtons();
    buttons_press_interval_ID = setInterval(() => clickButtons(random_buttons), 500);

    // Get user input
    user_pressed_buttons = [];
    document.addEventListener('click', circlesClickEventListener);
}

function finishRound() {
    // Calculates if the user has pressed the same buttons as
    // the random buttons generated at the beginning of the round
    let same_buttons = true;
    for (let i = 0; i < pressed_buttons; i++) {
        if (user_pressed_buttons[i] !== random_buttons[i]) {
            same_buttons = false;
            break;
        }
    }

    // If the buttons pressed by the user are not the same
    // as the random buttons generated, then it does not 
    // increases the round
    if (same_buttons === false) {
        setWrongImage();
        round --;
    } else {
        setRightImage();
    }

    user_pressed_buttons = [];
    random_buttons = [];

    // Increases the quantity of buttons to be pressed
    pressed_buttons ++;

    // If the game time is not 0, then do the next round
    if (timer > 0) {
        setTimeout(nextRound, 500);
    }
}

$start_btn.addEventListener('click', () => {
    if (game_started) return;
    game_started = true;

    setCirclesClickable();
    changeFlashColor();

    timer = game_time;
    $timer.innerHTML = game_time;
    timer_interval_ID = setInterval(setTimer, 1000);

    nextRound();
});
