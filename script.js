document.addEventListener('DOMContentLoaded', () => {

    
    const indicator = document.getElementById('scroll-indicator');
    const bgImage = document.querySelector('.bg-image');
    const contentContainer = document.querySelector('.content-container');
    const triggerButtons = document.querySelectorAll('.image-trigger-button');
    const miniMap = document.querySelector('.mini-map');
    const mapMarkers = document.querySelectorAll('.mini-map-marker');
    const imagePanel = document.getElementById('image-panel');
    const closeButton = document.getElementById('close-panel');
    const panelImage = document.getElementById('panel-image');
    const panelDescription = document.getElementById('panel-description');
    const dryTimerContainer = document.getElementById('dry-timer-container');
    const dryTimerCircle = document.getElementById('dry-timer-circle');
    const boy = document.getElementById('flying-boy'); 
    const girl = document.getElementById('flying-girl'); 
    const duck1 = document.getElementById('flying-duck-1'); 
    const duck2 = document.getElementById('flying-duck-2'); 
    const duck3 = document.getElementById('flying-duck-3'); 
    const duck4 = document.getElementById('flying-duck-4'); 
    const grandfather = document.getElementById('flying-grandfather'); 
    
    let ticking = false;
    let panelTimeoutId; 

    
    function initializeMapMarkers() {
        const mapWidth = miniMap.clientWidth;
        const mapHeight = miniMap.clientHeight;

        triggerButtons.forEach(button => {
            const marker = document.querySelector(`.mini-map-marker[data-target="${button.id}"]`);
            if (!marker) return;
            const computedStyle = window.getComputedStyle(button);
            const topPercent = parseFloat(computedStyle.top);
            const leftPercent = parseFloat(computedStyle.left);

            marker.style.top = (mapHeight * topPercent / 100) + 'px';
            marker.style.left = (mapWidth * leftPercent / 100) + 'px';
        });
        updateIndicator();
    }

    
    function checkVisibleTriggers() {
        const viewportTop = window.scrollY;

        mapMarkers.forEach(marker => {
            const trigger = document.getElementById(marker.dataset.target);
            if (!trigger) return;
            const triggerCenter = contentContainer.offsetTop + trigger.offsetTop + (trigger.offsetHeight / 2);
            const activationZoneTop = viewportTop + (window.innerHeight * 0.3);
            const activationZoneBottom = viewportTop + (window.innerHeight * 0.7);

            if (triggerCenter >= activationZoneTop && triggerCenter <= activationZoneBottom) {
                 marker.classList.add('active');
            } else {
                 marker.classList.remove('active');
            }
        });
    }

    function updateIndicator() {
        const totalHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        if (totalHeight <= viewportHeight) {
             indicator.style.height = '0%';
             return;
        }

        const contentScrollableHeight = totalHeight - viewportHeight;
        const mapHeight = miniMap.clientHeight;
        const mainImageHeight = bgImage.offsetHeight;
        const indicatorHeightRatio = window.innerHeight / mainImageHeight;
        const indicatorHeight = mapHeight * indicatorHeightRatio;
        const indicatorTop = (scrollTop / contentScrollableHeight) * (mapHeight - indicatorHeight);
        const correctedTop = Math.min(indicatorTop, mapHeight - indicatorHeight);
        indicator.style.height = indicatorHeight + 'px';
        indicator.style.top = correctedTop + 'px';
        checkVisibleTriggers();
        if (bgImage && (boy || girl || duck1 || duck2 || duck3 || duck4 || grandfather)) {     
            const bgTransformStyle = window.getComputedStyle(bgImage).transform;
            let bgOffsetY = 0;
            if (bgTransformStyle && bgTransformStyle !== 'none') {
                
                const matrix = bgTransformStyle.match(/matrix.*\((.+)\)/);
                if (matrix && matrix[1]) {
                    
                    
                    bgOffsetY = parseFloat(matrix[1].split(', ')[5]); 
                }
            }
            
            const containerHeight = contentContainer.clientHeight;

            
            if (boy) {
                const initialTop = containerHeight * 0.3; 
                boy.style.top = `${initialTop + bgOffsetY}px`;
            }

            
            if (girl) {
                const initialTopGirl = containerHeight * 0.7; 
                girl.style.top = `${initialTopGirl + bgOffsetY}px`;
            }
            
            
            if (duck1) {
                const initialTopDuck = containerHeight * 0.14; 
                duck1.style.top = `${initialTopDuck + bgOffsetY}px`;
            }
            
            
            if (duck2) {
                const initialTopDuck = containerHeight * 0.12; 
                duck2.style.top = `${initialTopDuck + bgOffsetY}px`;
            }
            
            
            if (duck3) {
                const initialTopDuck = containerHeight * 0.16; 
                duck3.style.top = `${initialTopDuck + bgOffsetY}px`;
            }
            
            
            if (duck4) {
                const initialTopDuck = containerHeight * 0.18; 
                duck4.style.top = `${initialTopDuck + bgOffsetY}px`;
            }


            
            if (grandfather) {
                const initialTopGrandfather = containerHeight * 0.55; 
                grandfather.style.top = `${initialTopGrandfather + bgOffsetY}px`;
            }
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateIndicator);
            ticking = true;
        }
    }

    
    function setupAutoScroll() {
        triggerButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                clearTimeout(panelTimeoutId);
                triggerButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                const containerTopOffset = contentContainer.offsetTop;
                const targetScrollPosition = containerTopOffset + button.offsetTop - (window.innerHeight / 2) + (button.offsetHeight / 2);
                window.scrollTo({
                    top: targetScrollPosition,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    button.classList.remove('active');
                }, 800);
                const x = event.pageX; 
                const y = event.pageY; 
                const clickEffect = document.createElement('div');
                clickEffect.classList.add('click-effect');
                const clickFlap = document.createElement('div');
                clickFlap.classList.add('click-flap');
                clickEffect.style.left = `${x}px`;
                clickEffect.style.top = `${y}px`;
                clickEffect.appendChild(clickFlap);
                document.body.appendChild(clickEffect); 
                setTimeout(() => {
                    clickEffect.remove();
                }, 1500); 
                const imgSrc = button.dataset.imageSrc;
                const imgDesc = button.dataset.description;
                panelImage.src = imgSrc;
                panelDescription.textContent = imgDesc;
                imagePanel.classList.remove('hidden');
                dryTimerContainer.classList.remove('running');
                dryTimerCircle.style.opacity = '1';
                dryTimerContainer.classList.add('running');
                panelTimeoutId = setTimeout(() => {
                    imagePanel.classList.add('hidden');
                    
                    dryTimerContainer.classList.remove('running');
                }, 5000); 
            });
        });
    }

    
    closeButton.addEventListener('click', () => {
        imagePanel.classList.add('hidden');
        clearTimeout(panelTimeoutId);
        dryTimerContainer.classList.remove('running');
        dryTimerCircle.style.opacity = '1'; 
    });

    
    

    
    if (bgImage.complete) {
        initializeMapMarkers();
    } else {
        bgImage.onload = initializeMapMarkers;
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', initializeMapMarkers);
    setupAutoScroll();
});