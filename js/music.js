// ========== HEADLESS AUTO-PLAY AMBIENT JAZZ ==========
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.createElement('audio');
    audio.id = 'ambientAudio';
    audio.src = 'js/Before_the_City_Wakes.mp3';
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.3; // 30% ambient volume
    document.body.appendChild(audio);

    const startAudio = () => {
        audio.play().then(() => {
            window.removeEventListener('click', startAudio);
            window.removeEventListener('keydown', startAudio);
        }).catch(err => {
            // Waiting for user gesture
        });
    };

    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('keydown', startAudio, { once: true });
});
