// portal.js

AFRAME.registerComponent('portal', {
  schema: {
    url: {type: 'string'},
    radius: {type: 'number', default: 1.0}
  },

  init: function () {
    this.camera = document.querySelector('#camera');
  },

  tick: function () {
    if (!this.camera) return;

    const portalPos = new THREE.Vector3();
    const cameraPos = new THREE.Vector3();

    this.el.object3D.getWorldPosition(portalPos);
    this.camera.object3D.getWorldPosition(cameraPos);

    const distance = portalPos.distanceTo(cameraPos);

    if (distance < this.data.radius) {
      window.location.href = this.data.url;
    }
  }
});
