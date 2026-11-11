// ========== AMBIENT ACOUSTIC JAZZ PLAYER MODULE ==========
document.addEventListener('DOMContentLoaded', function() {
    // Create the container element dynamically
    const playerDiv = document.createElement('div');
    playerDiv.id = 'ambient-player-container';
    playerDiv.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000; background: rgba(25, 25, 35, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 30px; padding: 10px 18px; display: flex; align-items: center; gap: 12px; color: #fff; font-family: inherit; font-size: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);';

    playerDiv.innerHTML = `
        <span style="display: flex; align-items: center; gap: 6px;">🎷 <strong>Velvet Hours</strong></span>
        <button id="musicToggleBtn" style="background: #4f46e5; border: none; color: white; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-weight: bold; transition: background 0.2s;">Play</button>
        <audio id="ambientAudio" preload="auto" loop>
            <source src="js/Before_the_City_Wakes.mp3" type="audio/mpeg">
        </audio>
    `;

    document.body.appendChild(playerDiv);

    const btn = document.getElementById('musicToggleBtn');
    const audio = document.getElementById('ambientAudio');

    // Attach click handler directly to avoid inline scope issues
    btn.addEventListener('click', function() {
        toggleMusic(audio, btn);
    });
});

function toggleMusic(audio, btn) {
    if (!audio) return;

    if (audio.paused) {
        // Explicit user gesture triggers play
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                btn.textContent = "Pause";
                btn.style.background = "#ef4444";
            }).catch(err => {
                console.log("Browser policy blocked audio:", err);
            });
        }
    } else {
        audio.pause();
        btn.textContent = "Play";
        btn.style.background = "#4f46e5";
    }
}
