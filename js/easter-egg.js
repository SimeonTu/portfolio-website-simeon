document.addEventListener("DOMContentLoaded", () => {

    if (typeof confetti !== 'function') {
        console.error("Confetti library is not loaded. Please check the script tag in your HTML.");
    }

    // Check if the current page is index.html
    const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");

    // Variables
    const container = document.querySelector(".container"); // The draggable container
    const startButton = document.getElementById("start"); // The Start button
    const secretFolder = document.getElementById("secret-folder"); // The "Top Secret" folder
    const scrollerEgg = document.getElementById("scroller-egg"); // The scroller egg

    // Create the Start menu div and hide initially
    const startMenuDiv = document.createElement("div");
    startMenuDiv.classList.add("start-menu-egg");
    startMenuDiv.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)"; // Drop shadow
    startMenuDiv.style.display = "none"; // Start hidden
    document.body.appendChild(startMenuDiv); // Append the div to the body once

    const scoreAudio = new Audio("sounds/coin.mp3");
    const celebrationAudio = new Audio("sounds/horn.mp3");
    const clickAudio = new Audio("sounds/click.mp3");
    scoreAudio.volume = 0.5;
    celebrationAudio.volume = 0.05;
    clickAudio.volume = 0.1;

    // Load saved progress from localStorage
    let celebrationPlayed = localStorage.getItem("celebrationPlayed") === "true" || false;
    let eggFound = localStorage.getItem("eggFound") === "true" || false;
    let startEggFound = localStorage.getItem("startEggFound") === "true" || false;
    let secretEggFound = localStorage.getItem("secretEggFound") === "true" || false;
    let scrollerEggFound = localStorage.getItem("scrollerEggFound") === "true" || false;
    let eggCount = parseInt(localStorage.getItem("eggCount")) || 0; // Track the number of eggs found
    const maxEggs = document.body.clientWidth >= 1550 ? 4 : 3; // Maximum number of eggs

    // Get the initial position of the container
    const initialRect = container.getBoundingClientRect();
    const initialTop = initialRect.top;
    const initialLeft = initialRect.left;

    // Create the scoreboard
    const scoreboard = document.createElement("div");
    scoreboard.classList.add("scoreboard"); // Add the CSS class
    updateScoreboard(); // Initialize the scoreboard
    document.body.appendChild(scoreboard);

    // Function to update the scoreboard
    function updateScoreboard(message) {
        // Flash the scoreboard text green when a new egg is found
        if (!message) {
            scoreboard.style.transition = "color 0.5s ease";
            scoreboard.style.color = "pink";
            setTimeout(() => {
                scoreboard.style.color = ""; // Revert to original color
            }, 500); // Duration of the flash
        }

        scoreboard.textContent = `Easter Eggs Found: ${eggCount}/${maxEggs}`;

        // Show the scoreboard only if at least one egg has been found
        if (eggCount > 0) {
            scoreboard.classList.add("visible"); // Show the scoreboard with animation
        } else {
            scoreboard.classList.remove("visible"); // Hide the scoreboard
        }

        // Add a "Reset" button if all eggs are found
        if (eggCount === maxEggs) {
            const resetButton = document.createElement("button");
            resetButton.classList.add("main-button");
            resetButton.style.marginTop = "5px";
            resetButton.style.height = "auto";
            resetButton.textContent = "Reset";
            resetButton.addEventListener("click", resetProgress);
            scoreboard.appendChild(resetButton);

            if (!celebrationPlayed) {
                // Mark celebration as played
                celebrationPlayed = true;
                localStorage.setItem("celebrationPlayed", "true");

                // Play celebration sound
                celebrationAudio.play();

                // Debug: Check if confetti is defined
                if (typeof confetti !== 'function') {
                    console.error("Confetti is not defined. Library may not be loaded.");
                    return;
                }

                // Confetti settings
                const duration = 5 * 1000; // 5 seconds
                const delayBetweenConfetti = 200; // 200ms delay between each confetti launch
                const end = Date.now() + duration;

                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min;
                }

                // Function to launch confetti with a delay
                function launchConfetti() {
                    if (Date.now() < end) {
                        confetti({
                            scalar: 1.5,
                            spread: randomInRange(130, 180),
                            particleCount: randomInRange(20, 40),
                            origin: { y: -0.1 },
                            startVelocity: -35,
                            zIndex: 9999
                        });

                        // Schedule the next confetti launch
                        setTimeout(launchConfetti, delayBetweenConfetti);
                    }
                }

                // Start the confetti
                launchConfetti();
            }
        }

        // Display a message if provided
        if (message) {
            const messageDiv = document.createElement("div");
            messageDiv.textContent = message;
            // messageDiv.style.color = "red";
            messageDiv.style.marginTop = "5px";
            scoreboard.appendChild(messageDiv);

            // Remove the message after 3 seconds
            setTimeout(() => {
                if (scoreboard.contains(messageDiv)) {
                    scoreboard.removeChild(messageDiv);
                }
            }, 3000);
        }
    }

    // Function to reset progress
    function resetProgress() {
        // Clear localStorage
        localStorage.removeItem("eggFound");
        localStorage.removeItem("startEggFound");
        localStorage.removeItem("secretEggFound");
        localStorage.removeItem("scrollerEggFound");
        localStorage.removeItem("eggCount");
        localStorage.removeItem("celebrationPlayed"); // Clear celebration flag

        // Reload the page to reset the state
        window.location.reload();
    }

    // Function to save progress to localStorage
    function saveProgress() {
        localStorage.setItem("eggFound", eggFound);
        localStorage.setItem("startEggFound", startEggFound);
        localStorage.setItem("secretEggFound", secretEggFound);
        localStorage.setItem("scrollerEggFound", scrollerEggFound);
        localStorage.setItem("eggCount", eggCount);
    }

    // Function to check container position
    const checkEggPosition = () => {
        if (eggFound) return; // Stop checking once the condition is met

        const rect = container.getBoundingClientRect();
        const currentTop = rect.top;
        const currentLeft = rect.left;

        // Check if conditions are met
        if (
            currentTop >= 285 ||
            currentLeft <= initialLeft - 265 ||
            currentLeft >= initialLeft + 265
        ) {
            eggFound = true; // Mark the egg as found
            eggCount++; // Increment the egg count

            // Play the sound
            scoreAudio.play();

            // Update the scoreboard
            updateScoreboard();

            // Save progress
            saveProgress();
        }
    };

    // Function to handle Start button click
    startButton.addEventListener("click", () => {
        clickAudio.play();

        // Toggle the Start menu div visibility
        if (startMenuDiv.style.display === "none") {
            startMenuDiv.style.display = "block";

            // Add the Start menu image if it doesn't already exist
            if (!startMenuDiv.querySelector("img")) {
                const startMenuImage = document.createElement("img");
                startMenuImage.src = "img/win95-start-menu-egg.png"; // Path to the egg image
                startMenuImage.classList.add("start-menu-egg"); // Add the CSS class
                startMenuImage.style.display = "block";
                startMenuImage.style.height = "auto";
                startMenuDiv.appendChild(startMenuImage);
            }

            // Add the Start menu egg trigger if it doesn't already exist
            if (!startMenuDiv.querySelector(".start-menu-egg-trigger")) {
                const startMenuEggTrigger = document.createElement("div");
                startMenuEggTrigger.classList.add("start-menu-egg-trigger");
                startMenuEggTrigger.style.position = "absolute";
                startMenuEggTrigger.style.bottom = "49px";
                startMenuEggTrigger.style.right = "-42px";
                startMenuEggTrigger.style.width = "161px";
                startMenuEggTrigger.style.height = "40px";
                startMenuEggTrigger.style.cursor = "pointer";
                // startMenuEggTrigger.style.border = "1px solid red"; // Debugging border
                startMenuEggTrigger.style.zIndex = "20";
                startMenuEggTrigger.addEventListener("click", () => {
                    clickAudio.play();

                    if (!startEggFound) {
                        startEggFound = true; // Mark the Start button egg as found
                        eggCount++; // Increment the egg count

                        // Play the sound
                        scoreAudio.play();

                        // Update the scoreboard
                        updateScoreboard();

                        // Save progress
                        saveProgress();
                    } else {
                        updateScoreboard("You've already found this easter egg!");
                    }
                });
                startMenuDiv.appendChild(startMenuEggTrigger);
            }
        } else {
            startMenuDiv.style.display = "none";
        }
    });

    // Function to handle "Top Secret" folder click
    if (secretFolder) {
        secretFolder.addEventListener("click", () => {
            // Play the click sound
            clickAudio.play();

            // Create the fake folder window
            const folderWindow = document.createElement("div");
            folderWindow.classList.add("folder-window");
            folderWindow.style.position = "fixed";
            folderWindow.style.top = "50%";
            folderWindow.style.left = "50%";
            folderWindow.style.transform = "translate(-50%, -50%)";
            folderWindow.style.zIndex = "1000";
            folderWindow.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)"; // Drop shadow

            // Add the folder image
            const folderImage = document.createElement("img");
            folderImage.src = "img/opened-folder-egg-1-5x.png"; // Path to the opened folder image
            folderImage.style.display = "block";
            folderImage.style.height = "auto";
            folderWindow.appendChild(folderImage);

            // Add the invisible click trigger for the egg 
            const eggTrigger = document.createElement("div");
            eggTrigger.style.position = "absolute";
            eggTrigger.style.bottom = "150px"; //
            eggTrigger.style.right = "118px"; //
            eggTrigger.style.width = "110px"; // 
            eggTrigger.style.height = "90px"; //
            eggTrigger.style.cursor = "pointer";
            eggTrigger.addEventListener("click", () => {
                clickAudio.play();

                if (!secretEggFound) {
                    secretEggFound = true; // Mark the egg as found
                    eggCount++; // Increment the egg count

                    // Play the sound
                    scoreAudio.play();

                    // Update the scoreboard
                    updateScoreboard();

                    // Save progress
                    saveProgress();
                } else {
                    updateScoreboard("You've already found this easter egg!");
                }
            });
            folderWindow.appendChild(eggTrigger);

            // Add the invisible close trigger (top right corner)
            const closeTrigger = document.createElement("div");
            closeTrigger.style.position = "absolute";
            closeTrigger.style.top = "9px";
            closeTrigger.style.right = "11px";
            closeTrigger.style.width = "22px";
            closeTrigger.style.height = "22px";
            closeTrigger.style.cursor = "pointer";
            closeTrigger.addEventListener("click", () => {
                clickAudio.play();
                document.body.removeChild(folderWindow); // Close the folder window
            });
            folderWindow.appendChild(closeTrigger);

            // Append the folder window to the body
            document.body.appendChild(folderWindow);
        });
    }

    // Function to handle scroller egg click
    if (scrollerEgg) {
        scrollerEgg.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent event from bubbling up
            console.log("Scroller Egg Clicked!"); // Debugging
            clickAudio.play();

            if (!scrollerEggFound) {
                scrollerEggFound = true; // Mark the Start button egg as found
                eggCount++; // Increment the egg count

                // Play the sound
                scoreAudio.play();

                // Update the scoreboard
                updateScoreboard();

                // Save progress
                saveProgress();
            } else {
                updateScoreboard("You've already found this easter egg!");
            }
        });
    }

    // Enable egg position check only during drag
    let isDragging = false;
    let intervalId;

    if (!isIndexPage) {
        $(function () {
            $(".draggable").draggable({
                stack: ".draggable", handle: ".drag-handle", containment: "window",
                start: function () {
                    $(".draggable").css("transform", "translate(0,0)");
                }
            });
        });
    } else {
        $(container).draggable({
            stack: ".draggable",
            handle: ".drag-handle",
            containment: "window",
            start: function () {
                $(".draggable").css("transform", "translate(0,0)");
                isDragging = true; // Set dragging state to true
                intervalId = setInterval(checkEggPosition, 100); // Start checking egg position
            },
            stop: function () {
                isDragging = false; // Set dragging state to false
                clearInterval(intervalId); // Stop checking egg position
            },
        });
    }
});