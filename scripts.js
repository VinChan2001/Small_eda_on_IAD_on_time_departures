// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe story sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = [
        '.story-section',
        '.stat-card',
        '.insight-card',
        '.method-card',
        '.story-image'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format numbers appropriately
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString();
        } else {
            element.textContent = current.toFixed(1);
        }
    }, 16);
};

// Trigger counter animations when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;

            // Extract number from text
            const match = text.match(/[\d,]+\.?\d*/);
            if (match) {
                const number = parseFloat(match[0].replace(/,/g, ''));
                statNumber.textContent = '0';
                setTimeout(() => {
                    animateCounter(statNumber, number);
                }, 300);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stat cards
document.addEventListener('DOMContentLoaded', () => {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        statsObserver.observe(card);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Image lazy loading with fade in effect
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.8s ease-in-out';

            const tempImg = new Image();
            tempImg.onload = () => {
                img.style.opacity = '1';
            };
            tempImg.src = img.src;

            imageObserver.unobserve(img);
        }
    });
}, { threshold: 0.1 });

// Observe story images
document.addEventListener('DOMContentLoaded', () => {
    const storyImages = document.querySelectorAll('.story-image');
    storyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

// Smooth reveal animation for insight items
const insightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.insight-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 150);
            });
            insightObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// Observe insights containers
document.addEventListener('DOMContentLoaded', () => {
    const insightsContainers = document.querySelectorAll('.insights');
    insightsContainers.forEach(container => {
        const items = container.querySelectorAll('.insight-item');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        insightObserver.observe(container);
    });
});

// CTA button hover effects
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #667eea !important;
        background: rgba(102, 126, 234, 0.15) !important;
        font-weight: 600 !important;
    }
`;
document.head.appendChild(style);

// Key finding highlight animation
const keyFindingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'pulse 2s ease-in-out';
            keyFindingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.7 });

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(pulseStyle);

// Observe key findings
document.addEventListener('DOMContentLoaded', () => {
    const keyFindings = document.querySelectorAll('.key-finding');
    keyFindings.forEach(finding => {
        keyFindingObserver.observe(finding);
    });
});

// Tooltip functionality for enhanced interactivity
const createTooltip = (element, text) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        white-space: nowrap;
    `;

    document.body.appendChild(tooltip);

    element.addEventListener('mouseenter', (e) => {
        tooltip.style.opacity = '1';
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY - 40 + 'px';
    });

    element.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY - 40 + 'px';
    });

    element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
};

// Add tooltips to stat cards
document.addEventListener('DOMContentLoaded', () => {
    const statCards = document.querySelectorAll('.stat-card');
    const tooltips = [
        'Total flight records analyzed from IAD departures',
        'Complete analysis period covering 7+ years of data',
        'Average departure delay across all flights',
        'Unique destination airports served from IAD'
    ];

    statCards.forEach((card, index) => {
        if (tooltips[index]) {
            createTooltip(card, tooltips[index]);
        }
    });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #667eea;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s ease;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add ARIA labels
    const navToggle = document.getElementById('hamburger');
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('role', 'button');
    }

    // Add focus management for mobile menu
    const mobileMenu = document.getElementById('nav-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.focus();
            }
        });
    }
});

console.log('🚀 IAD Flight Analysis website loaded successfully!');
console.log('📊 Interactive features initialized:');
console.log('   ✓ Smooth scrolling navigation');
console.log('   ✓ Mobile responsive menu');
console.log('   ✓ Scroll animations and parallax effects');
console.log('   ✓ Counter animations for statistics');
console.log('   ✓ Image lazy loading');
console.log('   ✓ Interactive tooltips');
console.log('   ✓ Accessibility enhancements');