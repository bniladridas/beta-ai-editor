$(document).ready(function() {
    // Highlight the code blocks
    hljs.highlightAll();

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();

        const targetId = $(this).attr('href');
        if (targetId === '#') return;

        const $targetElement = $(targetId);
        if ($targetElement.length) {
            $('html, body').animate({
                scrollTop: $targetElement.offset().top - 80
            }, 800);
        }
    });

    // Newsletter form submission (prevent default for demo)
    $('.newsletter form').on('submit', function(e) {
        e.preventDefault();
        const $emailInput = $(this).find('input[type="email"]');
        if ($emailInput.val().trim() !== '') {
            // Show success message with Bootstrap alert
            const $successMessage = $('<div class="alert alert-success mt-3" role="alert">' +
                                    '<i class="fas fa-check-circle me-2"></i>Thank you for subscribing!' +
                                    '</div>');

            // Remove any existing success message
            $(this).find('.alert').remove();

            // Add the new message with fade effect
            $successMessage.hide().appendTo(this).fadeIn(300);
            $emailInput.val('');

            // Auto-dismiss after 5 seconds
            setTimeout(function() {
                $successMessage.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 5000);
        }
    });

    // Add reading time estimate
    const $article = $('.post-content');
    if ($article.length) {
        const text = $article.text();
        const wordCount = text.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

        const $metaSection = $('.meta');
        if ($metaSection.length) {
            $('<span><i class="far fa-clock"></i> ' + readingTime + ' min read</span>')
                .appendTo($metaSection);
        }
    }

    // Add table of contents with Bootstrap styling
    const $headings = $article.find('h2');
    if ($headings.length > 0) {
        const $toc = $('<div class="table-of-contents card mb-4">' +
                      '<div class="card-body">' +
                      '<h3 class="card-title">Table of Contents</h3>' +
                      '<ul class="list-unstyled toc-list"></ul>' +
                      '</div></div>');

        const $tocList = $toc.find('.toc-list');

        $headings.each(function(index) {
            // Add ID to heading if it doesn't have one
            if (!$(this).attr('id')) {
                $(this).attr('id', 'section-' + index);
            }

            const headingId = $(this).attr('id');
            const headingText = $(this).text();

            $('<li class="toc-item">' +
              '<a href="#' + headingId + '" class="toc-link">' +
              '<i class="fas fa-angle-right me-2"></i>' + headingText +
              '</a></li>').appendTo($tocList);
        });

        // Insert TOC after intro section
        const $introSection = $article.find('.intro');
        if ($introSection.length) {
            $toc.insertAfter($introSection);
        } else {
            $toc.prependTo($article);
        }

        // Add active class to current section in TOC
        $(window).on('scroll', function() {
            const scrollPosition = $(window).scrollTop();

            $headings.each(function() {
                const sectionTop = $(this).offset().top - 100;
                const sectionBottom = sectionTop + $(this).outerHeight();
                const sectionId = $(this).attr('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    $('.toc-link').removeClass('active');
                    $('.toc-link[href="#' + sectionId + '"]').addClass('active');
                }
            });
        });
    }

    // Add back to top button with Bootstrap tooltip
    const $backToTopButton = $('<button class="back-to-top" data-bs-toggle="tooltip" data-bs-placement="left" title="Back to top">' +
                             '<i class="fas fa-arrow-up"></i>' +
                             '</button>');
    $backToTopButton.appendTo('body');

    // Initialize tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Show/hide back to top button based on scroll position
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $backToTopButton.addClass('visible');
        } else {
            $backToTopButton.removeClass('visible');
        }
    });

    // Scroll to top when button is clicked
    $backToTopButton.on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // Add copy code button to code blocks
    $('pre code').each(function() {
        const $this = $(this);
        const $pre = $this.parent();

        // Create copy button
        const $copyButton = $('<button class="copy-code-button" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to clipboard">' +
                            '<i class="far fa-copy"></i>' +
                            '</button>');

        // Add button to pre element
        $pre.css('position', 'relative').append($copyButton);

        // Initialize tooltip
        new bootstrap.Tooltip($copyButton[0]);

        // Copy functionality
        $copyButton.on('click', function() {
            const code = $this.text();
            navigator.clipboard.writeText(code).then(function() {
                // Change icon and tooltip temporarily
                const oldTitle = $copyButton.attr('data-bs-original-title');
                $copyButton.attr('data-bs-original-title', 'Copied!');
                $copyButton.tooltip('show');
                $copyButton.find('i').removeClass('fa-copy').addClass('fa-check');

                // Reset after 2 seconds
                setTimeout(function() {
                    $copyButton.attr('data-bs-original-title', oldTitle);
                    $copyButton.find('i').removeClass('fa-check').addClass('fa-copy');
                }, 2000);
            });
        });
    });

    // Add CSS for new elements
    $('<style>\n' +
      '.table-of-contents {\n' +
      '    background-color: rgba(0, 0, 0, 0.02);\n' +
      '    border: none;\n' +
      '    border-radius: 12px;\n' +
      '    margin-bottom: var(--space-xl);\n' +
      '}\n' +
      '\n' +
      '.table-of-contents .card-title {\n' +
      '    font-size: 1.2rem;\n' +
      '    margin-bottom: 1rem;\n' +
      '    color: var(--dark-color);\n' +
      '}\n' +
      '\n' +
      '.toc-item {\n' +
      '    margin-bottom: 0.5rem;\n' +
      '}\n' +
      '\n' +
      '.toc-link {\n' +
      '    color: var(--secondary-color);\n' +
      '    display: inline-flex;\n' +
      '    align-items: center;\n' +
      '    transition: all var(--transition-normal);\n' +
      '    border-bottom: none;\n' +
      '}\n' +
      '\n' +
      '.toc-link i {\n' +
      '    opacity: 0.5;\n' +
      '    transition: all var(--transition-normal);\n' +
      '}\n' +
      '\n' +
      '.toc-link:hover, .toc-link.active {\n' +
      '    color: var(--primary-color);\n' +
      '    transform: translateX(3px);\n' +
      '}\n' +
      '\n' +
      '.toc-link:hover i, .toc-link.active i {\n' +
      '    opacity: 1;\n' +
      '}\n' +
      '\n' +
      '.back-to-top {\n' +
      '    position: fixed;\n' +
      '    bottom: 20px;\n' +
      '    right: 20px;\n' +
      '    width: 50px;\n' +
      '    height: 50px;\n' +
      '    border-radius: 50%;\n' +
      '    background-color: var(--primary-color);\n' +
      '    color: white;\n' +
      '    border: none;\n' +
      '    cursor: pointer;\n' +
      '    display: flex;\n' +
      '    align-items: center;\n' +
      '    justify-content: center;\n' +
      '    font-size: 1.2rem;\n' +
      '    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);\n' +
      '    opacity: 0;\n' +
      '    visibility: hidden;\n' +
      '    transition: all var(--transition-normal);\n' +
      '    z-index: 99;\n' +
      '}\n' +
      '\n' +
      '.back-to-top.visible {\n' +
      '    opacity: 1;\n' +
      '    visibility: visible;\n' +
      '}\n' +
      '\n' +
      '.back-to-top:hover {\n' +
      '    background-color: var(--dark-color);\n' +
      '    transform: translateY(-3px);\n' +
      '}\n' +
      '\n' +
      '.copy-code-button {\n' +
      '    position: absolute;\n' +
      '    top: 0.5rem;\n' +
      '    right: 0.5rem;\n' +
      '    background-color: rgba(255, 255, 255, 0.1);\n' +
      '    color: rgba(255, 255, 255, 0.7);\n' +
      '    border: none;\n' +
      '    border-radius: 4px;\n' +
      '    padding: 0.25rem 0.5rem;\n' +
      '    font-size: 0.8rem;\n' +
      '    cursor: pointer;\n' +
      '    transition: all var(--transition-fast);\n' +
      '}\n' +
      '\n' +
      '.copy-code-button:hover {\n' +
      '    background-color: rgba(255, 255, 255, 0.2);\n' +
      '    color: rgba(255, 255, 255, 0.9);\n' +
      '}\n' +
      '</style>').appendTo('head');
});
