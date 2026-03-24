// Helper for Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Custom Cursor config for post page
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
}

// Load markdown
async function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('post-title').innerText = "Post not found";
        return;
    }

    try {
        // Fetch metadata
        const mdResponse = await fetch(`content/${id}.md`);
        if (!mdResponse.ok) throw new Error("Could not access markdown for " + id);
        const mdText = await mdResponse.text();

        // Fetch posts.json to get meta info
        const postsRes = await fetch('content/posts.json');
        const posts = await postsRes.json();
        const postMetaInfo = posts.find(p => p.id === id);

        // Optional frontmatter parsing: for now we assume simple markdown and get meta from posts.json
        if (postMetaInfo) {
            document.title = `${postMetaInfo.title} | Reading`;
            document.getElementById('post-title').innerText = postMetaInfo.title;
            document.getElementById('post-summary').innerText = postMetaInfo.summary || '';
            const dateStr = new Date(postMetaInfo.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            document.getElementById('post-meta').innerHTML = `${dateStr} &mdash; ${postMetaInfo.readingTime || 'Read'}`;
        }

        // Render Markdown
        if (window.marked) {
            document.getElementById('post-content').innerHTML = marked.parse(mdText);

            // Post-process images for deliberate media breaks (avoids marked API version conflicts)
            const images = document.querySelectorAll('#post-content img');
            images.forEach(img => {
                const figure = document.createElement('figure');
                figure.className = 'media-break';
                img.parentNode.insertBefore(figure, img);
                figure.appendChild(img);
                if (img.title || img.alt) {
                    const caption = document.createElement('figcaption');
                    caption.innerText = img.title || img.alt;
                    figure.appendChild(caption);
                }
            });
        } else {
            document.getElementById('post-content').innerText = mdText;
        }

        // GSAP Animations (Unified Blur Transition)
        gsap.to('.site-header', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out' });
        gsap.to('.post-header', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.1 });
        gsap.to('.post-content', { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.3 });
        gsap.to('.site-footer',  { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.5 });

        // 3. Text Selection Toolbox
        const toolbox = document.getElementById('text-toolbox');
        const boldBtn = document.getElementById('bold-btn');
        const italicBtn = document.getElementById('italic-btn');
        const strikeBtn = document.getElementById('strike-btn');
        const textsizeBtn = document.getElementById('textsize-btn');
        const highlightBtn = document.getElementById('highlight-btn');
        const commentBtn = document.getElementById('comment-btn');
        const removeBtn = document.getElementById('remove-btn');
        let currentRange = null;

        // Helper: check if node is a formatting wrapper
        function isFormattingEl(el) {
            if (!el || !el.tagName) return false;
            if (el.tagName === 'MARK' && el.classList.contains('custom-highlight')) return true;
            if (el.tagName === 'STRONG') return true;
            if (el.tagName === 'EM') return true;
            if (el.tagName === 'S') return true;
            if (el.classList && el.classList.contains('text-size-up')) return true;
            if (el.classList && el.classList.contains('comment-mark')) return true;
            return false;
        }

        // Helper: wrap selection in an element
        function wrapSelection(tagName, className, attributes) {
            if (!currentRange) return;
            const wrapper = document.createElement(tagName);
            if (className) wrapper.className = className;
            if (attributes) {
                for (const [key, val] of Object.entries(attributes)) {
                    wrapper.setAttribute(key, val);
                }
            }
            wrapper.appendChild(currentRange.extractContents());
            currentRange.insertNode(wrapper);
            window.getSelection().removeAllRanges();
            toolbox.setAttribute('data-visible', 'false');
        }

        // Helper: unwrap a formatting element
        function unwrapElement(el) {
            const parent = el.parentNode;
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
            parent.normalize();
        }

        // Show toolbox on text selection
        document.addEventListener('mouseup', (e) => {
            if (toolbox.contains(e.target)) return;

            const selection = window.getSelection();
            if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const postContent = document.getElementById('post-content');

                if (postContent) {
                    currentRange = range;
                    
                    let hasFormatting = false;
                    let el = range.commonAncestorContainer;
                    if (el.nodeType === 3) el = el.parentElement;
                    while (el && el.id !== 'post-content') {
                        if (isFormattingEl(el)) { hasFormatting = true; break; }
                        el = el.parentElement;
                    }
                    if (!hasFormatting) {
                        const allElems = postContent.querySelectorAll('mark.custom-highlight, strong, em, s, .text-size-up, .comment-mark');
                        for (let i = 0; i < allElems.length; i++) {
                            if (selection.containsNode(allElems[i], true)) {
                                hasFormatting = true;
                                break;
                            }
                        }
                    }

                    // Show Remove only when inside formatted text
                    removeBtn.style.display = hasFormatting ? '' : 'none';

                    toolbox.style.left = `${rect.left + (rect.width / 2)}px`;
                    toolbox.style.top = `${Math.max(0, rect.top - 40)}px`;
                    toolbox.setAttribute('data-visible', 'true');
                    return;
                }
            }

            toolbox.setAttribute('data-visible', 'false');
            currentRange = null;
        });

        document.addEventListener('mousedown', (e) => {
            if (!toolbox.contains(e.target)) {
                toolbox.setAttribute('data-visible', 'false');
            }
        });

        // Bold
        if (boldBtn) boldBtn.addEventListener('click', () => wrapSelection('strong'));
        // Italic
        if (italicBtn) italicBtn.addEventListener('click', () => wrapSelection('em'));
        // Strikethrough
        if (strikeBtn) strikeBtn.addEventListener('click', () => wrapSelection('s'));
        // Text Size Up
        if (textsizeBtn) textsizeBtn.addEventListener('click', () => wrapSelection('span', 'text-size-up'));
        // Highlight
        if (highlightBtn) highlightBtn.addEventListener('click', () => wrapSelection('mark', 'custom-highlight'));
        // Comment
        if (commentBtn) {
            commentBtn.addEventListener('click', () => {
                if (!currentRange) return;
                const comment = prompt('Add your comment:');
                if (comment && comment.trim()) {
                    wrapSelection('span', 'comment-mark', { 'data-comment': comment.trim() });
                }
            });
        }

        // Remove ALL intersecting formatting
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const selection = window.getSelection();
                if (selection.rangeCount === 0) return;
                const range = selection.getRangeAt(0);
                
                let toUnwrap = [];
                
                // 1. Find ancestors of the common container
                let el = range.commonAncestorContainer;
                if (el.nodeType === 3) el = el.parentElement;
                while (el && el.id !== 'post-content') {
                    if (isFormattingEl(el)) toUnwrap.push(el);
                    el = el.parentElement;
                }
                
                // 2. Find descendants that intersect the selection
                const postContent = document.getElementById('post-content');
                if (postContent) {
                    const allElems = postContent.querySelectorAll('mark.custom-highlight, strong, em, s, .text-size-up, .comment-mark');
                    allElems.forEach(node => {
                        if (selection.containsNode(node, true)) {
                            toUnwrap.push(node);
                        }
                    });
                }
                
                // Unwrap unique elements
                [...new Set(toUnwrap)].forEach(node => {
                    if (node.parentNode) unwrapElement(node);
                });
                
                selection.removeAllRanges();
                toolbox.setAttribute('data-visible', 'false');
            });
        }

        // 4. Hover Collages (with click-to-pin)
        const collageTriggers = document.querySelectorAll('.hover-collage');
        let activeOverlay = null;
        let activeSidebar = null;
        let activeGallery = null;
        let activeTrigger = null;
        const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

        function closeSidebar(callback) {
            if (!activeSidebar) { if (callback) callback(); return; }
            const sidebar = activeSidebar;
            gsap.to(sidebar.querySelectorAll('img'), {
                opacity: 0, x: 30, duration: 0.3, stagger: 0.05
            });
            gsap.to(sidebar, {
                x: '100%', duration: 0.4, ease: 'power2.in', delay: 0.15,
                onComplete: () => { sidebar.remove(); if (callback) callback(); }
            });
            if (activeTrigger) activeTrigger.classList.remove('active');
            activeSidebar = null;
            activeTrigger = null;
        }

        function closeGallery(callback) {
            if (!activeGallery) { if (callback) callback(); return; }
            const gallery = activeGallery;
            gsap.to(gallery.querySelectorAll('img'), {
                opacity: 0, y: 30, duration: 0.25, stagger: 0.05
            });
            gsap.to(gallery, {
                opacity: 0, duration: 0.3, delay: 0.15,
                onComplete: () => {
                    gallery.remove();
                    document.body.style.overflow = '';
                    if (callback) callback();
                }
            });
            if (activeTrigger) activeTrigger.classList.remove('active');
            activeGallery = null;
            activeTrigger = null;
        }

        function openSidebar(trigger, images) {
            const sidebar = document.createElement('div');
            sidebar.className = 'collage-sidebar';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'sidebar-close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeSidebar(); });
            sidebar.appendChild(closeBtn);

            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                sidebar.appendChild(img);
            });

            document.body.appendChild(sidebar);
            activeSidebar = sidebar;
            activeTrigger = trigger;
            trigger.classList.add('active');

            // Animate in
            gsap.fromTo(sidebar, { x: '100%' }, { x: '0%', duration: 0.5, ease: 'power3.out' });
            gsap.fromTo(sidebar.querySelectorAll('img'),
                { opacity: 0, x: 40 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12, delay: 0.2 }
            );
        }

        function openGallery(trigger, images) {
            const gallery = document.createElement('div');
            gallery.className = 'collage-gallery-overlay';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'gallery-close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeGallery(); });
            gallery.appendChild(closeBtn);

            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                gallery.appendChild(img);
            });

            document.body.appendChild(gallery);
            activeGallery = gallery;
            activeTrigger = trigger;
            trigger.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Animate in
            gsap.fromTo(gallery, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo(gallery.querySelectorAll('img'),
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12, delay: 0.15 }
            );
        }

        collageTriggers.forEach(trigger => {
            // Desktop: keep hover preview
            trigger.addEventListener('mouseenter', () => {
                if (isMobile() || activeSidebar || activeGallery) return;
                const imagesStr = trigger.getAttribute('data-images');
                if (!imagesStr) return;
                const images = imagesStr.split(',').map(s => s.trim());

                activeOverlay = document.createElement('div');
                activeOverlay.className = 'collage-overlay';
                document.body.appendChild(activeOverlay);

                images.forEach((src, idx) => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = 'collage-img';
                    activeOverlay.appendChild(img);

                    const rot = (Math.random() - 0.5) * 30;
                    const xOffset = (Math.random() - 0.5) * 100;
                    const yOffset = (Math.random() - 0.5) * 100;

                    gsap.fromTo(img,
                        { opacity: 0, scale: 0.8, rotation: 0, x: 0, y: 0 },
                        {
                            opacity: 1, scale: 1, rotation: rot, x: xOffset, y: yOffset,
                            duration: 0.8, ease: "back.out(1.5)", delay: idx * 0.15
                        }
                    );
                });
            });

            trigger.addEventListener('mouseleave', () => {
                if (activeOverlay) {
                    const overlayToRemove = activeOverlay;
                    gsap.to(overlayToRemove.querySelectorAll('.collage-img'), {
                        opacity: 0, scale: 0.8, duration: 0.4,
                        onComplete: () => overlayToRemove.remove()
                    });
                    activeOverlay = null;
                }
            });

            // Click: toggle pinned view
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const imagesStr = trigger.getAttribute('data-images');
                if (!imagesStr) return;
                const images = imagesStr.split(',').map(s => s.trim());

                // Remove hover overlay if present
                if (activeOverlay) {
                    activeOverlay.remove();
                    activeOverlay = null;
                }

                if (isMobile()) {
                    // Mobile: gallery popup
                    if (activeGallery && activeTrigger === trigger) {
                        closeGallery();
                    } else if (activeGallery) {
                        closeGallery(() => openGallery(trigger, images));
                    } else {
                        openGallery(trigger, images);
                    }
                } else {
                    // Desktop: sidebar
                    if (activeSidebar && activeTrigger === trigger) {
                        closeSidebar();
                    } else if (activeSidebar) {
                        closeSidebar(() => openSidebar(trigger, images));
                    } else {
                        openSidebar(trigger, images);
                    }
                }
            });
        });

        // Setup hover effects on newly created links
        const hoverables = document.querySelectorAll('a, button');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 1.5, backgroundColor: 'rgba(212, 175, 55, 0.2)', duration: 0.2 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', duration: 0.2 });
            });
        });

    } catch (e) {
        console.error(e);
        document.getElementById('post-title').innerText = "Post could not be loaded.";
    }
}

// Progress Bar
window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        document.getElementById('progress-bar').style.width = scrolled + '%';
    }
});

// Page exit transition for all internal links
document.addEventListener('click', (e) => {
    // If we click an interactive element, let it handle itself
    if (e.target.closest('.toolbox-btn') || e.target.closest('.hover-collage')) return;

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

document.addEventListener('DOMContentLoaded', loadPost);
