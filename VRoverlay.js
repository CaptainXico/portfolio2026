// VRoverlay.js - Creates an instruction overlay for VR headsets

document.addEventListener('DOMContentLoaded', function() {
    let vrOverlay = null;

    function createVROverlay() {
        // Don't create if already exists
        if (vrOverlay) {
            return;
        }

        // Create overlay container
        vrOverlay = document.createElement('div');
        vrOverlay.id = 'vr-instructions-overlay';
        vrOverlay.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 15px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            z-index: 2000;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(0, 255, 255, 0.4);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
            transform: translateZ(0);
            will-change: transform;
        `;

        // Create instruction content
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            <div style="margin-bottom: 12px; font-weight: bold; color: #00ffff; font-size: 18px;">VR Controls:</div>
            <div style="margin-bottom: 8px;">🎮 <strong>X / A</strong> - Jump</div>
            <div style="margin-bottom: 8px;">🕹️ <strong>Left Thumbstick</strong> - Move</div>
            <div style="margin-bottom: 8px;">🔄 <strong>Right Thumbstick</strong> - Rotate</div>
        `;
        instructions.style.cssText = `
            line-height: 1.6;
        `;

        // Add instructions to overlay
        vrOverlay.appendChild(instructions);

        // Add to body
        document.body.appendChild(vrOverlay);

        // Auto-fade behavior for VR
        let fadeTimeout;
        
        function showOverlay() {
            if (vrOverlay) {
                vrOverlay.style.opacity = '1';
                clearTimeout(fadeTimeout);
                fadeTimeout = setTimeout(() => {
                    if (vrOverlay) {
                        vrOverlay.style.opacity = '0.4';
                    }
                }, 15000); // Longer timeout for VR (15 seconds)
            }
        }

        // Show overlay when VR buttons are pressed
        function handleVRInput() {
            showOverlay();
        }

        // Add keyboard listeners for X/A buttons
        document.addEventListener('keydown', function(e) {
            if (['x', 'a', 'X', 'A'].includes(e.key)) {
                handleVRInput();
            }
        });

        // Listen for controller events
        const leftController = document.querySelector('#left-controller');
        const rightController = document.querySelector('#right-controller');
        
        if (leftController) {
            leftController.addEventListener('thumbstickmoved', handleVRInput);
            leftController.addEventListener('buttondown', handleVRInput);
        }
        
        if (rightController) {
            rightController.addEventListener('thumbstickmoved', handleVRInput);
            rightController.addEventListener('buttondown', handleVRInput);
        }

        // Initial display
        showOverlay();
    }

    function removeVROverlay() {
        if (vrOverlay) {
            vrOverlay.remove();
            vrOverlay = null;
        }
    }

    // Wait for A-Frame scene to be ready
    function setupVRListeners() {
        const scene = document.querySelector('a-scene');
        if (!scene) {
            setTimeout(setupVRListeners, 100);
            return;
        }

        // Listen for VR mode changes
        scene.addEventListener('enter-vr', function() {
            console.log('Entered VR mode - creating VR overlay');
            createVROverlay();
        });
        
        scene.addEventListener('exit-vr', function() {
            console.log('Exited VR mode - removing VR overlay');
            removeVROverlay();
        });

        // Check if already in VR mode
        if (scene.is('vr-mode')) {
            createVROverlay();
        }
    }

    // Setup listeners after a short delay to ensure DOM is ready
    setTimeout(setupVRListeners, 500);
});
