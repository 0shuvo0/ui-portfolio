import './styles/global.scss'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

// Conditionally import heavier components
const isTouchDevice = navigator.maxTouchPoints > 0
const isLowEndDevice = checkLowEndDevice()

// Register only the plugins we'll use
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip)

// Optional imports based on device capability
initScrollSmoother()

  
initSplitTextAnimations()

// Detect low-end devices (basic heuristics)
function checkLowEndDevice() {
  // Check for older/slower devices
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4
  const slowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

  return lowMemory || slowCPU || isTouchDevice
}

// Initialize scroll smoother only for higher-end devices
function initScrollSmoother() {
  ScrollTrigger.normalizeScroll(!isLowEndDevice)
  
  let smoother = ScrollSmoother.create({
    smooth: 2,
    effects: !isTouchDevice && !isLowEndDevice
  })
  
  smoother.paused(true)
  
  // Store in window for access from other functions
  window.smoother = smoother
}

// Initialize text split animations
function initSplitTextAnimations() {
  // Setup other split text elements
  window.addEventListener('load', () => {
    // Reduced timeout for faster loading experience
    setTimeout(initLoadingAnimations, 200)
  })
}

// Loading animations initialization
function initLoadingAnimations() {
  const enterBtn = document.getElementById("enter-site-btn")
  const enterBtnSplit = new SplitText(enterBtn, { type: 'chars'}).chars


  gsap.set(enterBtnSplit, {opacity: 0})
  gsap.set("#enter-site-btn svg", {opacity: 0})

  const tl = gsap.timeline()
    tl.to(".lds-ripple", {
      scale: .75,
      opacity: 0,
      duration: .5
    })
    tl.set(enterBtn, { opacity:  1})
    tl.fromTo(enterBtnSplit, {
        translateY: 30,
        opacity: 0,
        clipPath: 'polygon(0% 0%, 100% 0, 100% 0%, 0% 0%)'
      } , {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        translateY: 0,
        opacity: 1,
      
        duration: .35,
        stagger: .05
    })
    tl.fromTo("#enter-site-btn svg", {
      opacity: 0,
    }, {
      opacity: 1,
      duration: .5,
      ease: 'power1.out'
    })
}

