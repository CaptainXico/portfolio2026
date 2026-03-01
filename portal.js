// portal.js

AFRAME.registerComponent('portal', {
  schema: {
    url: { type: 'string' },
    radius: { type: 'number', default: 1.2 }
  },

  init: function () {
    this.camera = document.querySelector('#camera');
    this.triggered = false;
  },

  tick: function () {
    if (!this.camera || this.triggered) return;

    const portalPos = new THREE.Vector3();
    const cameraPos = new THREE.Vector3();

    this.el.object3D.getWorldPosition(portalPos);
    this.camera.object3D.getWorldPosition(cameraPos);

    const distance = portalPos.distanceTo(cameraPos);

    if (distance < this.data.radius) {
      this.triggered = true;

      console.log("Entering portal:", this.data.url);

      setTimeout(() => {
        window.location.href = this.data.url;
      }, 1000);
    }
  }
});
