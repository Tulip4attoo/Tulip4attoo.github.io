(() => {
    const root = document.documentElement;
    const body = document.body;
    const svg = document.querySelector('.home-constellations');

    if (!body || !body.classList.contains('home-landing') || !svg) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const viewBox = svg.viewBox.baseVal;
    const stars = [];
    const lines = [];

    let pointerActive = false;
    let pointerX = viewBox.x + viewBox.width / 2;
    let pointerY = viewBox.y + viewBox.height / 2;

    function coordKey(x, y) {
        return `${Number(x).toFixed(3)},${Number(y).toFixed(3)}`;
    }

    function parsePoints(raw) {
        return raw
            .trim()
            .split(/\s+/)
            .map((pair) => {
                const [x, y] = pair.split(',').map(Number);
                return { x, y };
            })
            .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
    }

    function clientToSvg(clientX, clientY) {
        const rect = svg.getBoundingClientRect();
        return {
            x: viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.width,
            y: viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.height,
        };
    }

    function buildConstellationModel() {
        const groups = Array.from(svg.querySelectorAll('.constellation'));

        groups.forEach((group, groupIndex) => {
            const starsByCoord = new Map();
            const circles = Array.from(group.querySelectorAll('circle'));

            circles.forEach((circle, starIndex) => {
                const baseX = Number(circle.getAttribute('cx'));
                const baseY = Number(circle.getAttribute('cy'));
                if (!Number.isFinite(baseX) || !Number.isFinite(baseY)) return;

                const star = {
                    element: circle,
                    baseX,
                    baseY,
                    x: baseX,
                    y: baseY,
                    repelX: 0,
                    repelY: 0,
                    phase: (groupIndex * 1.7 + starIndex * 2.13),
                    drift: 1.5 + ((groupIndex + starIndex) % 4) * 0.45,
                    speed: 0.00045 + ((starIndex % 3) * 0.00012),
                };

                stars.push(star);
                starsByCoord.set(coordKey(baseX, baseY), star);
            });

            Array.from(group.querySelectorAll('polyline')).forEach((polyline) => {
                const points = parsePoints(polyline.getAttribute('points') || '')
                    .map((point) => ({
                        x: point.x,
                        y: point.y,
                        star: starsByCoord.get(coordKey(point.x, point.y)) || null,
                    }));

                lines.push({ element: polyline, points });
            });
        });
    }

    function updateStarPositions(timestamp) {
        const influenceRadius = 92;
        const maxRepel = 22;
        const settle = 0.13;
        const idleScale = pointerActive ? 0.7 : 1;

        stars.forEach((star) => {
            let targetRepelX = 0;
            let targetRepelY = 0;
            let focus = 0;

            if (pointerActive) {
                const dx = star.baseX - pointerX;
                const dy = star.baseY - pointerY;
                const distance = Math.hypot(dx, dy);

                if (distance < influenceRadius) {
                    focus = 1 - distance / influenceRadius;
                    const force = focus * focus;
                    const safeDistance = Math.max(distance, 0.001);
                    targetRepelX = (dx / safeDistance) * maxRepel * force;
                    targetRepelY = (dy / safeDistance) * maxRepel * force;
                }
            }

            star.repelX += (targetRepelX - star.repelX) * settle;
            star.repelY += (targetRepelY - star.repelY) * settle;

            const idleX = Math.sin(timestamp * star.speed + star.phase) * star.drift * idleScale;
            const idleY = Math.cos(timestamp * (star.speed * 0.83) + star.phase) * star.drift * 0.72 * idleScale;

            star.x = star.baseX + idleX + star.repelX;
            star.y = star.baseY + idleY + star.repelY;

            star.element.setAttribute('cx', star.x.toFixed(2));
            star.element.setAttribute('cy', star.y.toFixed(2));
            star.element.style.opacity = (0.42 + focus * 0.58).toFixed(2);
            star.element.style.filter = focus > 0.04 ? `drop-shadow(0 0 ${(focus * 7).toFixed(1)}px currentColor)` : '';
        });
    }

    function updateLines() {
        lines.forEach((line) => {
            const points = line.points
                .map((point) => {
                    const x = point.star ? point.star.x : point.x;
                    const y = point.star ? point.star.y : point.y;
                    return `${x.toFixed(2)},${y.toFixed(2)}`;
                })
                .join(' ');

            line.element.setAttribute('points', points);
        });
    }

    function animate(timestamp) {
        updateStarPositions(timestamp);
        updateLines();
        window.requestAnimationFrame(animate);
    }

    buildConstellationModel();

    document.addEventListener('pointermove', (event) => {
        pointerActive = true;
        const point = clientToSvg(event.clientX, event.clientY);
        pointerX = point.x;
        pointerY = point.y;

        root.style.setProperty('--home-cursor-x', `${event.clientX}px`);
        root.style.setProperty('--home-cursor-y', `${event.clientY}px`);
    }, { passive: true });

    window.addEventListener('mouseout', (event) => {
        if (!event.relatedTarget) {
            pointerActive = false;
        }
    }, { passive: true });

    if (!reducedMotion) {
        window.requestAnimationFrame(animate);
    }
})();
