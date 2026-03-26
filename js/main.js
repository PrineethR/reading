
// Init Theme
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Fetch and render posts
async function loadPosts() {
    try {
        const response = await fetch('content/posts.json');
        if (!response.ok) throw new Error("Could not load posts.json");
        const posts = await response.json();
        
        const postListEl = document.getElementById('post-list');
        postListEl.innerHTML = '';
        
        posts.forEach((post, i) => {
            const article = document.createElement('a');
            article.href = post.url || `post.html?id=${post.id}`;
            article.className = 'post-item';
            
            // Format date
            const dateStr = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            article.innerHTML = `
                <div class="post-item-meta">${dateStr} &mdash; ${post.readingTime || '5 min read'}</div>
                <h2 class="post-item-title">${post.title}</h2>
                <p class="post-item-summary">${post.summary}</p>
            `;
            
            postListEl.appendChild(article);
        });

        // GSAP Animations (Unified Blur Transition)
        gsap.to('.hero-title', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.1 });
        gsap.to('.hero-subtitle', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.3 });
        gsap.to('.site-footer', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.4 });

        // Scribble line draw animation
        const scribblePath = document.getElementById('scribble-path');
        if (scribblePath) {
            const pathLength = scribblePath.getTotalLength();
            scribblePath.style.strokeDasharray = pathLength;
            scribblePath.style.strokeDashoffset = pathLength;
            gsap.to(scribblePath, {
                strokeDashoffset: 0,
                duration: 2,
                ease: 'power2.inOut',
                delay: 0.6
            });
        }

        gsap.to('.post-item', {
            filter: 'blur(0px)', opacity: 1, duration: 1.2,
            stagger: 0.2, ease: 'power2.out', delay: 1.2
        });

    } catch (err) {
        console.error(err);
        document.getElementById('post-list').innerHTML = '<p>Error loading posts.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    // Page exit transition for all internal links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
        if (link.getAttribute('target') === '_blank') return;
        
        e.preventDefault();
        gsap.to('body', { 
            filter: 'blur(12px)', opacity: 0, duration: 0.4, ease: 'power2.inOut', 
            onComplete: () => { window.location.href = href; } 
        });
    });
});

// Handle back/forward cache (bfcache) - reset body visibility when navigating back
window.addEventListener('pageshow', (event) => {
    gsap.set('body', { filter: 'blur(0px)', opacity: 1 });
});
