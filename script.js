const TOTAL_SCENES = 8;
  let currentScene = 0;
  const scenes = document.querySelectorAll('.scene');

  function initConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#ff6b9d','#ffd700','#00e5c8','#ff8c42','#ffffff'];
    for (let i = 0; i < 70; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * -20}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${1.5 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      container.appendChild(piece);
    }
  }

  // Interactive Archery Rig Logic (from Birthday Gift)
  let drawing = false;
  let isArrowShot = false;
  let startPX = 0, startPY = 0;
  let currentDraw = 0;
  const maxDrawLimit = 90;
  const archeryRig = document.getElementById('archeryRig');
  const arrowSvg = document.getElementById('arrowSvg');
  const strL = document.getElementById('strL');
  const strR = document.getElementById('strR');
  const serving = document.getElementById('serving');
  const targetHeart = document.getElementById('targetHeart');

  function updateString(d) {
    currentDraw = Math.max(0, Math.min(d, maxDrawLimit));
    const nockY = 96 + currentDraw;
    if (strL) strL.setAttribute('y2', nockY);
    if (strR) strR.setAttribute('y2', nockY);
    if (serving) serving.setAttribute('cy', nockY);
    if (arrowSvg && !isArrowShot) gsap.set(arrowSvg, { y: currentDraw });
  }

  if (archeryRig) {
    archeryRig.addEventListener('click', (e) => {
      e.stopPropagation();
      shootArcheryArrow();
    });

    archeryRig.addEventListener('pointerdown', (e) => {
      if (isArrowShot) return;
      drawing = true;
      try { archeryRig.setPointerCapture(e.pointerId); } catch (_) {}
      startPX = e.clientX;
      startPY = e.clientY;
      e.preventDefault();
    });

    archeryRig.addEventListener('pointermove', (e) => {
      if (!drawing || isArrowShot) return;
      const dy = e.clientY - startPY;
      updateString(dy);
    });

    const endArcheryDraw = () => {
      if (!drawing || isArrowShot) return;
      drawing = false;
      if (currentDraw > 25) {
        shootArcheryArrow();
      } else {
        gsap.to({ d: currentDraw }, {
          d: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
          onUpdate() { updateString(this.targets()[0].d); }
        });
      }
    };

    archeryRig.addEventListener('pointerup', endArcheryDraw);
    archeryRig.addEventListener('pointercancel', endArcheryDraw);
  }

  // Scene 2 Interactive Sequence Logic (Refined GSAP Animations)
  let isGiftOpened = false;

  function openGiftBox() {
    if (isGiftOpened) return;
    isGiftOpened = true;

    // 1. Lift and tilt lid gracefully
    gsap.to('#boxLid', {
      y: -150,
      x: 90,
      rotation: 40,
      duration: 0.85,
      ease: 'back.out(1.4)'
    });

    // 2. Emerging Heart rises gracefully to the center
    gsap.timeline()
      .set('#emergingHeart', { display: 'block', opacity: 0, scale: 0.2, y: 30 })
      .to('#emergingHeart', {
        opacity: 1,
        y: -155,
        scale: 1.25,
        duration: 0.9,
        ease: 'back.out(1.8)',
        delay: 0.15
      })
      .to('#emergingHeart', {
        y: '-=12',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
  }


  function shootArcheryArrow() {
    if (isArrowShot) return;
    if (!isGiftOpened) {
      openGiftBox();
      setTimeout(shootArcheryArrow, 700);
      return;
    }
    isArrowShot = true;

    // Disable CSS keyframe shadow animation on impact to prevent GPU rasterization lock
    const heartEl = document.getElementById('emergingHeart');
    if (heartEl) {
      heartEl.style.animation = 'none';
    }

    // 1. Bow string snaps back empty
    gsap.to({ d: currentDraw }, {
      d: 0,
      duration: 0.22,
      ease: 'power2.out',
      onUpdate() { updateString(this.targets()[0].d); }
    });

    // 2. Arrow flies precisely into the target heart center
    gsap.to(arrowSvg, {
      y: -210,
      scaleY: 1.05,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        // Arrow impact: Heart recoils & wiggles
        gsap.to('#emergingHeart', {
          scale: 1.35,
          x: 4,
          duration: 0.08,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to('#emergingHeart', { scale: 1.25, x: 0, duration: 0.2, ease: 'power2.inOut' });
          }
        });

        // Arrow bursts into golden heart sparkles right at impact point!
        burstHeartParticles();

        // Brief dramatic pause before scene transition zoom
        setTimeout(() => {
          gsap.set(arrowSvg, { display: 'none', opacity: 0 });

          // Smooth 60 FPS Scene Transition Zoom into Happy Birthday Scene
          gsap.to('#emergingHeart', {
            scale: 25,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.in',
            onComplete: () => {
              scenes[currentScene].classList.remove('active');
              currentScene = 3; // Happy Birthday scene!
              scenes[currentScene].classList.add('active');
              initConfetti();
            }
          });
        }, 120);
      }
    });
  }

  function burstHeartParticles() {
    const heartEl = document.getElementById('emergingHeart');
    if (!heartEl) return;

    const rect = heartEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const emojis = ['💖', '✨', '🌸', '💖', '⭐'];
    const fragment = document.createDocumentFragment();
    const particles = [];

    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        font-size: ${18 + Math.random() * 18}px;
        pointer-events: none;
        z-index: 100;
        transform: translate(-50%, -50%) scale(1);
        will-change: transform, opacity;
      `;
      p.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      fragment.appendChild(p);
      particles.push(p);
    }
    document.body.appendChild(fragment);

    particles.forEach(p => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 100;
      const targetX = Math.cos(angle) * dist;
      const targetY = Math.sin(angle) * dist - 15;

      gsap.fromTo(p,
        { scale: 0.2, opacity: 1, x: 0, y: 0 },
        {
          x: targetX,
          y: targetY,
          scale: 1.2,
          opacity: 0,
          duration: 0.7 + Math.random() * 0.3,
          ease: 'power2.out',
          onComplete: () => p.remove()
        }
      );
    });
  }

  let isCandleExtinguished = false;
  function toggleCandleFlame() {
    const candleEl = document.getElementById('cakeCandle');
    const flames = document.querySelectorAll('.fuego');
    if (!candleEl) return;
    if (!isCandleExtinguished) {
      flames.forEach(f => f.classList.add('extinguished'));
      isCandleExtinguished = true;
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const smoke = document.createElement('div');
          smoke.className = 'smoke-particle';
          smoke.style.left = `calc(50% + ${(Math.random() - 0.5) * 12}px)`;
          candleEl.appendChild(smoke);
          setTimeout(() => smoke.remove(), 1500);
        }, i * 150);
      }
    } else {
      flames.forEach(f => f.classList.remove('extinguished'));
      isCandleExtinguished = false;
    }
  }



  function burstCakeParticles() {
    const stage = document.querySelector('.cake-stage');
    if (!stage) return;
    const emojis = ['🍰', '✨', '🍓', '🎂', '💖', '🎉', '🕯️', '🌸'];
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        top: 50%; left: 50%;
        font-size: ${20 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 100;
        transition: all 0.9s cubic-bezier(0.25, 1, 0.5, 1);
        transform: translate(-50%, -50%) scale(1);
      `;
      p.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      stage.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 140;
      setTimeout(() => {
        p.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist - 40}px)) scale(0)`;
        p.style.opacity = '0';
      }, 20);
      setTimeout(() => p.remove(), 1000);
    }
  }

  // Scene 5 Interactive 5-Balloon Archery Sequence
  const balloonReasons = [
    "How your laugh instantly fixes my worst days ✨",
    "The comfort of our late-night chats & quiet moments 🌙",
    "How you remember tiny details I forgot I even said 🌸",
    "Your soft heart & how effortlessly you make me smile 💖",
    "Because in a world full of noise, you are my home, Hayati 🌹"
  ];
  const balloonAimAngles = [-36, -18, 0, 18, 36];
  let currentBalloonIdx = 0;
  let isBalloonShooting = false;

  function shootCurrentBalloon() {
    if (currentBalloonIdx >= 5) {
      goToScene(6); // All 5 balloons popped! Next tap advances to Wishes List
      return;
    }
    shootBalloon(currentBalloonIdx);
  }

  function shootBalloon(index) {
    if (isBalloonShooting) return;
    const targetItem = document.getElementById(`bItem-${index}`);
    if (!targetItem || targetItem.classList.contains('popped')) return;

    isBalloonShooting = true;
    currentBalloonIdx = index;

    const bowWrap = document.getElementById('balloonBowWrap');
    const arrow = document.getElementById('balloonArrowSvg');

    // 1. Aim bow smoothly at target balloon angle
    const angle = balloonAimAngles[index] || 0;
    gsap.to(bowWrap, {
      rotation: angle,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        // 2. Shoot arrow smoothly towards balloon
        gsap.to(arrow, {
          y: -260,
          scaleY: 1.1,
          duration: 0.22,
          ease: 'power2.in',
          onComplete: () => {
            // 3. Instant Pop FX, Shatter Animation & GPU Particle Burst
            targetItem.classList.add('popping');
            setTimeout(() => targetItem.classList.add('popped'), 380);
            burstBalloonParticles(targetItem, index);

            // 4. Update Reason Card with smooth animated exit-entrance transition
            revealBalloonReasonCard(index);

            // 5. Reset arrow & prepare bow for next balloon
            gsap.set(arrow, { y: 0, scaleY: 1 });
            isBalloonShooting = false;
            currentBalloonIdx = index + 1;

            if (currentBalloonIdx < 5) {
              const nextAngle = balloonAimAngles[currentBalloonIdx];
              gsap.to(bowWrap, { rotation: nextAngle, duration: 0.35, delay: 0.15, ease: 'power2.inOut' });
            } else {
              triggerBalloonConfettiShower(); // Grand Finale Confetti!
              gsap.to(bowWrap, { opacity: 0, scale: 0.5, duration: 0.4 });
            }
          }
        });
      }
    });
  }

  const balloonThemeColors = ['#ff6b9d', '#8b5cf6', '#0d9488', '#d97706', '#ff7675'];

  function createReasonSparkles(cardEl, color) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const sparklesCount = 10;
    const symbols = ['✨', '💖', '⭐', '🌸', '✨'];

    for (let i = 0; i < sparklesCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'reason-sparkle-fx';
      sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const startX = rect.left + 20 + Math.random() * (rect.width - 40);
      const startY = rect.top + 10 + Math.random() * (rect.height - 20);
      sparkle.style.left = `${startX}px`;
      sparkle.style.top = `${startY}px`;
      sparkle.style.color = color || '#ff4081';
      document.body.appendChild(sparkle);

      const angle = Math.random() * Math.PI * 2;
      const dist = 35 + Math.random() * 65;
      const targetX = Math.cos(angle) * dist;
      const targetY = Math.sin(angle) * dist - 25;

      gsap.fromTo(sparkle,
        { scale: 0.2, opacity: 1, x: 0, y: 0 },
        {
          x: targetX,
          y: targetY,
          scale: 1.2 + Math.random() * 0.6,
          opacity: 0,
          rotation: Math.random() * 180 - 90,
          duration: 0.75 + Math.random() * 0.45,
          ease: 'power2.out',
          onComplete: () => sparkle.remove()
        }
      );
    }
  }

  function revealBalloonReasonCard(index) {
    const labelEl = document.getElementById('reasonLabel');
    const textEl = document.getElementById('reasonText');
    const cardEl = document.getElementById('balloonReasonCard');
    if (!cardEl || !labelEl || !textEl) return;

    const themeColor = balloonThemeColors[index] || '#ff4081';
    const newLabel = `REASON ${index + 1} OF 5`;
    const newText = balloonReasons[index];

    // Check if card is hidden (first pop)
    const isHidden = cardEl.style.display === 'none' || gsap.getProperty(cardEl, 'opacity') < 0.3;

    if (isHidden) {
      // First reveal: Show card & animate in
      cardEl.style.display = 'flex';
      labelEl.textContent = newLabel;
      textEl.textContent = newText;
      labelEl.style.color = themeColor;

      gsap.killTweensOf([cardEl, labelEl, textEl]);

      const tl = gsap.timeline();
      tl.fromTo(cardEl,
        { rotateX: 55, scale: 0.7, opacity: 0, y: 25, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
        { rotateX: 0, scale: 1, opacity: 1, y: 0, boxShadow: `0 15px 45px ${themeColor}40`, duration: 0.55, ease: 'back.out(1.8)' }
      )
      .fromTo(labelEl,
        { scale: 0.3, opacity: 0, y: -10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2.2)' },
        '-=0.35'
      )
      .fromTo(textEl,
        { y: 20, opacity: 0, scale: 0.88, filter: 'blur(8px)', rotateX: -25 },
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', rotateX: 0, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.3'
      );
      
      createReasonSparkles(cardEl, themeColor);
    } else {
      // Card is ALREADY visible -> Smooth Exit transition, update text, Smooth Entrance transition!
      gsap.killTweensOf([cardEl, labelEl, textEl]);

      const tl = gsap.timeline();
      
      // 1. Exit old content with blur & tilt + card squeeze
      tl.to(labelEl, { y: -12, opacity: 0, scale: 0.85, duration: 0.16, ease: 'power2.in' })
        .to(textEl, { y: -22, opacity: 0, scale: 0.9, filter: 'blur(8px)', rotateX: 25, duration: 0.2, ease: 'power2.in' }, '-=0.14')
        .to(cardEl, { scaleX: 0.94, scaleY: 1.06, duration: 0.18, ease: 'power2.inOut' }, '-=0.18')

      // 2. Update content & theme color at mid-point
        .call(() => {
          labelEl.textContent = newLabel;
          textEl.textContent = newText;
          labelEl.style.color = themeColor;
        })

      // 3. Entrance new content with bounce & 3D tilt
        .to(cardEl, { 
          scaleX: 1, 
          scaleY: 1, 
          scale: 1, 
          boxShadow: `0 15px 45px ${themeColor}45`,
          duration: 0.45, 
          ease: 'back.out(2)' 
        })
        .fromTo(labelEl,
          { y: 15, opacity: 0, scale: 0.4 },
          { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(2.2)' },
          '-=0.35'
        )
        .fromTo(textEl,
          { y: 25, opacity: 0, scale: 0.85, filter: 'blur(8px)', rotateX: -25 },
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', rotateX: 0, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.32'
        );

      createReasonSparkles(cardEl, themeColor);
    }

  }

  function burstBalloonParticles(item, index) {
    const balloonColorsList = ['#ff6b9d', '#a29bfe', '#4ecdc4', '#f5c863', '#ff7675'];
    const rect = item.getBoundingClientRect();
    const container = document.getElementById('scene-balloons');
    if (!container) return;

    const balloonColor = balloonColorsList[index] || '#ff6b9d';
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Trigger full-screen raining celebration confetti shower!
    triggerBalloonConfettiShower();

    // Spawn falling confetti ribbon & emoji shower that floats DOWNWARDS slowly!
    spawnFallingConfettiShower(centerX, centerY);

    // 1. Light Radial Flash (GPU Composite)
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      left: ${centerX - 120}px;
      top: ${centerY - 120}px;
      width: 240px;
      height: 240px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 90;
      background: radial-gradient(circle, ${balloonColor} 0%, rgba(255,255,255,0.85) 50%, transparent 75%);
      opacity: 0.95;
    `;
    container.appendChild(flash);
    gsap.to(flash, { opacity: 0, scale: 2, duration: 0.38, ease: 'power2.out', onComplete: () => flash.remove() });

    // 2. Torn Rubber Shards Exploding Out From Balloon Center
    for (let i = 0; i < 8; i++) {
      const shard = document.createElement('div');
      const angle = (i / 8) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
      const dist = 60 + Math.random() * 110;
      const shardWidth = 8 + Math.random() * 12;
      const shardHeight = 12 + Math.random() * 16;

      shard.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: ${shardWidth}px;
        height: ${shardHeight}px;
        background: ${balloonColor};
        border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        pointer-events: none;
        z-index: 98;
        will-change: transform, opacity;
      `;
      container.appendChild(shard);

      gsap.to(shard, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 40,
        rotation: (Math.random() - 0.5) * 720,
        scale: 0.1,
        opacity: 0,
        duration: 0.55 + Math.random() * 0.2,
        ease: 'power2.out',
        onComplete: () => shard.remove()
      });
    }

    // 3. 60FPS Ultra-Smooth 360° Burst (24 GPU Accelerated Nodes)
    const emojis = ['🎈', '💥', '✨', '🌸', '💖', '🎉', '⚡', '🌟', '🧁', '💘', '⭐', '🎀', '💫', '🥳', '🎊', '🎁'];
    const celebrationColors = [balloonColor, '#ffffff', '#ffd700', '#ff4081', '#00e5ff', '#ab47bc', '#ff9100', '#00e676'];

    const fragment = document.createDocumentFragment();
    const particleNodes = [];

    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      const isEmoji = i % 2 === 0;
      const angle = (i / 24) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const dist = 100 + Math.random() * 180;
      const particleColor = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];

      if (isEmoji) {
        p.style.cssText = `
          position: fixed;
          left: ${centerX}px; top: ${centerY}px;
          font-size: ${20 + Math.random() * 16}px;
          pointer-events: none;
          z-index: 100;
          will-change: transform, opacity;
        `;
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      } else {
        const size = 7 + Math.random() * 9;
        p.style.cssText = `
          position: fixed;
          left: ${centerX}px; top: ${centerY}px;
          width: ${size}px; height: ${size}px;
          background: ${particleColor};
          border-radius: 50%;
          box-shadow: 0 0 10px ${particleColor};
          pointer-events: none;
          z-index: 100;
          will-change: transform, opacity;
        `;
      }

      fragment.appendChild(p);
      particleNodes.push({
        el: p,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 20,
        rotation: (Math.random() - 0.5) * 540,
        scale: Math.random() * 0.5 + 0.5
      });
    }

    container.appendChild(fragment);

    // Fast GSAP GPU Animation (Zero forced reflows!)
    particleNodes.forEach(item => {
      gsap.to(item.el, {
        x: item.x,
        y: item.y,
        rotation: item.rotation,
        scale: 0.15,
        opacity: 0,
        duration: 0.75 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => item.el.remove()
      });
    });
  }

  function spawnFallingConfettiShower(centerX, centerY) {
    const container = document.getElementById('scene-balloons');
    if (!container) return;
    const icons = ['✨', '💖', '🌸', '⭐', '💫', '🎉', '💘', '🧁', '🎈', '🎀'];
    const colors = ['#ff6b9d', '#ffd700', '#00e5ff', '#ab47bc', '#ff4081', '#ffffff'];
    const fragment = document.createDocumentFragment();
    const elementsToRemove = [];

    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'falling-celebration-particle';
      const isEmoji = Math.random() > 0.4;
      const offsetX = (Math.random() - 0.5) * 260;
      const offsetY = (Math.random() - 0.5) * 60;
      const floatDur = 3.5 + Math.random() * 2.2;
      const delay = Math.random() * 0.4;
      const color = colors[Math.floor(Math.random() * colors.length)];

      if (isEmoji) {
        const size = 18 + Math.random() * 18;
        p.style.cssText = `
          left: ${centerX + offsetX}px;
          top: ${centerY + offsetY}px;
          font-size: ${size}px;
          animation-duration: ${floatDur}s;
          animation-delay: ${delay}s;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        `;
        p.innerHTML = icons[Math.floor(Math.random() * icons.length)];
      } else {
        const w = 6 + Math.random() * 6;
        const h = 14 + Math.random() * 16;
        p.style.cssText = `
          left: ${centerX + offsetX}px;
          top: ${centerY + offsetY}px;
          width: ${w}px;
          height: ${h}px;
          background: ${color};
          border-radius: 3px;
          animation-duration: ${floatDur}s;
          animation-delay: ${delay}s;
          box-shadow: 0 0 8px ${color};
        `;
      }
      fragment.appendChild(p);
      elementsToRemove.push(p);
    }

    container.appendChild(fragment);

    setTimeout(() => {
      elementsToRemove.forEach(el => el.remove());
    }, 6000);
  }

  function triggerBalloonConfettiShower() {
    const container = document.getElementById('balloonConfetti');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#ff6b9d', '#ffd700', '#00e5c8', '#ff8c42', '#ffffff', '#a29bfe', '#ff7675', '#00e676'];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 75; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const duration = 1.6 + Math.random() * 2.2;
      const delay = Math.random() * 0.8;
      const width = 10 + Math.random() * 8;
      const height = 8 + Math.random() * 6;

      piece.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${Math.random() * -30}%;
        width: ${width}px;
        height: ${height}px;
        background: ${color};
        border-radius: 3px;
        opacity: 0.9;
        animation: confettiFall ${duration}s linear infinite ${delay}s;
      `;
      fragment.appendChild(piece);
    }
    container.appendChild(fragment);
  }

  let sceneTimer = null;
  const sceneDurations = [
    0, // Scene 0 (Dark Intro): Tap to advance
    0, // Scene 1 (Gift Box & Archery)
    0, // Scene 2 (Cupid Unties): Tap to advance
    0, // Scene 3 (Happy Birthday Hayati Burst): Tap to advance
    0, // Scene 4 (Gourmet Animated SVG Cake)
    0, // Scene 5 (Balloons)
    0, // Scene 6 (Wishes List)
    0  // Scene 7 (Love Letter & Finale)
  ];

  function goToScene(n) {
    if (n < 0 || n >= TOTAL_SCENES) return;
    if (sceneTimer) clearTimeout(sceneTimer);
    if (n !== 7) stopGrandFinaleAmbientLoop();

    scenes[currentScene].classList.remove('active');
    currentScene = n;
    scenes[currentScene].classList.add('active');

    animateSceneText(n);
  }

  function animateSceneText(n) {
    if (n === 0) {
      // Scene 0: Ultra-Luxury Intro Kinetic Entrance
      gsap.killTweensOf(['.intro-badge', '.intro-time-wrap', '.intro-subtitle', '.msg-bubble']);
      gsap.timeline()
        .fromTo('.intro-badge',
          { y: -30, opacity: 0, scale: 0.8, letterSpacing: '1px' },
          { y: 0, opacity: 1, scale: 1, letterSpacing: '4px', duration: 0.7, ease: 'back.out(1.8)' }
        )
        .fromTo('.intro-time-wrap',
          { scale: 0.55, opacity: 0, y: -20, filter: 'blur(10px)' },
          { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'back.out(1.6)' },
          '-=0.45'
        )
        .fromTo('.intro-subtitle',
          { opacity: 0, y: 25, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo('.msg-bubble',
          { scale: 0.75, opacity: 0, y: 30, filter: 'blur(6px)' },
          { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(2)' },
          '-=0.3'
        );
    } else if (n === 1) {
      // Scene 1: Gift Box & Archery
      gsap.timeline()
        .fromTo('.gift-header-tag', { opacity: 0, y: -20, letterSpacing: '1px' }, { opacity: 1, y: 0, letterSpacing: '4px', duration: 0.7 })
        .fromTo('.gift-headline', { opacity: 0, scale: 0.85, y: 25 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.4');
    } else if (n === 2) {
      // Scene 2: Cupid Unties
      gsap.timeline()
        .fromTo('#scene-open .top-pill', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' })
        .fromTo('#scene-open .heart-3d', { scale: 0, opacity: 0, rotate: -20 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.9, ease: 'elastic.out(1.2, 0.4)' }, '-=0.3');
    } else if (n === 3) {
      // Scene 3: Happy Birthday Hayati Burst (MAJOR KINETIC SHOWCASE)
      initConfetti();
      gsap.timeline()
        .fromTo('.hb-main', 
          { scale: 0.3, opacity: 0, rotateX: -65, y: -50, letterSpacing: '-6px', filter: 'blur(12px)' },
          { scale: 1, opacity: 1, rotateX: 0, y: 0, letterSpacing: '4px', filter: 'blur(0px)', duration: 0.9, ease: 'back.out(1.8)' }
        )
        .fromTo('.hb-name',
          { scale: 0.15, opacity: 0, rotate: -14, y: 40, filter: 'blur(20px)' },
          { scale: 1, opacity: 1, rotate: 0, y: 0, filter: 'blur(0px)', duration: 1.15, ease: 'elastic.out(1.25, 0.4)' },
          '-=0.45'
        )
        .fromTo('.hb-from',
          { scale: 0.7, opacity: 0, y: 35, letterSpacing: '1px' },
          { scale: 1, opacity: 1, y: 0, letterSpacing: '6px', duration: 0.75, ease: 'power3.out' },
          '-=0.5'
        );
    } else if (n === 4) {
      // Scene 4: Gourmet Cake (STUNNING KINETIC ENTRANCE)
      const svg = document.getElementById('cakeSvg');
      if (svg && svg.setCurrentTime) {
        try { svg.setCurrentTime(0); } catch(e){}
      }
      gsap.timeline()
        .fromTo('#scene-cake .cake-badge',
          { y: -35, opacity: 0, scale: 0.8, letterSpacing: '0px' },
          { y: 0, opacity: 1, scale: 1, letterSpacing: '3px', duration: 0.75, ease: 'back.out(1.8)' }
        )
        .fromTo('#scene-cake .cake-title',
          { y: 30, opacity: 0, scale: 0.88, filter: 'blur(10px)' },
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.85, ease: 'back.out(1.5)' },
          '-=0.45'
        )
        .fromTo('#scene-cake .cake-subtext',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo('#scene-cake .cake-stage',
          { y: 65, opacity: 0, scale: 0.82 },
          { y: 0, opacity: 1, scale: 1, duration: 0.95, ease: 'back.out(1.35)' },
          '-=0.5'
        );
    } else if (n === 5) {
      // Scene 5: Balloons (STUNNING KINETIC ENTRANCE)
      gsap.timeline()
        .fromTo('#scene-balloons .balloon-badge',
          { y: -30, opacity: 0, scale: 0.85, letterSpacing: '0px' },
          { y: 0, opacity: 1, scale: 1, letterSpacing: '3px', duration: 0.7, ease: 'back.out(1.8)' }
        )
        .fromTo('#scene-balloons .balloon-title',
          { y: 25, opacity: 0, scale: 0.9, filter: 'blur(8px)' },
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
          '-=0.45'
        )
        .fromTo('#scene-balloons .balloon-subtext',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );

      if (currentBalloonIdx === 0 && !document.getElementById('bItem-0').classList.contains('popped')) {
        const cardEl = document.getElementById('balloonReasonCard');
        cardEl.style.display = 'none';
        gsap.set(cardEl, { opacity: 0 });
      }
    } else if (n === 6) {
      // Scene 6: Wishes List (AUTHENTIC POSTAL STAMP IMPACT ANIMATION)
      const cardEl = document.querySelector('.wishes-card');
      const wishItems = document.querySelectorAll('.wish-item');
      const wishStamps = document.querySelectorAll('.wish-delivered');

      gsap.killTweensOf([cardEl, '.wishes-card-title', wishItems, wishStamps]);

      // Initial hidden state
      gsap.set(cardEl, { scale: 0.82, opacity: 0, y: 35 });
      gsap.set('.wishes-card-title', { opacity: 0, y: -15, letterSpacing: '1px' });
      gsap.set(wishItems, { x: -40, opacity: 0 });
      gsap.set(wishStamps, { scale: 2.8, opacity: 0, rotate: 25, filter: 'blur(8px)' });

      const tl = gsap.timeline();
      tl.to(cardEl, { scale: 1, opacity: 1, y: 0, duration: 0.75, ease: 'back.out(1.5)' })
        .to('.wishes-card-title', { opacity: 1, y: 0, letterSpacing: '4px', duration: 0.5 }, '-=0.35');

      wishItems.forEach((item, idx) => {
        const stamp = item.querySelector('.wish-delivered');
        
        // 1. Reveal wish line
        tl.to(item, {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out'
        }, idx === 0 ? '-=0.2' : '-=0.25');

        // 2. SLAM STAMP DOWN!
        tl.to(stamp, {
          scale: 1,
          opacity: 1,
          rotate: idx % 2 === 0 ? -6 : -3,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'back.out(2.8)'
        }, '-=0.15');
      });
    } else if (n === 7) {
      // Scene 7: Love Letter & Grand Celebration (GRAND FINALE EXPLOSION & AMBIENT LOOP)
      triggerGrandFinaleBombBlast();
      triggerLetterConfetti();
      startGrandFinaleAmbientLoop();

      gsap.killTweensOf(['#letterCard', '.letter-title', '.letter-body p']);
      gsap.fromTo('#letterCard',
        { scale: 0.65, opacity: 0, y: 55, rotateX: -30 },
        { scale: 1, opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'back.out(1.8)' }
      );
      gsap.fromTo('.letter-title',
        { opacity: 0, y: -18, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.25, ease: 'back.out(2)' }
      );
      gsap.fromTo('.letter-body p',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.35 }
      );
    }
  }

  // GRAND FINALE FIREWORKS & BOMB BLAST ENGINE
  let finaleCanvas = null;
  let finaleCtx = null;
  let finaleParticles = [];
  let finaleAnimId = null;

  function initGrandFinaleCanvas() {
    finaleCanvas = document.getElementById('grandFinaleCanvas');
    if (!finaleCanvas) return;
    finaleCtx = finaleCanvas.getContext('2d');
    
    function resizeCanvas() {
      if (!finaleCanvas) return;
      finaleCanvas.width = window.innerWidth;
      finaleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function createFireworkExplosion(x, y, particleCount = 35, colorTheme = 'gold') {
    if (!finaleCtx || !finaleCanvas) return;

    const palette = [
      '#ffd700', '#ff3b75', '#00e5c8', '#a29bfe', '#ff7675', 
      '#ffffff', '#ff9100', '#e040fb', '#00e676', '#ff1744'
    ];

    // Limit active particles to prevent lag
    if (finaleParticles.length > 140) {
      finaleParticles.splice(0, 40);
    }

    // Add Shockwave Ring Particle
    finaleParticles.push({
      type: 'shockwave',
      x: x,
      y: y,
      radius: 4,
      maxRadius: 140 + Math.random() * 50,
      color: colorTheme === 'gold' ? '#ffd700' : '#ff3b75',
      alpha: 1,
      lineWidth: 5
    });

    // Add Sparks
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      const size = 2.5 + Math.random() * 3.5;
      const color = palette[Math.floor(Math.random() * palette.length)];

      finaleParticles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.1,
        friction: 0.95,
        size: size,
        color: color,
        alpha: 1,
        decay: 0.018 + Math.random() * 0.02
      });
    }

    // Lightweight Floating Emojis (4 per blast)
    const emojis = ['💥', '✨', '💖', '⭐', '🎆', '🌹'];
    for (let i = 0; i < 4; i++) {
      const p = document.createElement('div');
      p.className = 'bomb-blast-emoji';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.fontSize = `${20 + Math.random() * 18}px`;
      document.body.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 100;
      const targetX = Math.cos(angle) * dist;
      const targetY = Math.sin(angle) * dist - 25;

      gsap.fromTo(p,
        { scale: 0.2, opacity: 1, x: 0, y: 0 },
        {
          x: targetX,
          y: targetY,
          scale: 1.3,
          opacity: 0,
          duration: 0.9 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => p.remove()
        }
      );
    }
  }

  function renderGrandFinaleAnimation() {
    if (!finaleCtx || !finaleCanvas) return;
    finaleCtx.clearRect(0, 0, finaleCanvas.width, finaleCanvas.height);
    
    // Enable GPU Blend Mode for super glowing fireworks without shadowBlur CPU overhead!
    finaleCtx.globalCompositeOperation = 'lighter';

    for (let i = finaleParticles.length - 1; i >= 0; i--) {
      const p = finaleParticles[i];

      if (p.type === 'shockwave') {
        p.radius += (p.maxRadius - p.radius) * 0.14;
        p.alpha -= 0.045;
        p.lineWidth *= 0.94;

        if (p.alpha <= 0) {
          finaleParticles.splice(i, 1);
          continue;
        }

        finaleCtx.save();
        finaleCtx.globalAlpha = Math.max(0, p.alpha);
        finaleCtx.beginPath();
        finaleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        finaleCtx.strokeStyle = p.color;
        finaleCtx.lineWidth = Math.max(0.5, p.lineWidth);
        finaleCtx.stroke();
        finaleCtx.restore();

      } else if (p.type === 'spark') {
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          finaleParticles.splice(i, 1);
          continue;
        }

        finaleCtx.save();
        finaleCtx.globalAlpha = Math.max(0, p.alpha);
        finaleCtx.beginPath();
        finaleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        finaleCtx.fillStyle = p.color;
        finaleCtx.fill();
        finaleCtx.restore();
      }
    }

    if (finaleParticles.length > 0) {
      finaleAnimId = requestAnimationFrame(renderGrandFinaleAnimation);
    } else {
      finaleAnimId = null;
      finaleCtx.clearRect(0, 0, finaleCanvas.width, finaleCanvas.height);
    }
  }

  function triggerGrandFinaleBombBlast() {
    initGrandFinaleCanvas();
    finaleParticles = [];

    const flash = document.getElementById('grandFinaleFlash');
    if (flash) {
      gsap.killTweensOf(flash);
      gsap.fromTo(flash, 
        { opacity: 0.8 }, 
        { opacity: 0, duration: 0.5, ease: 'power2.out' }
      );
    }

    // Smooth card scale pop without expensive CSS filter re-renders
    gsap.killTweensOf('#scene-letter');
    gsap.fromTo('#scene-letter',
      { scale: 1.03 },
      { scale: 1, duration: 0.5, ease: 'power2.out' }
    );

    const width = window.innerWidth || 1000;
    const height = window.innerHeight || 800;

    const blastPoints = [
      { x: width * 0.5, y: height * 0.38 }, // Center
      { x: width * 0.25, y: height * 0.25 }, // Left
      { x: width * 0.75, y: height * 0.25 }, // Right
      { x: width * 0.5, y: height * 0.65 }   // Bottom
    ];

    blastPoints.forEach((pt, index) => {
      setTimeout(() => {
        createFireworkExplosion(pt.x, pt.y, 35, index % 2 === 0 ? 'gold' : 'pink');
        if (!finaleAnimId) {
          renderGrandFinaleAnimation();
        }
      }, index * 120);
    });
  }

  function triggerLetterConfetti(e) {
    if (e) e.stopPropagation();
    triggerGrandFinaleBombBlast();
    const container = document.getElementById('letterConfetti');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#ff6b9d', '#ffd700', '#00e5c8', '#ff8c42', '#ffffff', '#a29bfe'];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const duration = 2.0 + Math.random() * 2.0;
      const delay = Math.random() * 0.5;
      const width = 10 + Math.random() * 6;
      const height = 8 + Math.random() * 5;

      piece.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${Math.random() * -20}%;
        width: ${width}px;
        height: ${height}px;
        background: ${color};
        border-radius: 3px;
        opacity: 0.95;
        will-change: transform;
        animation: confettiFall ${duration}s linear 1 ${delay}s forwards;
      `;
      fragment.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
    }
    container.appendChild(fragment);
  }

  let finaleAmbientTimer = null;

  function startGrandFinaleAmbientLoop() {
    stopGrandFinaleAmbientLoop();

    // Loop every 2.8 seconds: Shoot a mini fireworks blast + gentle confetti drop!
    finaleAmbientTimer = setInterval(() => {
      if (currentScene !== 7) {
        stopGrandFinaleAmbientLoop();
        return;
      }

      const width = window.innerWidth || 1000;
      const height = window.innerHeight || 800;

      const rx = width * (0.15 + Math.random() * 0.7);
      const ry = height * (0.15 + Math.random() * 0.45);
      const color = Math.random() > 0.5 ? 'gold' : 'pink';

      createFireworkExplosion(rx, ry, 22, color);
      if (!finaleAnimId) {
        renderGrandFinaleAnimation();
      }

      spawnAmbientConfetti();
    }, 2800);
  }

  function stopGrandFinaleAmbientLoop() {
    if (finaleAmbientTimer) {
      clearInterval(finaleAmbientTimer);
      finaleAmbientTimer = null;
    }
  }

  function spawnAmbientConfetti() {
    const container = document.getElementById('letterConfetti');
    if (!container || currentScene !== 7) return;

    const colors = ['#ff6b9d', '#ffd700', '#00e5c8', '#ff8c42', '#ffffff', '#a29bfe'];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 5; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const duration = 2.5 + Math.random() * 2.0;

      piece.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: -15px;
        width: ${8 + Math.random() * 6}px;
        height: ${7 + Math.random() * 5}px;
        background: ${color};
        border-radius: 3px;
        opacity: 0.9;
        will-change: transform;
        animation: confettiFall ${duration}s linear 1 forwards;
      `;
      fragment.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + 0.5) * 1000);
    }
    container.appendChild(fragment);
  }

  // Interactive tap on wish items to re-stamp badge
  document.querySelectorAll('.wish-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const stamp = item.querySelector('.wish-delivered');
      if (stamp) {
        gsap.fromTo(stamp, 
          { scale: 1.8, rotate: 15, filter: 'blur(3px)' }, 
          { scale: 1, rotate: -5, filter: 'blur(0px)', duration: 0.38, ease: 'back.out(3)' }
        );
      }
    });
  });

  // Interactive Candle Blow Out & Wish Reveal
  let isCandleBlown = false;

  function onCakeTap(e) {
    if (e) e.stopPropagation();

    // Elastic Bounce & Squish Animation
    const svg = document.getElementById('cakeSvg');
    if (svg) {
      gsap.timeline()
        .to(svg, { scale: 1.12, rotation: -3, duration: 0.12, ease: 'power1.out' })
        .to(svg, { scale: 1, rotation: 0, duration: 0.45, ease: 'elastic.out(1.2, 0.4)' });
    }

    const fuegos = document.querySelectorAll('#scene-cake .fuego');
    const subtext = document.querySelector('#scene-cake .cake-subtext');

    if (!isCandleBlown) {
      isCandleBlown = true;

      // 1. Extinguish candle flame
      fuegos.forEach(f => f.classList.add('extinguished'));

      // 2. Spawn smoke particle effect
      const candleEl = document.getElementById('cakeCandle');
      if (candleEl) {
        for (let i = 0; i < 6; i++) {
          const smoke = document.createElement('div');
          smoke.className = 'smoke-particle';
          smoke.style.left = (50 + (Math.random() * 20 - 10)) + '%';
          smoke.style.animationDelay = (i * 0.15) + 's';
          candleEl.appendChild(smoke);
          setTimeout(() => smoke.remove(), 2000);
        }
      }

      // 3. Trigger festive sparkler & cake particles!
      triggerCakeSparklers();
      burstCakeParticles();

      // 4. Update subtext
      if (subtext) {
        subtext.innerHTML = "✨ Wish made! Candle blown out! Tap anywhere to continue 💖";
        subtext.style.color = "#f03e7b";
      }
    } else {
      // Tap again advances to next scene (Balloons)
      goToScene(5);
    }
  }

  function triggerCakeSparklers() {
    const emojis = ['✨', '💖', '⭐', '🌸', '🎉', '💫', '🎂'];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'falling-celebration-particle';
      p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = (20 + Math.random() * 60) + '%';
      p.style.top = (40 + Math.random() * 30) + '%';
      p.style.fontSize = (16 + Math.random() * 24) + 'px';
      p.style.animationDuration = (2 + Math.random() * 2.5) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4500);
    }
  }

  // Explicit Tap / Click to advance pages
  document.addEventListener('click', (e) => {
    // Ignore clicks on interactive elements: gift box, archery bow, cake stage, candle, balloon bow, balloon items, wish items, buttons
    if (e.target.closest('#gift-box-el') || e.target.closest('#archeryRig') || e.target.closest('.cake-stage') || e.target.closest('#cakeSvg') || e.target.closest('#cakeCandle') || e.target.closest('.velas') || e.target.closest('#balloonBowWrap') || e.target.closest('.balloon-item') || e.target.closest('.wishes-next-btn') || e.target.closest('.celebrate-again-btn') || e.target.closest('.open-btn') || e.target.closest('button')) return;

    if (currentScene === 1) {
      // Do NOT auto advance on background tap in Scene 1 — user must tap gift box then bow
      return;
    }

    if (currentScene === 5) {
      // On Scene 6 (Balloons, index 5), tap background shoots next balloon until all 5 are popped
      if (currentBalloonIdx < 5) {
        shootCurrentBalloon();
        return;
      }
    }

    if (currentScene < TOTAL_SCENES - 1) {
      goToScene(currentScene + 1);
    }
  });

  // Start at intro scene
  goToScene(0);