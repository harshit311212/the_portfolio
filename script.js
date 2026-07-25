document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const revealElements = document.querySelectorAll('.reveal');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // Dynamic typing effect for the hero section
  const textElement = document.getElementById('typing-text');
  if (textElement) {
    const words = ["AI Engineer.", "Python Developer.", "Problem Solver.", "Tech Enthusiast."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      // Continuous cursor spark trail
      if (charIndex >= 0 && charIndex <= currentWord.length) {
        createCursorSpark(textElement, isDeleting);
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
        createSparks(textElement);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before typing next
      }

      setTimeout(type, typeSpeed);
    }
    // Spark effect function
    function createSparks(element) {
      const colors = ['#00E676', '#00FFFF', '#B2FF59', '#FFFFFF'];
      const rect = element.getBoundingClientRect();
      for (let i = 0; i < 15; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.backgroundColor = color;
        spark.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        document.body.appendChild(spark);
        
        const startX = rect.right;
        const startY = rect.top + rect.height / 2;
        spark.style.left = startX + 'px';
        spark.style.top = startY + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 20;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        
        setTimeout(() => {
          spark.remove();
        }, 600);
      }
    }

    // Small cursor spark function
    function createCursorSpark(element, isDeleting = false) {
      const colors = isDeleting ? ['#F59E0B', '#FF4500', '#FF8C00', '#FFD700'] : ['#00E676', '#00FFFF', '#B2FF59', '#FFFFFF'];
      const rect = element.getBoundingClientRect();
      const numSparks = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < numSparks; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark spark-small';
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.backgroundColor = color;
        spark.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        document.body.appendChild(spark);
        
        const startX = rect.right;
        const startY = rect.top + rect.height / 2 + (Math.random() * 10 - 5);
        spark.style.left = startX + 'px';
        spark.style.top = startY + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 20 + 10;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        
        setTimeout(() => {
          spark.remove();
        }, 400);
      }
    }
    
    // Start typing effect
    setTimeout(type, 1000);
  }

  // --- Higgfield (Particle Network) Background Effect ---
  const canvas = document.getElementById('higgfield-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', e => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
      }
      update() {
        // float around
        this.x += this.vx;
        this.y += this.vy;
        
        // bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // mouse interaction
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
      draw() {
        ctx.fillStyle = 'rgba(0, 230, 118, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    function init() {
      particles = [];
      let numParticles = (width * height) / 10000;
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 230, 118, ${0.2 - distance/600})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    
    init();
    animate();
  }

  // --- D3.js Tech Stack Graph ---
  const d3Container = document.getElementById('d3-container');
  if (d3Container && window.d3) {
    const data = {
      nodes: [
        { id: "Core", group: 0, radius: 25 },
        { id: "Python", group: 1, radius: 18 },
        { id: "C++", group: 1, radius: 15 },
        { id: "SQL", group: 1, radius: 15 },
        { id: "JavaScript", group: 1, radius: 15 },
        { id: "Azure OpenAI", group: 2, radius: 20 },
        { id: "GPT", group: 2, radius: 18 },
        { id: "LangChain", group: 2, radius: 18 },
        { id: "OpenCV", group: 2, radius: 16 },
        { id: "TensorFlow", group: 2, radius: 16 },
        { id: "PyTorch", group: 2, radius: 18 },
        { id: "OCR", group: 2, radius: 16 },
        { id: "RAG", group: 2, radius: 20 },
        { id: "FastAPI", group: 3, radius: 18 },
        { id: "Flask", group: 3, radius: 15 },
        { id: "REST APIs", group: 3, radius: 15 },
        { id: "Azure", group: 4, radius: 18 },
        { id: "Docker", group: 4, radius: 16 },
        { id: "GitHub Actions", group: 4, radius: 15 },
        { id: "SQLite", group: 4, radius: 15 }
      ],
      links: [
        { source: "Core", target: "Python" },
        { source: "Core", target: "C++" },
        { source: "Core", target: "SQL" },
        { source: "Core", target: "JavaScript" },
        { source: "Python", target: "FastAPI" },
        { source: "Python", target: "Flask" },
        { source: "Python", target: "PyTorch" },
        { source: "Python", target: "TensorFlow" },
        { source: "Python", target: "LangChain" },
        { source: "Python", target: "Azure OpenAI" },
        { source: "Azure OpenAI", target: "RAG" },
        { source: "Azure OpenAI", target: "GPT" },
        { source: "FastAPI", target: "REST APIs" },
        { source: "Core", target: "Azure" },
        { source: "Azure", target: "Docker" },
        { source: "Docker", target: "GitHub Actions" },
        { source: "Python", target: "OpenCV" },
        { source: "OpenCV", target: "OCR" },
        { source: "SQL", target: "SQLite" }
      ]
    };

    const width = d3Container.clientWidth;
    const height = d3Container.clientHeight;

    const svg = d3.select("#d3-container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(d3.zoom().on("zoom", function (event) {
         svg.attr("transform", event.transform)
      }))
      .append("g");

    const color = d3.scaleOrdinal()
      .domain([0, 1, 2, 3, 4])
      .range(["#ffffff", "#3B82F6", "#00E676", "#F59E0B", "#8B5CF6"]);

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => d.radius + 10));

    const link = svg.append("g")
      .attr("stroke", "rgba(0, 230, 118, 0.2)")
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(data.links)
      .join("line");

    const node = svg.append("g")
      .attr("stroke", "rgba(0, 0, 0, 0.5)")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => color(d.group))
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .attr("dy", -25)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .style("font-size", "12px")
      .text(d => d.id);

    node.append("title")
      .text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    // Resize handling
    window.addEventListener('resize', () => {
      const newWidth = d3Container.clientWidth;
      const newHeight = d3Container.clientHeight;
      d3.select("#d3-container svg").attr("width", newWidth).attr("height", newHeight);
      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
      simulation.alpha(0.3).restart();
    });
  }
});
