import './styles/global.scss'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

import ThreeScene from './scripts/threeScene'
// import ParticleEffect from './scripts/partifleEffect'

// import { ScrollSmoother } from 'gsap/ScrollSmoother'
// import { SplitText } from 'gsap/SplitText'


const isTouchDevice = navigator.maxTouchPoints > 0


gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip)

ScrollTrigger.normalizeScroll(true)


let smoother = ScrollSmoother.create({
  smooth: 2,
  effects: !isTouchDevice
})


smoother.paused(true)


const enterBtn = document.getElementById("enter-site-btn")
const enterBtnSplit = new SplitText(enterBtn, { type: 'chars'}).chars


gsap.set(enterBtnSplit, {opacity: 0})
gsap.set("#enter-site-btn svg", {opacity: 0})

const fullPageOverLay = document.querySelector(".loading-overlay.fixed")
window.addEventListener('load', () => {
  setTimeout(() => {
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
  }, 300)
  
})

function openFullscreen() {
  const elem = document.documentElement; // Fullscreen the whole page

  if (elem.requestFullscreen) {
      elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Edge, Opera
      elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
  }
}

let heroInCcomplete = false
enterBtn.addEventListener('click', () => {
  // openFullscreen()
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
    duration: 2,
    ease: 'power1.out'
  })
  gsap.fromTo(".hero-title .developer", {
    xPercent: -100,
  }, {
    xPercent: 0,
    duration: 2,
    ease: 'power1.out'
  })

  gsap.fromTo(heroImage, {
    yPercent: 20,
    scale: .9,
    opacity: 0,
  }, {
    yPercent: 0,
    scale: 1,
    opacity: 1,
    duration: 2,
    ease: 'power2.out',
    onComplete: () => {
      heroInCcomplete = true
    }
  })
  smoother.paused(false)
})







const magneticElements = [...document.querySelectorAll('.magnetic')]
magneticElements.forEach(el => {
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
})




//Hero section animations
const heroSection = document.querySelector('.section#hero')
const heroImage = heroSection.querySelector('#hero-image')

// new ParticleEffect(heroSection.querySelector('#particles-canvas'))

gsap.fromTo(heroImage,  {
  scale: 1
},{
  scale: 2,
  scrollTrigger:{
    scrub: 1
  }
})


gsap.set(heroImage, { 
  yPercent: 20,
  scale: .9,
  opacity: 0,
})

heroSection.addEventListener('mousemove', (e) => {
  if(!heroInCcomplete) return
  const { clientX, clientY } = e
  const { offsetWidth, offsetHeight } = heroSection

  const x = (clientX - offsetWidth / 2) / offsetWidth
  const y = (clientY - offsetHeight / 2) / offsetHeight

  const factor = 5

  //slightly move the image

  gsap.to(heroImage, {
    left: 50 + x * factor + '%',
    top: 50 + y * factor * 1.5 + '%',
    duration: .5,
    ease: 'power1.out'
  })
  
})

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






//Intro section animations
const introSection = document.querySelector(".section#intro")
const introSectionCursor = introSection.querySelector(".custom-cursor")

gsap.from(introSection, {
  backgroundSize: "100% 150%",
  scrollTrigger: {
    start: "top bottom",
    scrub: true
  }
})

const aboutHighlightsSplits = new SplitText(".about-text .highlight", { type: 'chars' }).chars
gsap.from(aboutHighlightsSplits, {
  y: 10,
  duration: .1,
  scale: .5,
  opacity: 0,
  stagger: .05,
  scrollTrigger: {
    trigger: introSection,
    start: "top center"
  }
})

introSection.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const { left, top, width, height } = introSection.getBoundingClientRect();

  const x = ((clientX - left) / width) * 100;
  const y = ((clientY - top) / height) * 100;

  gsap.to(introSectionCursor, {
    left: x.toFixed(1) + '%',
    top: y.toFixed(1) + '%',
    duration: 0.5,
    ease: 'power1.out'
  });
});





//Skills section animations
const skillsSection = document.querySelector(".section#skills")
gsap.from(skillsSection, {
  backgroundSize: "150% 100%",
  scrollTrigger: {
    start: "top bottom",
    scrub: true
  }
})


const skillsInfoSplit = new SplitText(".skills-info.desktop", { type: 'words,chars' }).chars
const skillsTitleSplit = new SplitText(".skills-title", { type: 'chars' }).chars

gsap.from(skillsTitleSplit, {
  duration: 1,
  opacity: 0,
  scale: 0,
  x: 100,
  ease: "back",
  stagger: 0.15,
  scrollTrigger: {
    start: 'center bottom',
    trigger: ".section#skills"
  }
})