function openFullscreen() {
  const elem = document.documentElement;
  
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

// Track hero animation completion
let heroInComplete = false

// Enter site button click handler
const enterBtn = document.getElementById("enter-site-btn")
const fullPageOverLay = document.querySelector(".loading-overlay.fixed")
const heroSection = document.querySelector('.section#hero')
const heroImage = heroSection?.querySelector('#hero-image')

enterBtn.addEventListener('click', () => {
  gsap.set("#page-wrapper", { autoAlpha: 1})

  gsap.to(fullPageOverLay, {
    scale: 2,
    opacity: 0,
    duration: 1,
    onComplete: () => fullPageOverLay.remove()
  })

  gsap.set(".hero-title .creative, .hero-title .developer", { display: 'inline-block' })
  
  
  gsap.fromTo(".hero-title .creative", {
    xPercent: 100,
  }, {
    xPercent: 0,
    duration: 1.5,
    ease: 'power1.out'
  })
  
  gsap.fromTo(".hero-title .developer", {
    xPercent: -100,
  }, {
    xPercent: 0,
    duration: 1.5,
    ease: 'power1.out'
  })
  
  gsap.fromTo(heroImage, {
    yPercent: 20,
    scale: 0.9,
    opacity: 0,
  }, {
    yPercent: 0,
    scale: 1,
    opacity: 1,
    duration: 1.5,
    ease: 'power2.out',
    onComplete: () => heroInComplete = true
    })
  
  // Start scrolling effects if smoother is available
  if (window.smoother) {
    window.smoother.paused(false)
  }
})

const magneticElements = [...document.querySelectorAll('.magnetic')]
!isTouchDevice && magneticElements.forEach(el => {
  const xTo = gsap.quickTo(el, "x", {duration: .3, ease: "elastic.out (1, 0.3)"})
  const yTo = gsap.quickTo(el, "y", {duration: .1, ease: "elastic.out (1, 0.3)"})

  const strength = parseFloat(el.getAttribute('data-magnet') || 1)
  el.addEventListener('mousemove', e => {
    const {clientX, clientY } = e;
    const {width, height, left, top} = el.getBoundingClientRect()

    const x = clientX - (left + width / 2) 
    const y = clientY - (top + height / 2) 
    xTo(x * strength)
    yTo(y * strength * 1.5)
  })

  el.addEventListener('mouseleave', e => {
    xTo(0)
    yTo(0)
  })
});


// Hero section animations - optimize for low-end devices
if (heroImage) {
  if (!isLowEndDevice) {
    gsap.fromTo(heroImage, {
      scale: 1
    },{
      scale: 1.5, // Reduced scale factor for better performance
      scrollTrigger:{
        scrub: 1
      }
    })
  }

  gsap.set(heroImage, { 
    yPercent: isLowEndDevice ? 0 : 20,
    scale: isLowEndDevice ? 1 : 0.9,
    opacity: 0,
  })

  // Optimize mousemove event with throttling
  let lastMoveTime = 0
  const moveThrottleDelay = isLowEndDevice ? 100 : 30
  
  heroSection.addEventListener('mousemove', (e) => {
    if (!heroInComplete) return
    
    const now = Date.now()
    if (now - lastMoveTime < moveThrottleDelay) return
    lastMoveTime = now
    
    const { clientX, clientY } = e
    const { offsetWidth, offsetHeight } = heroSection

    const x = (clientX - offsetWidth / 2) / offsetWidth
    const y = (clientY - offsetHeight / 2) / offsetHeight

    // Reduced movement factor for better performance
    const factor = isLowEndDevice ? 2 : 4

    gsap.to(heroImage, {
      left: 50 + x * factor + '%',
      top: 50 + y * factor * 1.5 + '%',
      duration: 0.5,
      ease: 'power1.out'
    })
  })

  // Only add these more intensive animations for higher-end devices
  if (!isLowEndDevice) {
    gsap.fromTo(".hero-title .creative", {
      xPercent: 0
    },{
      xPercent: -100,
      scrollTrigger:{
        scrub: 1
      }
    }) 

    gsap.fromTo(".hero-title .developer",{
      xPercent: 0
    }, {
      xPercent: 100,
      scrollTrigger:{
        scrub: 1
      }
    })
  }
}

// Init sections based on device capability
if (document.querySelector(".section#intro")) {
  initIntroSection()
}

if (document.querySelector(".section#skills")) {
  initSkillsSection()
}

if (document.querySelector(".section#projects")) {
  initProjectsSection()
}

// Intro section animations - optimized
function initIntroSection() {
  const introSection = document.querySelector(".section#intro")
  const introSectionCursor = introSection.querySelector(".custom-cursor")

  gsap.from(introSection, {
    backgroundSize: "100% 150%",
    scrollTrigger: {
      start: "top bottom",
      scrub: true
    }
  })

  // Only apply these intensive animations on higher-end devices
  if (!isLowEndDevice && SplitText) {
    const aboutHighlightsSplits = new SplitText(".about-text .highlight", { type: 'chars' }).chars
    gsap.from(aboutHighlightsSplits, {
      y: 10,
      duration: 0.1,
      scale: 0.5,
      opacity: 0,
      stagger: 0.05,
      scrollTrigger: {
        trigger: introSection,
        start: "top center"
      }
    })
  } else {
    // Simplified animation for low-end devices
    gsap.from(".about-text .highlight", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      scrollTrigger: {
        trigger: introSection,
        start: "top center"
      }
    })
  }

  // Optimize cursor movement with throttling
  if (introSectionCursor) {
    let lastCursorTime = 0
    const cursorThrottleDelay = isLowEndDevice ? 100 : 30
    
    introSection.addEventListener('mousemove', (e) => {
      const now = Date.now()
      if (now - lastCursorTime < cursorThrottleDelay) return
      lastCursorTime = now
      
      const { clientX, clientY } = e
      const { left, top, width, height } = introSection.getBoundingClientRect()

      const x = ((clientX - left) / width) * 100
      const y = ((clientY - top) / height) * 100

      gsap.to(introSectionCursor, {
        left: x.toFixed(1) + '%',
        top: y.toFixed(1) + '%',
        duration: 0.3, // Reduced duration
        ease: 'power1.out'
      })
    })
  }
}

