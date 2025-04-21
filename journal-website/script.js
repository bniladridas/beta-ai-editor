document.addEventListener('DOMContentLoaded', function() {
    // Highlight the code blocks
    hljs.highlightAll();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Newsletter form submission (prevent default for demo)
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value.trim() !== '') {
                // Show success message
                const successMessage = document.createElement('p');
                successMessage.textContent = 'Thank you for subscribing!';
                successMessage.style.color = '#2ecc71';
                
                // Remove any existing success message
                const existingMessage = this.querySelector('p:not(:first-child)');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                this.appendChild(successMessage);
                emailInput.value = '';
            }
        });
    }
    
    // Add reading time estimate
    const article = document.querySelector('.post-content');
    if (article) {
        const text = article.textContent;
        const wordCount = text.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
        
        const metaSection = document.querySelector('.meta');
        if (metaSection) {
            const readingTimeSpan = document.createElement('span');
            readingTimeSpan.innerHTML = `<i class="far fa-clock"></i> ${readingTime} min read`;
            metaSection.appendChild(readingTimeSpan);
        }
    }
    
    // Add table of contents
    const headings = article ? article.querySelectorAll('h2') : [];
    if (headings.length > 0 && article) {
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>Table of Contents</h3><ul></ul>';
        
        const tocList = toc.querySelector('ul');
        
        headings.forEach((heading, index) => {
            // Add ID to heading if it doesn't have one
            if (!heading.id) {
                heading.id = `section-${index}`;
            }
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        // Insert TOC after intro section
        const introSection = article.querySelector('.intro');
        if (introSection) {
            introSection.after(toc);
        } else {
            article.prepend(toc);
        }
        
        // Add TOC styles
        const style = document.createElement('style');
        style.textContent = `
            .table-of-contents {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .table-of-contents h3 {
                margin-top: 0;
                margin-bottom: 1rem;
            }
            
            .table-of-contents ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .table-of-contents li {
                margin-bottom: 0.5rem;
                padding-left: 1rem;
                position: relative;
            }
            
            .table-of-contents li:before {
                content: "•";
                position: absolute;
                left: 0;
                color: var(--primary-color);
            }
            
            .table-of-contents a {
                color: var(--dark-color);
            }
            
            .table-of-contents a:hover {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    document.body.appendChild(backToTopButton);
    
    // Add back to top button styles
    const backToTopStyle = document.createElement('style');
    backToTopStyle.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            z-index: 99;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background-color: #3a5999;
        }
    `;
    document.head.appendChild(backToTopStyle);
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