gsap.set(".skills-info.desktop", { perspective: 400 });
gsap.from(skillsInfoSplit, {
  duration: 0.8,
  opacity: 0,
  scale: 0,
  y: 80,
  rotationX: 180,
  transformOrigin: "0% 50% -50",
  ease: "back",
  stagger: 0.01,
  delay: 1,
  scrollTrigger: {
    start: 'top bottom',
    trigger: ".section#skills"
  }
})

gsap.to(".skills-slider", {
  scrollTrigger: {
      trigger: ".skills-slider",
      start: "top bottom",  // When the element enters the viewport
      end: "bottom top",    // When the element exits the viewport
      scrub: 1,          // Enables smooth scrolling effect
  },
  rotateY: 720,  // Same as CSS animation
  // perspective: "1000px", // Apply perspective
  ease: "ease"
})
smoother.effects('.skill-item', {
  lag: i => i / 4
})
skillsSection.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e
  const { offsetWidth, offsetHeight } = heroSection

  const x = (clientX - offsetWidth / 2) / offsetWidth
  const y = (clientY - offsetHeight / 2) / offsetHeight

  const factor = 50

  //slightly move the image
  gsap.to('.skill-item img', {
    x: i =>  x * factor * 2 * (i / 5),
    y: i =>  y * factor * 2 * (i / 5),
    // top: 50 + y * factor * 1.5 + '%',
    duration: .5,
    ease: 'power1.out'
  })
})






//Projects section animations
const projectsSection = document.querySelector(".section#projects")
gsap.from(projectsSection, {
  backgroundSize: "100% 150%",
  scrollTrigger: {
    start: "top bottom",
    scrub: true
  }
})

const projectsTitleSplit = new SplitText(".projects-title", {type: 'chars'}).chars
gsap.fromTo(projectsTitleSplit, {
    translateY: 80,
    opacity: 0,
    clipPath: 'polygon(0% 0%, 100% 0, 100% 0%, 0% 0%)'
  } , {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    translateY: 0,
    opacity: 1,

    duration: 1,
    stagger: .15,
    scrollTrigger: {
      trigger: ".projects-title",
      start: "top center"
    }
  }
)



const projectItemsContainer = document.querySelector('.projects-list')
const projectItems = [...projectItemsContainer.querySelectorAll('.list-item')]
const ProjectImageWrapper = document.querySelector(".projects-img")
const projectImageCotainer = ProjectImageWrapper.querySelector(".img")
const projectImageCotainerOriginalImg = document.querySelector(".projects-img .img .original")


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
projectItems.forEach((item, idx) => {
  item.addEventListener('click', () => {


    const copyImg = item.querySelector(".project-copy-image")
    const state = Flip.getState(copyImg)

    projectImageCotainer.appendChild(copyImg)

    if(!ProjectImageWrapper.classList.contains('animating')) ProjectImageWrapper.classList.add('animating')
    projectItemsContainer.style['pointer-events'] = 'none'

    Flip.from(state, {
      duration: 1,
      // scale: true,
      onComplete: () => {
        projectImageCotainerOriginalImg.src = copyImg.src
        setTimeout(() => {
          item.appendChild(copyImg)
          ProjectImageWrapper.classList.remove('animating')
          projectItemsContainer.style['pointer-events'] = 'all'
        }, 300)
      }
    })

    updateProjectText(projects[idx])
  })
})


const projectTitle = document.querySelector(".project-title")
const projectDesctiption = document.querySelector(".project-description")
const projectLink= document.querySelector(".project-link")

function updateProjectText(project){
  const newText = project.name
  const newDescription = project.description
  const newUrl = project.url



  function showNewTexts(){
    projectTitle.innerHTML = newText
    projectDesctiption.innerHTML = newDescription

    const newTitleSplits = new SplitText(projectTitle, {type: 'chars'}).chars
    const newDescriptionSplits = new SplitText(projectDesctiption, {type: 'chars'}).chars

    projectLink.setAttribute('href', newUrl)

    const newTl = gsap.timeline()
    newTl.from(newTitleSplits, {
      translateY: 30,
      opacity: 0,
      scale: 0,

      duration: .5,
      stagger: -.05
    })
    newTl.from(newDescriptionSplits, {
      translateX: -10,
      opacity: 0,
      scale: 0,

      duration: .3,
      stagger: .005
    },  "-=.1")
  }

  showNewTexts()


}







//Contact section
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