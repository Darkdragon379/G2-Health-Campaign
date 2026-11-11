// ========== HEADLESS AUTO-PLAY AMBIENT JAZZ ==========
document.addEventListener('DOMContentLoaded', function() {
    // Create a hidden audio element in the DOM
    const audio = document.createElement('audio');
    audio.id = 'ambientAudio';
    audio.src = 'js/Before_the_City_Wakes.mp3';
    audio.loop = true;
    audio.preload = 'auto';
    
    // Set background music volume (0.0 to 1.0 -> 0.3 is 30% volume)
    audio.volume = 0.3; 

    document.body.appendChild(audio);

    // Function to attempt playback
    const startAudio = () => {
        audio.play().then(() => {
            // Once playback succeeds, remove the listeners so it only runs once
            window.removeEventListener('click', startAudio);
            window.removeEventListener('keydown', startAudio);
            console.log("Background audio started successfully.");
        }).catch(err => {
            console.log("Waiting for user interaction to unlock audio...");
        });
    };

    // Listen for the very first user interaction anywhere on the page
    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('keydown', startAudio, { once: true });
});
