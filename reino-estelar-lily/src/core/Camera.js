/**
 * Camera.js - Control de seguimiento y sacudida de pantalla (shake)
 */

export const VIEW_W = 960;
export const VIEW_H = 540;

export class Camera {
    constructor(viewW = VIEW_W, viewH = VIEW_H) {
        this.viewW = viewW;
        this.viewH = viewH;
        this.x = 0;
        this.shakeAmount = 0;
        this.shakeTimer = 0;
    }

    shake(amount = 9, duration = 14) {
        this.shakeAmount = Math.max(this.shakeAmount, amount);
        this.shakeTimer = duration;
    }

    update(targetX, levelWidth) {
        if (this.shakeTimer > 0) {
            this.shakeTimer--;
            if (this.shakeTimer <= 0) {
                this.shakeAmount = 0;
            }
        }
        const desired = targetX - this.viewW * 0.35;
        this.x = Math.max(0, Math.min(desired, Math.max(0, levelWidth - this.viewW)));
    }

    getShakeOffset() {
        if (this.shakeAmount > 0) {
            return {
                x: (Math.random() - 0.5) * this.shakeAmount,
                y: (Math.random() - 0.5) * this.shakeAmount
            };
        }
        return { x: 0, y: 0 };
    }
}

export default Camera;