// Skills section animations - optimized
function initSkillsSection() {
  const skillsSection = document.querySelector(".section#skills")
  
  gsap.from(skillsSection, {
    backgroundSize: "150% 100%",
    scrollTrigger: {
      start: "top bottom",
      scrub: true
    }
  })

  // Only apply these intensive animations on higher-end devices
  if (!isLowEndDevice && SplitText) {
    const skillsTitleSplit = new SplitText(".skills-title", { type: 'chars' }).chars

    gsap.from(skillsTitleSplit, {
      duration: 0.8, // Reduced duration
      opacity: 0,
      scale: 0,
      x: 100,
      ease: "back",
      stagger: 0.1, // Reduced stagger
      scrollTrigger: {
        start: 'center bottom',
        trigger: ".section#skills"
      }
    })

    // Only apply the most intensive effects on high-end devices
    if (!isTouchDevice) {
      const skillsInfoSplit = new SplitText(".skills-info.desktop", { type: 'words,chars' }).chars
      
      gsap.set(".skills-info.desktop", { perspective: 400 })
      gsap.from(skillsInfoSplit, {
        duration: 0.6, // Reduced duration
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: "0% 50% -50",
        ease: "back",
        stagger: 0.005, // Reduced stagger
        delay: 0.5, // Reduced delay
        scrollTrigger: {
          start: 'top bottom',
          trigger: ".section#skills"
        }
      })
    } else {
      // Simpler animation for touch devices
      gsap.from(".skills-info.desktop", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          start: 'top bottom',
          trigger: ".section#skills"
        }
      })
    }
  } else {
    // Simple animations for low-end devices
    gsap.from(".skills-title", {
      opacity: 0,
      x: 50,
      duration: 0.8,
      scrollTrigger: {
        start: 'center bottom',
        trigger: ".section#skills"
      }
    })
    
    gsap.from(".skills-info.desktop", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: 0.3,
      scrollTrigger: {
        start: 'top bottom',
        trigger: ".section#skills"
      }
    })
  }

  // Optimized slider animation
  gsap.to(".skills-slider", {
    scrollTrigger: {
      trigger: ".skills-slider",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
    rotateY: isLowEndDevice ? 360 : 720, // Reduced rotation for low-end devices
    ease: "ease"
  })
  
  // Apply lag effects only if smoother is available and device is high-end
  if (window.smoother && !isLowEndDevice) {
    window.smoother.effects('.skill-item', {
      lag: i => i / 8 // Reduced lag effect
    })
  }

  // Optimize skill item mouse movement
  if (!isLowEndDevice) {
    let lastSkillsTime = 0
    const skillsThrottleDelay = isLowEndDevice ? 150 : 50
    
    skillsSection.addEventListener('mousemove', (e) => {
      const now = Date.now()
      if (now - lastSkillsTime < skillsThrottleDelay) return
      lastSkillsTime = now
      
      const { clientX, clientY } = e
      const { offsetWidth, offsetHeight } = skillsSection

      const x = (clientX - offsetWidth / 2) / offsetWidth
      const y = (clientY - offsetHeight / 2) / offsetHeight

      // Reduced movement factor
      const factor = isLowEndDevice ? 20 : 40

      gsap.to('.skill-item img', {
        x: i => x * factor * (i / 5),
        y: i => y * factor * (i / 5),
        duration: 0.3,
        ease: 'power1.out'
      })
    })
  }
}

// Projects section animations - optimized
function initProjectsSection() {
  const projectsSection = document.querySelector(".section#projects")
  
  gsap.from(projectsSection, {
    backgroundSize: "100% 150%",
    scrollTrigger: {
      start: "top bottom",
      scrub: true
    }
  })

  // Apply title animations based on device capability
  if (!isLowEndDevice && SplitText) {
    const projectsTitleSplit = new SplitText(".projects-title", {type: 'chars'}).chars
    
    gsap.fromTo(projectsTitleSplit, {
      translateY: 80,
      opacity: 0,
      clipPath: 'polygon(0% 0%, 100% 0, 100% 0%, 0% 0%)'
    }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      translateY: 0,
      opacity: 1,
      duration: 0.8, // Reduced duration
      stagger: 0.1, // Reduced stagger
      scrollTrigger: {
        trigger: ".projects-title",
        start: "top center"
      }
    })
  } else {
    // Simple animation for low-end devices
    gsap.from(".projects-title", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".projects-title",
        start: "top center"
      }
    })
  }

  // Project items and image setup
  const projectItemsContainer = document.querySelector('.projects-list')
  if (!projectItemsContainer) return
  
  const projectItems = [...projectItemsContainer.querySelectorAll('.list-item')]
  const projectImageWrapper = document.querySelector(".projects-img")
  if (!projectImageWrapper) return
  
  const projectImageContainer = projectImageWrapper.querySelector(".img")
  const projectImageContainerOriginalImg = document.querySelector(".projects-img .img .original")

  // Project data
  const projects = [
    {
      name: 'My Agreements',
      description: 'My Agreements is a platrom where users can create and manage agreement and invite others people to sign the agreement.',
      url: 'https://my-agreements.com/'
    },
    {
      name: 'Pic Magic',
      description: 'AI based image alteration tool that allows users to manipulate images just by speaking to it. It uses advanced AI algorithms to understand the user\'s voice commands and apply the desired changes to the image.',
      url: 'https://picmagic.art/'
    },
    {
      name: 'Rate My Physique',
      description: 'Rate My Physique is an AI powered physique rating app. Simply upload your photo and it will use AI to analyze your physique and professionally rate it.',
      url: 'https://ratemyphysique.app/'
    },
  ]

  // Handle project item clicks
  projectItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      const copyImg = item.querySelector(".project-copy-image")
      if (!copyImg || !projectImageContainer) return
      
      // Use simpler animation for low-end devices
      if (isLowEndDevice) {
        projectImageContainerOriginalImg.src = copyImg.src
        updateProjectText(projects[idx])
        return
      }
      
      // Full Flip animation for higher-end devices
      const state = Flip.getState(copyImg)
      projectImageContainer.appendChild(copyImg)

      if (!projectImageWrapper.classList.contains('animating')) {
        projectImageWrapper.classList.add('animating')
      }
      
      projectItemsContainer.style['pointer-events'] = 'none'

      Flip.from(state, {
        duration: 0.8, // Reduced duration
        onComplete: () => {
          projectImageContainerOriginalImg.src = copyImg.src
          setTimeout(() => {
            item.appendChild(copyImg)
            projectImageWrapper.classList.remove('animating')
            projectItemsContainer.style['pointer-events'] = 'all'
          }, 300)
        }
      })

      updateProjectText(projects[idx])
    })
  })
}

