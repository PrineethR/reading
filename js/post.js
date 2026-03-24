// Helper for Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
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

        // GSAP Animations

        // Simple fade-up entrance for the header
        gsap.fromTo('.post-header',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );

        // Content fade in
        gsap.to('.post-content', {
            opacity: 1,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out'
        });

        // 3. Text Selection Toolbox
        const toolbox = document.getElementById('text-toolbox');
        const highlightBtn = document.getElementById('highlight-btn');
        const removeHighlightBtn = document.getElementById('remove-highlight-btn');
        let currentRange = null;

        // Helper: check if a node is inside an existing highlight
        function isInsideHighlight(node) {
            let el = node.nodeType === 3 ? node.parentElement : node;
            while (el) {
                if (el.tagName === 'MARK' && el.classList.contains('custom-highlight')) return el;
                el = el.parentElement;
            }
            return null;
        }

        document.addEventListener('mouseup', (e) => {
            if (toolbox.contains(e.target)) return;

            const selection = window.getSelection();
            if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const postContent = document.getElementById('post-content');

                if (postContent) {
                    currentRange = range;
                    const existingMark = isInsideHighlight(selection.anchorNode);
                    // Show/hide the correct button
                    highlightBtn.style.display = existingMark ? 'none' : '';
                    removeHighlightBtn.style.display = existingMark ? '' : 'none';

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

        // Highlight: wrap selection, but skip if already inside a mark
        if (highlightBtn) {
            highlightBtn.addEventListener('click', () => {
                if (!currentRange) return;
                // If selection is already inside a highlight, do nothing
                if (isInsideHighlight(currentRange.startContainer)) return;

                const mark = document.createElement('mark');
                mark.className = 'custom-highlight';
                mark.appendChild(currentRange.extractContents());
                currentRange.insertNode(mark);
                window.getSelection().removeAllRanges();
                toolbox.setAttribute('data-visible', 'false');
            });
        }

        // Remove Highlight: unwrap the <mark> tag
        if (removeHighlightBtn) {
            removeHighlightBtn.addEventListener('click', () => {
                const selection = window.getSelection();
                if (selection.rangeCount === 0) return;
                const markEl = isInsideHighlight(selection.anchorNode);
                if (markEl) {
                    const parent = markEl.parentNode;
                    while (markEl.firstChild) {
                        parent.insertBefore(markEl.firstChild, markEl);
                    }
                    parent.removeChild(markEl);
                    parent.normalize(); // merge adjacent text nodes
                }
                window.getSelection().removeAllRanges();
                toolbox.setAttribute('data-visible', 'false');
            });
        }

        // 4. Hover Collages
        const collageTriggers = document.querySelectorAll('.hover-collage');
        let activeOverlay = null;

        collageTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => {
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

                    const rot = (Math.random() - 0.5) * 30; // -15 to 15 degrees
                    const xOffset = (Math.random() - 0.5) * 100; // random fan out
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

document.addEventListener('DOMContentLoaded', loadPost);
