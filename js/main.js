// Cursor execution
const cursor = document.getElementById('cursor-follower');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    const hoverables = document.querySelectorAll('a, button');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, backgroundColor: 'rgba(212, 175, 55, 0.2)', duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', duration: 0.2 });
        });
    });
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
            article.href = `post.html?id=${post.id}`;
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

        // GSAP Developing Photograph Animations
        gsap.fromTo('.hero-title', 
            { filter: 'blur(12px)', opacity: 0 }, 
            { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out' }
        );
        gsap.fromTo('.hero-subtitle', 
            { filter: 'blur(12px)', opacity: 0 }, 
            { filter: 'blur(0px)', opacity: 1, duration: 1.5, delay: 0.3, ease: 'power2.out' }
        );

        gsap.to('.post-item', {
            filter: 'blur(0px)',
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power2.out',
            delay: 0.5
        });

    } catch (err) {
        console.error(err);
        document.getElementById('post-list').innerHTML = '<p>Error loading posts.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});