// Update project text with optimizations
function updateProjectText(project) {
  if (!project) return
  
  const projectTitle = document.querySelector(".project-title")
  const projectDescription = document.querySelector(".project-description")
  const projectLink = document.querySelector(".project-link")
  
  if (!projectTitle || !projectDescription || !projectLink) return
  
  // Update project details
  projectTitle.innerHTML = project.name
  projectDescription.innerHTML = project.description
  projectLink.setAttribute('href', project.url)

  // Apply animations based on device capability
  if (!isLowEndDevice && SplitText) {
    const newTitleSplits = new SplitText(projectTitle, {type: 'chars'}).chars
    const newDescriptionSplits = new SplitText(projectDescription, {type: 'chars'}).chars

    const newTl = gsap.timeline()
    newTl.from(newTitleSplits, {
      translateY: 30,
      opacity: 0,
      scale: 0,
      duration: 0.4, // Reduced duration
      stagger: -0.03 // Reduced stagger
    })
    
    newTl.from(newDescriptionSplits, {
      translateX: -10,
      opacity: 0,
      scale: 0,
      duration: 0.2, // Reduced duration
      stagger: 0.002 // Reduced stagger
    }, "-=0.1")
  } else {
    // Simple animation for low-end devices
    const newTl = gsap.timeline()
    newTl.from(projectTitle, {
      y: 20,
      opacity: 0,
      duration: 0.4
    })
    
    newTl.from(projectDescription, {
      x: -10,
      opacity: 0,
      duration: 0.4
    }, "-=0.2")
  }
}






//Contact section
import ThreeScene from './scripts/threeScene'

window.addEventListener('load', () => {
  const contactSection = document.querySelector(".section#contact")
  const contactSectionLoader = contactSection.querySelector(".loading-overlay.main")
  const contactSceneCanvas = document.getElementById('cantact-canvas')

  const contactScene = new ThreeScene({
    canvas: contactSceneCanvas,
    environmentMap: '/contact-scene-environment.hdr',
    background: window.innerWidth > 768 ? '/contact-scene-bg.png' : '/contact-scene-bg-vertical.png',
    model: '/contact-scene-model.obj',
    font: '/Poppins_Bold.json',
    text: 'Lets Connect',
    text_color: 0xffffff
  })
  
  

  contactScene.loadAssets({
    onComplete: () => {
      contactScene.run()

      const scrollTriggerConfig = {
        trigger: contactSection,
        start: 'top bottom',
        scrub: true
      };
      if(!isTouchDevice){
        gsap.fromTo(contactScene.camera.position, {
          z: 10,
          }, {
            z: 5,
            scrollTrigger: scrollTriggerConfig,
            onUpdate: () => contactScene.run()
        })
      }

      window.addEventListener('resize', () => contactScene.handleResize())

      contactSectionLoader.remove()

        
      if(isTouchDevice) return
      
      contactSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e
        const { offsetWidth, offsetHeight } = heroSection
  
        const _x = ((clientX - offsetWidth / 2) / offsetWidth) * 2
        const _y = ((clientY - offsetHeight / 2) / offsetHeight) * 2
  
        const rotationFactor = .5
  
        const rx = (_x * rotationFactor).toFixed(4)
        const ry = (_y * rotationFactor).toFixed(4)
  
        contactScene.model.rotation.x = ry
        contactScene.model.rotation.y = rx
  
        contactScene.run()
      })
    }
  })
})