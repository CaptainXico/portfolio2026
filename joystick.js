// Joystick.js - Mobile touch joystick for movement controls

document.addEventListener('DOMContentLoaded', function() {
    // Detect if user is on mobile device
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    }

    // Only create joystick on mobile devices
    if (!isMobile()) {
        return;
    }

    // Create joystick container
    const joystickContainer = document.createElement('div');
    joystickContainer.id = 'mobile-joystick';
    joystickContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 120px;
        height: 120px;
        z-index: 1001;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
    `;

    // Create joystick base
    const joystickBase = document.createElement('div');
    joystickBase.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 255, 255, 0.2);
        border: 2px solid rgba(0, 255, 255, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(5px);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    `;

    // Create joystick stick
    const joystickStick = document.createElement('div');
    joystickStick.style.cssText = `
        position: absolute;
        width: 50px;
        height: 50px;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.8), rgba(0, 200, 200, 0.6));
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
        transition: none;
        pointer-events: none;
    `;

    // Add joystick elements to container
    joystickBase.appendChild(joystickStick);
    joystickContainer.appendChild(joystickBase);
    document.body.appendChild(joystickContainer);

    // Joystick state
    let isActive = false;
    let centerX = 60; // Half of joystick width
    let centerY = 60; // Half of joystick height
    let maxDistance = 35; // Maximum distance stick can move from center

    // Movement state
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;

    // Get camera rig for movement
    function getCameraRig() {
        return document.querySelector('#camera-rig');
    }

    // Handle touch start
    function handleTouchStart(e) {
        e.preventDefault();
        isActive = true;
        updateJoystickPosition(e.touches[0]);
    }

    // Handle touch move
    function handleTouchMove(e) {
        e.preventDefault();
        if (isActive) {
            updateJoystickPosition(e.touches[0]);
        }
    }

    // Handle touch end
    function handleTouchEnd(e) {
        e.preventDefault();
        isActive = false;
        resetJoystick();
        stopMovement();
    }

    // Update joystick stick position based on touch
    function updateJoystickPosition(touch) {
        const rect = joystickContainer.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        // Calculate distance from center
        const deltaX = touchX - centerX;
        const deltaY = touchY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Limit stick movement to max distance
        let stickX = deltaX;
        let stickY = deltaY;

        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            stickX = Math.cos(angle) * maxDistance;
            stickY = Math.sin(angle) * maxDistance;
        }

        // Update stick position
        joystickStick.style.transform = `translate(${stickX}px, ${stickY}px)`;

        // Update movement state based on stick position
        updateMovementState(stickX, stickY);
    }

    // Update movement state based on joystick position
    function updateMovementState(x, y) {
        const threshold = 10; // Minimum distance to register movement

        // Reset movement
        moveForward = false;
        moveBackward = false;
        moveLeft = false;
        moveRight = false;

        // Determine movement direction
        if (Math.abs(y) > threshold) {
            if (y < -threshold) {
                moveForward = true;
            } else if (y > threshold) {
                moveBackward = true;
            }
        }

        if (Math.abs(x) > threshold) {
            if (x < -threshold) {
                moveLeft = true;
            } else if (x > threshold) {
                moveRight = true;
            }
        }

        // Apply movement to camera rig
        applyMovement();
    }

    // Apply movement to camera rig
    function applyMovement() {
        const cameraRig = getCameraRig();
        if (!cameraRig) return;

        const speed = 0.1;
        let moveX = 0;
        let moveZ = 0;

        if (moveForward) moveZ -= speed;
        if (moveBackward) moveZ += speed;
        if (moveLeft) moveX -= speed;
        if (moveRight) moveX += speed;

        // Get camera's current rotation
        const camera = document.querySelector('#camera');
        if (camera) {
            const rotation = camera.getAttribute('rotation');
            const yaw = rotation.y * Math.PI / 180;

            // Rotate movement vector based on camera direction
            const rotatedX = moveX * Math.cos(yaw) - moveZ * Math.sin(yaw);
            const rotatedZ = moveX * Math.sin(yaw) + moveZ * Math.cos(yaw);

            // Apply movement
            const currentPos = cameraRig.getAttribute('position') || { x: 0, y: 0, z: 0 };
            cameraRig.setAttribute('position', {
                x: currentPos.x + rotatedX,
                y: currentPos.y,
                z: currentPos.z + rotatedZ
            });
        }
    }

    // Reset joystick to center position
    function resetJoystick() {
        joystickStick.style.transform = 'translate(0px, 0px)';
    }

    // Stop all movement
    function stopMovement() {
        moveForward = false;
        moveBackward = false;
        moveLeft = false;
        moveRight = false;
    }

    // Continuous movement update
    function updateMovement() {
        if (isActive) {
            applyMovement();
        }
        requestAnimationFrame(updateMovement);
    }

    // Add event listeners
    joystickContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystickContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystickContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    joystickContainer.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Start movement update loop
    updateMovement();

    // Hide joystick on desktop when window is resized
    window.addEventListener('resize', function() {
        if (!isMobile()) {
            joystickContainer.style.display = 'none';
        } else {
            joystickContainer.style.display = 'block';
        }
    });

    console.log('Mobile joystick initialized');
});
