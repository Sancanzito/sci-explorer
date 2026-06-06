// src/Simulations/MicrobeRPG/PhaserSceneManager.js
import Phaser from 'phaser';

export class PhaserSceneManager {
  constructor(containerRef, sceneConfig) {
    this.game = null;
    this.containerRef = containerRef;
    this.sceneConfig = sceneConfig;
    this.isInitialized = false;
    this.actualSceneKey = null;
    this.isDestroyed = false;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      if (!this.containerRef.current) {
        reject(new Error('Container ref not ready'));
        return;
      }

      try {
        this.game = new Phaser.Game({
          type: Phaser.AUTO,
          parent: this.containerRef.current,
          width: 800,
          height: 600,
          backgroundColor: '#0b0f1a',
          audio: { noAudio: true },
          banner: false,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 600
          }
        });

        const onReady = () => {
          if (this.isDestroyed || !this.game || !this.game.scene) {
            resolve(this);
            return;
          }

          try {
            this.actualSceneKey = `${this.sceneConfig.sceneType}_${Date.now()}`;

            // Add scene class and start with initData payload
            this.game.scene.add(this.actualSceneKey, this.sceneConfig.SceneClass, false);
            this.game.scene.start(this.actualSceneKey, this.sceneConfig.initData);

            let attempts = 0;
            const checkScene = () => {
              // Bail out cleanly if the component was unmounted during boot
              if (this.isDestroyed) {
                resolve(this);
                return;
              }
              
              if (this.game && this.game.scene && this.game.scene.isActive(this.actualSceneKey)) {
                this.isInitialized = true;
                resolve(this);
              } else if (attempts > 100) { 
                // Circuit breaker: Reject after ~5 seconds (100 * 50ms) to prevent infinite loops
                reject(new Error(`Phaser scene failed to become active: ${this.sceneConfig.sceneType}`));
              } else {
                attempts++;
                setTimeout(checkScene, 50);
              }
            };
            checkScene();
          } catch (error) {
            reject(error);
          }
        };

        if (this.game.isBooted) {
          onReady();
        } else {
          this.game.events.once('ready', onReady);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getScene() {
    if (!this.game || !this.isInitialized || !this.actualSceneKey) return null;
    return this.game.scene.getScene(this.actualSceneKey);
  }

  shutdown() {
    this.isDestroyed = true;
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
    this.isInitialized = false;
    this.actualSceneKey = null;
  }
}

export default PhaserSceneManager;