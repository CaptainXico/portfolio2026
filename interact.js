AFRAME.registerComponent('hover-effect', {
  init() {
    const box = this.el.querySelector('.interactive');
    if (!box) return;

    const highlight = () => {
      box.setAttribute('color', '#00ffcc');
    };

    const unhighlight = () => {
      box.setAttribute('color', '#222');
    };

    box.addEventListener('raycaster-intersected', () => {
      console.log('HOVER HIT', box);
    });


    // Works for BOTH mouse cursor and VR controllers
    box.addEventListener('raycaster-intersected', highlight);
    box.addEventListener('raycaster-intersected-cleared', unhighlight);
  }
});

AFRAME.registerComponent('desktop-cursor-only', {
  init() {
    if (!AFRAME.utils.device.isMobile() && !AFRAME.utils.device.checkHeadsetConnected()) {
      this.el.setAttribute('visible', true);
    }
  }
});

AFRAME.registerComponent('product-button', {
  schema: {
    product: { type: 'string' }
  },

  init() {
    this.el.addEventListener('click', () => {
      this.el.sceneEl.emit('product-selected', {
        productId: this.data.product
      });
    });
  }
});


AFRAME.registerComponent('input-mode-manager', {
  init() {
    const scene = this.el.sceneEl;
    const cursor = document.querySelector('#desktop-cursor');

    if (!cursor) return;

    // Desktop mode (default)
    cursor.setAttribute('raycaster', 'objects: .interactive');

    scene.addEventListener('enter-vr', () => {
      // Disable desktop cursor raycasting in VR
      cursor.removeAttribute('raycaster');
    });

    scene.addEventListener('exit-vr', () => {
      // Re-enable desktop cursor raycasting
      cursor.setAttribute('raycaster', 'objects: .interactive');
    });
  }
});
