class Animation {
    constructor(element) {
        this.element = element;
        this.queue = [];
    }

    animate(properties, duration, easingFunction) {
        this.queue.push({ properties, duration, easingFunction });
        if (this.queue.length === 1) {
            this.runNext();
        }
        return this;
    }

    runNext() {
        if (this.queue.length === 0) return;

        const { properties, duration, easingFunction } = this.queue[0];
        const start = {};
        const end = {};
        const startTime = performance.now();

        Object.keys(properties).forEach(prop => {
            start[prop] = parseFloat(getComputedStyle(this.element)[prop]);
            end[prop] = parseFloat(properties[prop]);
        });

        const animateStep = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easingFunction(progress);

            Object.keys(properties).forEach(prop => {
                const value = start[prop] + easedProgress * (end[prop] - start[prop]);
                this.element.style[prop] = value + 'px';
            });

            if (progress < 1) {
                requestAnimationFrame(animateStep);
            } else {
                this.queue.shift();
                this.runNext();
            }
        };

        requestAnimationFrame(animateStep);
    }

    static easing = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => t * (2 - t),
    };
}

// Example usage
const box = document.getElementById('box');
const anim = new Animation(box);

// Animate button click
document.getElementById('animateBtn').addEventListener('click', () => {
    anim.animate({ left: 300, top: 150 }, 1000, Animation.easing.easeInQuad)
        .animate({ left: 0, top: 0 }, 1000, Animation.easing.easeOutQuad);
});

// Resize the box on click
box.addEventListener('click', () => {
    const newSize = box.style.width === '50px' ? 100 : 50;
    anim.animate({ width: newSize, height: newSize }, 500, Animation.easing.easeInQuad);
    // Change color on click
    box.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
});

// Dragging functionality
let isDragging = false;
let startX, startY, initialX, initialY;

box.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = parseFloat(box.style.left || 0);
    initialY = parseFloat(box.style.top || 0);
    box.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        box.style.left = initialX + dx + 'px';
        box.style.top = initialY + dy + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    box.style.cursor = 'grab';
});
