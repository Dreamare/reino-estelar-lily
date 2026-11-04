/**
 * Input.js - Manejador de teclado, botones táctiles y buffer de salto
 */

export const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    punch: false,
    jumpBufferTimer: 0,
    coyoteTimer: 0
};

export function triggerJumpInput() {
    keys.jump = true;
    keys.jumpBufferTimer = 8;
}

export function bindTouchButton(id, onStart, onEnd) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const start = (e) => {
        e.preventDefault();
        onStart();
    };
    const end = (e) => {
        e.preventDefault();
        onEnd();
    };
    btn.addEventListener('touchstart', start, { passive: false });
    btn.addEventListener('touchend', end, { passive: false });
    btn.addEventListener('touchcancel', end, { passive: false });
    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', end);
    btn.addEventListener('mouseleave', end);
}

export function initInput({ onTogglePause, onShootBubble, onPunch } = {}) {
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyP' || e.code === 'Escape') {
            if (onTogglePause) onTogglePause();
            return;
        }
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
        if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
            triggerJumpInput();
        }
        if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
        if (e.code === 'KeyZ' || e.code === 'KeyJ' || e.code === 'KeyX' || e.code === 'KeyK') {
            keys.punch = true;
            if (onShootBubble) onShootBubble();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
        if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keys.jump = false;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
        if (e.code === 'KeyZ' || e.code === 'KeyJ' || e.code === 'KeyX' || e.code === 'KeyK') keys.punch = false;
    });

    bindTouchButton('btn-left', () => keys.left = true, () => keys.left = false);
    bindTouchButton('btn-right', () => keys.right = true, () => keys.right = false);
    bindTouchButton('btn-down', () => keys.down = true, () => keys.down = false);
    bindTouchButton('btn-jump', () => triggerJumpInput(), () => keys.jump = false);
    bindTouchButton('btn-action', () => {
        keys.punch = true;
        if (onShootBubble) onShootBubble();
    }, () => keys.punch = false);
    bindTouchButton('btn-punch', () => {
        keys.punch = true;
        if (onPunch) onPunch();
    }, () => keys.punch = false);
}
