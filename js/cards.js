// =============================================
// OBLIQUE METHOD CARDS — Interactive Deck Scripts
// Organic shapes, masonry rhythm, noisy gradients
// =============================================

const CATEGORIES = [
    { id: 'orientation', color: '#D4AF37' },
    { id: 'practice', color: '#2D8C8C' },
    { id: 'writing', color: '#7B68AE' },
    { id: 'play', color: '#E07A5F' },
    { id: 'career', color: '#3D6098' },
    { id: 'ai', color: '#4CAF7D' },
    { id: 'reflection', color: '#C47D8E' },
];
function getCat(id) { return CATEGORIES.find(c => c.id === id); }

const CARDS = [
    { cat: 'orientation', title: 'Name the obsession, not the job.', desc: 'Write one sentence that starts with "I can\'t stop thinking about…" and let that guide the project, not your role title.' },
    { cat: 'orientation', title: 'Make the meta question local.', desc: 'Take your broad question about humans, play, or perception and apply it to one tiny scene — a bedroom corner, a single interaction, a single toy rule.' },
    { cat: 'orientation', title: 'Draw the comb.', desc: 'Map your skills as a comb: list each deep spike (CMF, ergonomics, play, writing, AI, strategy) and write one line on how it changes the others.' },
    { cat: 'orientation', title: 'Choose today\'s spike.', desc: 'For this piece of work, pick one spike on your comb to be primary and let the others support it instead of competing with it.' },
    { cat: 'orientation', title: 'State your design claim.', desc: 'Write a single, arguable sentence that begins with "Design is most powerful when…" and test all your decisions against it for this project.' },
    { cat: 'orientation', title: 'Refuse retro comfort.', desc: 'When you notice you are copying a known style, ask: "What would make this impossible to have existed 10 years ago?" and push toward that.' },
    { cat: 'orientation', title: 'Design for one nervous system.', desc: 'Imagine a single, specific person\'s body and mind; optimize the experience for them first before generalizing.' },
    { cat: 'practice', title: 'One deep year.', desc: 'Pick one theme (e.g., "playful ergonomics" or "text‑driven interfaces") and make it the secret focus of a full year of small experiments.' },
    { cat: 'practice', title: 'Document before you move on.', desc: 'Before you allow yourself to start a new rabbit hole, produce one page that captures what you learned from the last one.' },
    { cat: 'practice', title: 'Ship one synthesis, not ten studies.', desc: 'Combine three of your past explorations into a single, finished artifact instead of starting a fresh exploration.' },
    { cat: 'practice', title: 'Decide the constraint first.', desc: 'Like Eno, set a non‑negotiable limitation (time, materials, colors, behaviors) before you design; design inside the box on purpose.' },
    { cat: 'practice', title: 'Switch instruments.', desc: 'Do one full concept using your weakest medium — words instead of sketches, quick physical mockups instead of Figma, or vice versa. Accept the clumsiness.' },
    { cat: 'practice', title: 'Start from the manufacturing problem.', desc: 'Take one idea and rewrite it as a constraint from engineering, cost, or production, then redesign to satisfy that constraint elegantly.' },
    { cat: 'practice', title: 'Kill the decoration.', desc: 'Remove every element that doesn\'t clearly serve perception, understanding, or use. If it\'s only there to look "designed," delete it.' },
    { cat: 'practice', title: 'Iterate until boring, then one more.', desc: 'Do variations until you are tired of them; the next variation after boredom is the one you keep.' },
    { cat: 'writing', title: 'Write it before you draw it.', desc: 'Describe the experience you want in 150 words as if it already exists; only then are you allowed to sketch or model.' },
    { cat: 'writing', title: 'Three-sentence test.', desc: 'Explain your idea in three sentences to a non‑designer. If they can\'t rephrase it back, the idea is not ready.' },
    { cat: 'writing', title: 'Publish smaller than you think.', desc: 'Share an unfinished fragment — a paragraph, a diagram, a question — instead of waiting for a "proper" case study.' },
    { cat: 'writing', title: 'Turn doubts into questions.', desc: 'Every time you think "I\'m not good enough at X," rewrite it as a question and answer it in a page of writing.' },
    { cat: 'writing', title: 'Title first.', desc: 'Give your project a sharp, specific working title. Use it to keep the work from drifting into vagueness.' },
    { cat: 'writing', title: 'Narrate the decision, not the outcome.', desc: 'For each major design choice, write one or two lines about why you chose it; that becomes the spine of your documentation.' },
    { cat: 'play', title: 'Turn ergonomics into a game.', desc: 'Design one interaction where the "right" ergonomic behavior also feels playful or rewarding, not just correct.' },
    { cat: 'play', title: 'CMF as a sentence.', desc: 'Describe your CMF choice in one sentence that links material, color, and finish to a specific emotion in a specific context.' },
    { cat: 'play', title: 'Change one sensory channel.', desc: 'Keep the function constant but alter only one sensory dimension — texture, weight, temperature, sound — and observe what that does to perception.' },
    { cat: 'play', title: 'Design the before and after.', desc: 'For any object or experience, sketch or write what happens 5 minutes before and 5 minutes after use; design for those edges as seriously as the core.' },
    { cat: 'play', title: 'Break one rule of the room.', desc: 'In a space (like a bedroom), alter one assumed rule — where light comes from, where soft vs. hard surfaces go — and follow the consequences.' },
    { cat: 'career', title: 'Measure arcs, not months.', desc: 'When judging yourself, look at 3‑year arcs of skills and perspective, not the last project or job.' },
    { cat: 'career', title: 'Build one reference project for yourself.', desc: 'Create a project that answers your main question, not a client\'s brief, and treat it as a long‑term reference piece.' },
    { cat: 'career', title: 'Use teaching as a mirror.', desc: 'Design a small workshop, lecture, or internal session. Notice which parts you can explain clearly and which parts feel fuzzy.' },
    { cat: 'career', title: 'Keep one foot in the lab.', desc: 'Always maintain one ongoing experiment that has no client and no clear commercial outcome.' },
    { cat: 'career', title: 'Stay with the discomfort.', desc: 'When you feel "this isn\'t enough," ask what skill or lens is missing, then deliberately construct one project to test that gap.' },
    { cat: 'ai', title: 'Design the feeling, not the feature.', desc: 'When working with AI, start by writing how the interaction should feel to a human, then decide what the model should actually do.' },
    { cat: 'ai', title: 'Ban one convenience.', desc: 'For a prototype, forbid yourself from using one standard AI capability — autocomplete, image generation, search — and see what else emerges.' },
    { cat: 'ai', title: 'Treat AI as an intern, not a god.', desc: 'Have the system do low‑level repetition or exploration; you still make the final framing and selection.' },
    { cat: 'ai', title: 'Make one local, fragile thing.', desc: 'Build or script something that only runs locally on your own machine, for you; explore what intimacy or control that gives you.' },
    { cat: 'ai', title: 'Explain the system like a toy.', desc: 'Describe an AI‑driven system as if it were a physical toy with rules, rewards, and boundaries; refine it until it\'s teachable to a child.' },
    { cat: 'reflection', title: 'Archive the week.', desc: 'Once a week, capture three artifacts: one thing you made, one thing you learned, one question you still have.' },
    { cat: 'reflection', title: 'Ask: what would I keep?', desc: 'If you had to delete 80 percent of your work so far, which pieces or ideas would you keep? Why those?' },
    { cat: 'reflection', title: 'Show it to one more person.', desc: 'Before shelving a project, share it with one additional human and ask them to tell you what they think you care about in it.' },
    { cat: 'reflection', title: 'Rename your practice.', desc: 'For one day, stop calling yourself by your job title. Give your practice a temporary name that reflects what you are actually doing.' },
];



