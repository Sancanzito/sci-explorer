import Phaser from 'phaser';

export class PhaserSceneManager {
  constructor(containerRef, sceneConfig) {
    this.game = null;
    this.containerRef = containerRef;
    this.sceneConfig = sceneConfig;
    this.isInitialized = false;
    this.actualSceneKey = null;
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
          width: 800, // Upgraded base resolution for fullscreen
          height: 600,
          backgroundColor: '#0b0f1a',
          audio: { noAudio: true },
          banner: false,
          scale: {
            mode: Phaser.Scale.FIT, // Ensures it maintains aspect ratio but fills modal
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 600
          }
        });

        const onReady = () => {
          try {
            // game.scene is now safely available
            const addedScene = this.game.scene.add(
              this.sceneConfig.sceneType,
              this.sceneConfig.SceneClass,
              true,
              this.sceneConfig.initData
            );

            // Safely get the assigned key
            this.actualSceneKey = addedScene.sys.config.key || addedScene.sys.settings.key;

            const checkScene = () => {
              if (this.game && this.game.scene && this.game.scene.isActive(this.actualSceneKey)) {
                this.isInitialized = true;
                resolve(this);
              } else {
                setTimeout(checkScene, 100);
              }
            };
            checkScene();
          } catch (error) {
            reject(error);
          }
        };

        // Phaser Game instances emit a 'ready' event when they are fully booted
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

  sendEvent(eventName, data) {
    const scene = this.getScene();
    if (scene && scene.events) {
      scene.events.emit(eventName, data);
    }
  }

  onSceneEvent(eventName, callback) {
    const scene = this.getScene();
    if (scene && scene.events) {
      scene.events.on(eventName, callback);
      return () => scene.events.off(eventName, callback);
    }
  }

  shutdown() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.isInitialized = false;
      this.actualSceneKey = null;
    }
  }

  getSceneState() {
    const scene = this.getScene();
    if (!scene) return null;

    const state = {};
    if (scene.data) {
      Object.keys(scene.data.list).forEach(key => {
        state[key] = scene.data.get(key);
      });
    }
    return state;
  }
}

export default PhaserSceneManager;