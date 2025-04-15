const canvas = document.getElementById("canvas")


class ParticleEffect {
    constructor(canvas){
        this.canvas = canvas
        this.setCanvasSize()
        this.ctx = canvas.getContext('2d')

        this.mouseX = 300
        this.mouseY = 300

        this.particles = []
        this.colors = [
            "#ffead2",
            "#ffee99",
            "#ffd699",
            "#ffb999",
            "#ffa699"
        ]

        for(let i = 0; i < 10; i++){
            this.particles.push(this.createParticle())
        }

        window.addEventListener('resize', () => this.setCanvasSize())

        canvas.addEventListener("mousemove", (e) => {
            const { top, left} = canvas.getBoundingClientRect()
            const { clientX, clientY } = e
            console.log(clientY - top)
            this.mouseX = clientX - left
            this.mouseY = clientY - top

            this.particles.length < 150 && this.particles.push(this.createParticle())
        })
        
        this.animate()
        console.log('init')
    }

    setCanvasSize(){
        this.canvas.height = window.innerHeight
        this.canvas.width = window.innerWidth
    }

    animate(){
        console.log(this.mouseX)
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

        this.particles = this.particles.map((p) => {
            this.ctx.beginPath()
            this.ctx.strokeStyle = p.color
            this.ctx.globalAlpha = p.opacity
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            this.ctx.stroke()
            
            p.x += p.vx
            p.y += p.vy
            
            p.opacity -= p.od
            return p.opacity <= 0 ? this.createParticle() : p
        })
        this.ctx.globalAlpha = 1


        requestAnimationFrame(this.animate.bind(this))
    }

    getRandomColor(){
        return this.colors[parseInt(this.colors.length * Math.random())]
    }


    createParticle(){
        const particle = {
            x: this.mouseX,
            y: this.mouseY,
            r: 5 * (Math.random()).toFixed(2),
            vx: (Math.random() * 1).toFixed(2) * (Math.random() > .5 ? 1 : -1),
            vy: (Math.random() * 1).toFixed(2) * (Math.random() > .5 ? 1 : -1),
            opacity: 1,
            od: (+(Math.random()).toFixed(2) + .1) / 10,
            color: this.getRandomColor()
        }

        return particle
    }
}


export default ParticleEffect