// =============================================
// Seeded random for deterministic shape assignment
// =============================================
function srand(seed) {
    let x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

// =============================================
// Noise texture generator (canvas)
// =============================================
function createNoiseTexture() {
    const size = 150;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        // black and white noise
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 25; // low opacity
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
}

// =============================================
// Hex to RGBA helper for gradients
// =============================================
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// =============================================
// Theme toggle
// =============================================
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// =============================================
// Custom cursor
// =============================================
const cursor = document.getElementById('cursor-follower');
if (cursor) {
    document.addEventListener('mousemove', e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    });
}

// =============================================
// Build the card grid
// =============================================
function buildCards() {
    const grid = document.getElementById('cards-grid');

    // Generate noise texture and set it as a CSS variable
    const noiseUrl = createNoiseTexture();
    document.documentElement.style.setProperty('--noise-texture', `url(${noiseUrl})`);

    CARDS.forEach((card, i) => {
        const cat = getCat(card.cat);

        const el = document.createElement('div');
        el.className = 'method-card';
        el.setAttribute('data-category', card.cat);

        // Gradient direction varies per card for visual interest
        const angle = 120 + srand(i * 61 + 3) * 60;

        el.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="background: linear-gradient(${angle}deg, ${hexToRGBA(cat.color, 0.14)} 0%, ${hexToRGBA(cat.color, 0.05)} 60%, var(--bg-color) 100%);">
                    <h3 class="card-title">${card.title}</h3>
                </div>
                <div class="card-back">
                    <div class="card-back-content">${card.desc}</div>
                </div>
            </div>
        `;

        el.addEventListener('click', e => {
            e.stopPropagation();
            el.classList.toggle('flipped');
        });

        grid.appendChild(el);
    });

    // Random card button
    document.getElementById('random-card-btn').addEventListener('click', drawRandomCard);
}

// =============================================
// Random card spotlight
// =============================================
function drawRandomCard() {
    const card = CARDS[Math.floor(Math.random() * CARDS.length)];
    const cat = getCat(card.cat);
    const angle = 130 + Math.random() * 40;

    const overlay = document.createElement('div');
    overlay.className = 'spotlight-overlay';
    overlay.innerHTML = `
        <div class="spotlight-card" id="spotlight-card-el">
            <div class="card-inner">
                <div class="card-front" style="background: linear-gradient(${angle}deg, ${hexToRGBA(cat.color, 0.18)} 0%, ${hexToRGBA(cat.color, 0.06)} 55%, var(--bg-color) 100%);">
                    <h3 class="card-title">${card.title}</h3>
                </div>
                <div class="card-back">
                    <div class="card-back-content">${card.desc}</div>
                </div>
            </div>
        </div>
        
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    const spotEl = overlay.querySelector('.spotlight-card');
    gsap.fromTo(spotEl,
        { scale: 0.6, rotateY: -40, opacity: 0 },
        { scale: 1, rotateY: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.3)', delay: 0.1 }
    );

    spotEl.addEventListener('click', e => { e.stopPropagation(); spotEl.classList.toggle('flipped'); });

    function dismiss() {
        gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => { overlay.remove(); document.body.style.overflow = ''; } });
        document.removeEventListener('keydown', escH);
    }
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.classList.contains('spotlight-dismiss')) dismiss(); });
    function escH(e) { if (e.key === 'Escape') dismiss(); }
    document.addEventListener('keydown', escH);
}

// =============================================
// GSAP entrance animations
// =============================================
function animateEntrance() {
    gsap.to('.site-header', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out' });
    gsap.to('.cards-intro', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.15 });
    gsap.to('.cards-controls', { filter: 'blur(0px)', opacity: 1, duration: 1, ease: 'power2.out', delay: 0.3 });
    gsap.to('.site-footer', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.4 });

    const cards = document.querySelectorAll('.method-card');
    cards.forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, filter: 'blur(0px)',
            duration: 0.4 + srand(i * 7) * 0.3,
            ease: 'power2.out',
            delay: 0.5 + i * 0.03 + srand(i * 11) * 0.08
        });
    });

    if (cursor) {
        document.querySelectorAll('a, button, .method-card').forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.5, backgroundColor: 'rgba(212,175,55,0.2)', duration: 0.2 }));
            el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', duration: 0.2 }));
        });
    }
}

// =============================================
// Page exit transition
// =============================================
document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    if (link.getAttribute('target') === '_blank') return;
    e.preventDefault();
    gsap.to('body', { filter: 'blur(12px)', opacity: 0, duration: 0.4, ease: 'power2.inOut', onComplete: () => { window.location.href = href; } });
});

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    buildCards();
    animateEntrance();
});
