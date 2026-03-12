// VRoverlay.js - Creates an instruction overlay for VR headsets

document.addEventListener('DOMContentLoaded', function() {
    // Detect if user is in VR mode
    function isVRMode() {
        // Check if VR is supported and currently active
        return navigator.xr && navigator.xr.isSessionSupported && 
               document.querySelector('a-scene').is('vr-mode');
    }

    // Only create overlay when in VR mode
    if (!isVRMode()) {
        // Listen for VR mode changes
        document.querySelector('a-scene').addEventListener('enter-vr', function() {
            createVROverlay();
        });
        
        document.querySelector('a-scene').addEventListener('exit-vr', function() {
            removeVROverlay();
        });
        
        return;
    }

    function createVROverlay() {
        // Remove existing overlay if any
        removeVROverlay();

        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'vr-instructions-overlay';
        overlay.style.cssText = `
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
        overlay.appendChild(instructions);

        // Add to body
        document.body.appendChild(overlay);

        // VR-specific hover effect using gaze detection
        let gazeTimer;
        
        function startGazeHover() {
            clearTimeout(gazeTimer);
            gazeTimer = setTimeout(() => {
                overlay.style.transform = 'scale(1.05)';
                overlay.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            }, 1000);
        }

        function endGazeHover() {
            clearTimeout(gazeTimer);
            overlay.style.transform = 'scale(1)';
            overlay.style.borderColor = 'rgba(0, 255, 255, 0.4)';
        }

        // Add gaze detection (simplified for VR)
        overlay.addEventListener('mouseenter', startGazeHover);
        overlay.addEventListener('mouseleave', endGazeHover);

        // Auto-fade behavior for VR
        let fadeTimeout;
        
        function showOverlay() {
            overlay.style.opacity = '1';
            clearTimeout(fadeTimeout);
            fadeTimeout = setTimeout(() => {
                overlay.style.opacity = '0.4';
            }, 15000); // Longer timeout for VR (15 seconds)
        }

        // Show overlay when VR buttons are pressed
        document.addEventListener('keydown', function(e) {
            if (['x', 'a', 'X', 'A'].includes(e.key)) {
                showOverlay();
            }
        });

        // Listen for controller events
        function handleControllerEvent() {
            showOverlay();
        }

        // Add controller event listeners if available
        const leftController = document.querySelector('#left-controller');
        const rightController = document.querySelector('#right-controller');
        
        if (leftController) {
            leftController.addEventListener('thumbstickmoved', handleControllerEvent);
            leftController.addEventListener('buttondown', handleControllerEvent);
        }
        
        if (rightController) {
            rightController.addEventListener('thumbstickmoved', handleControllerEvent);
            rightController.addEventListener('buttondown', handleControllerEvent);
        }

        // Initial display
        showOverlay();

        // Handle VR session end
        document.querySelector('a-scene').addEventListener('exit-vr', removeVROverlay);
    }

    function removeVROverlay() {
        const existingOverlay = document.getElementById('vr-instructions-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }

    // Create overlay immediately if already in VR mode
    if (isVRMode()) {
        createVROverlay();
    }
});
