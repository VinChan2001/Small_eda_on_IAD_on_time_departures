// ==========================================================================
//   IAD Flight Analysis - Interactive JavaScript
// ==========================================================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeCharts();
    initializeStoryTabs();
    initializeModal();
    initializeScrollEffects();
    loadVisualizationData();
});

// ==========================================================================
// Navigation Functions
// ==========================================================================

function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==========================================================================
// Animation Functions
// ==========================================================================

function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Counter animation for statistics
    animateCounters();

    // Parallax effect for hero section
    initializeParallax();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseFloat(counter.textContent);
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = formatCounterValue(target);
                clearInterval(timer);
            } else {
                counter.textContent = formatCounterValue(current);
            }
        }, 20);
    };

    // Trigger animation when counters come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function formatCounterValue(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return Math.floor(value).toString();
}

function initializeParallax() {
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (heroContent) {
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ==========================================================================
// Chart Functions
// ==========================================================================

function initializeCharts() {
    // COVID Impact Chart
    createCovidChart();

    // Economic Correlation Chart
    createEconomicChart();

    // Operational Efficiency Chart
    createOperationalChart();

    // Temporal Patterns Chart
    createTemporalChart();
}

function createCovidChart() {
    const ctx = document.getElementById('covidChart');
    if (!ctx) return;

    const data = {
        labels: ['Pre-COVID', 'COVID Period', 'Recovery'],
        datasets: [{
            label: 'Average Daily Flights',
            data: [99.3, 45.5, 107.7],
            backgroundColor: [
                'rgba(34, 197, 94, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(59, 130, 246, 0.7)'
            ],
            borderColor: [
                'rgb(34, 197, 94)',
                'rgb(239, 68, 68)',
                'rgb(59, 130, 246)'
            ],
            borderWidth: 2
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createEconomicChart() {
    const ctx = document.getElementById('economicChart');
    if (!ctx) return;

    const data = {
        labels: ['GDP Growth', 'Unemployment', 'Consumer Confidence'],
        datasets: [{
            label: 'Correlation with Flight Volume',
            data: [0.701, -0.426, 0.643],
            backgroundColor: [
                'rgba(34, 197, 94, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(6, 182, 212, 0.7)'
            ],
            borderColor: [
                'rgb(34, 197, 94)',
                'rgb(239, 68, 68)',
                'rgb(6, 182, 212)'
            ],
            borderWidth: 2
        }]
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function createOperationalChart() {
    const ctx = document.getElementById('operationalChart');
    if (!ctx) return;

    const data = {
        labels: ['Low Volume', 'Medium Volume', 'High Volume'],
        datasets: [{
            label: 'Average Delay (minutes)',
            data: [5.1, 10.7, 16.4],
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 2,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 6,
                    hoverRadius: 8
                },
                line: {
                    tension: 0.4
                }
            }
        }
    });
}

function createTemporalChart() {
    const ctx = document.getElementById('temporalChart');
    if (!ctx) return;

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Average Monthly Flights',
            data: [93.2, 94.1, 95.8, 94.7, 95.4, 96.1, 96.3, 96.7, 95.9, 94.8, 93.4, 92.1],
            backgroundColor: 'rgba(6, 182, 212, 0.3)',
            borderColor: 'rgb(6, 182, 212)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 90,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

// ==========================================================================
// Story Tab Functions
// ==========================================================================

function initializeStoryTabs() {
    const storyTabs = document.querySelectorAll('.story-tab');
    const storyPanels = document.querySelectorAll('.story-panel');

    storyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetStory = this.getAttribute('data-story');

            // Remove active class from all tabs and panels
            storyTabs.forEach(t => t.classList.remove('active'));
            storyPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(`story-${targetStory}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// Modal Functions
// ==========================================================================

function initializeModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');

    // Close modal when clicking the X
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    modal.style.display = 'block';
    modalImg.src = imageSrc;

    // Add loading effect
    modalImg.style.opacity = '0';
    modalImg.onload = function() {
        modalImg.style.opacity = '1';
    };
}

// ==========================================================================
// Scroll Effects
// ==========================================================================

function initializeScrollEffects() {
    // Progress bar
    createProgressBar();

    // Scroll to top button
    createScrollToTopButton();

    // Section animations
    initializeSectionAnimations();
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2563eb, #3b82f6);
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    `;
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeSectionAnimations() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                animateSectionContent(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

function animateSectionContent(section) {
    const cards = section.querySelectorAll('.overview-card, .insight-card, .recommendation-card');

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, index * 100);
    });
}

// ==========================================================================
// Data Visualization Functions
// ==========================================================================

function loadVisualizationData() {
    // Simulate loading real data (in a real application, this would fetch from APIs)
    const insights = {
        covidImpact: {
            maxDrop: -54.2,
            recoveryLevel: 108.4,
            timeToRecover: 18 // months
        },
        economicCorrelation: {
            gdpCorrelation: 0.701,
            unemploymentCorrelation: -0.426,
            consumerConfidenceCorrelation: 0.643
        },
        operationalEfficiency: {
            congestionPenalty: 11.3,
            volumeDelayCorrelation: 0.301,
            peakHourDelays: 16.4
        },
        temporalPatterns: {
            seasonalVariation: 4.9,
            peakMonth: 'August',
            busiestDay: 'Monday'
        }
    };

    // Update dynamic content
    updateDynamicContent(insights);

    // Create interactive visualizations
    createInteractiveCharts(insights);
}

function updateDynamicContent(insights) {
    // Update metric values throughout the page
    const metricElements = document.querySelectorAll('[data-metric]');

    metricElements.forEach(element => {
        const metric = element.getAttribute('data-metric');
        const value = getNestedValue(insights, metric);

        if (value !== undefined) {
            element.textContent = formatMetricValue(value, metric);
        }
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

function formatMetricValue(value, metric) {
    if (metric.includes('correlation')) {
        return value.toFixed(3);
    } else if (metric.includes('percentage') || metric.includes('variation')) {
        return value.toFixed(1) + '%';
    } else if (metric.includes('penalty') || metric.includes('delays')) {
        return value.toFixed(1) + ' min';
    }
    return value.toString();
}

function createInteractiveCharts(insights) {
    // Create advanced visualizations using Plotly
    createTimeSeriesChart();
    createCorrelationHeatmap();
    createRecoveryTimeline();
}

function createTimeSeriesChart() {
    const container = document.getElementById('timeseries-chart');
    if (!container) return;

    // Sample time series data
    const dates = generateDateRange('2017-07-01', '2024-12-31');
    const flightCounts = generateFlightData(dates);

    const trace = {
        x: dates,
        y: flightCounts,
        type: 'scatter',
        mode: 'lines',
        name: 'Daily Flights',
        line: {
            color: '#2563eb',
            width: 2
        }
    };

    const layout = {
        title: 'Flight Volume Over Time',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Daily Flights' },
        margin: { t: 40, r: 40, b: 40, l: 60 }
    };

    if (typeof Plotly !== 'undefined') {
        Plotly.newPlot(container, [trace], layout, {responsive: true});
    }
}

function createCorrelationHeatmap() {
    const container = document.getElementById('correlation-heatmap');
    if (!container) return;

    const data = [{
        z: [
            [1.0, 0.701, -0.426, 0.643],
            [0.701, 1.0, -0.523, 0.789],
            [-0.426, -0.523, 1.0, -0.634],
            [0.643, 0.789, -0.634, 1.0]
        ],
        x: ['Flights', 'GDP', 'Unemployment', 'Confidence'],
        y: ['Flights', 'GDP', 'Unemployment', 'Confidence'],
        type: 'heatmap',
        colorscale: 'RdBu'
    }];

    const layout = {
        title: 'Economic-Aviation Correlation Matrix',
        margin: { t: 40, r: 40, b: 100, l: 100 }
    };

    if (typeof Plotly !== 'undefined') {
        Plotly.newPlot(container, data, layout, {responsive: true});
    }
}

function createRecoveryTimeline() {
    const container = document.getElementById('recovery-timeline');
    if (!container) return;

    // Recovery milestones
    const milestones = [
        { date: '2020-03-15', event: 'COVID Declaration', value: 100 },
        { date: '2020-04-01', event: 'Lockdown Peak', value: 45 },
        { date: '2021-07-01', event: 'Vaccination Rollout', value: 70 },
        { date: '2022-01-01', event: 'Recovery Phase', value: 95 },
        { date: '2024-01-01', event: 'Full Recovery', value: 108 }
    ];

    const trace = {
        x: milestones.map(m => m.date),
        y: milestones.map(m => m.value),
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Recovery Progress',
        line: { color: '#059669', width: 3 },
        marker: { size: 8, color: '#059669' },
        text: milestones.map(m => m.event),
        textposition: 'top center'
    };

    const layout = {
        title: 'COVID Recovery Timeline',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Recovery Level (%)' },
        margin: { t: 40, r: 40, b: 40, l: 60 }
    };

    if (typeof Plotly !== 'undefined') {
        Plotly.newPlot(container, [trace], layout, {responsive: true});
    }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function generateDateRange(start, end) {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
    }

    return dates;
}

function generateFlightData(dates) {
    // Generate realistic flight data with COVID impact
    return dates.map((date, index) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth();

        let baseFlights = 95;

        // COVID impact
        if (year === 2020 && month >= 2) {
            baseFlights *= (month >= 3 && month <= 6) ? 0.4 : 0.7;
        } else if (year === 2021 && month <= 6) {
            baseFlights *= 0.8;
        } else if (year >= 2022) {
            baseFlights *= 1.08;
        }

        // Seasonal variation
        const seasonalFactor = 1 + 0.1 * Math.sin((month * Math.PI) / 6);

        // Weekly pattern
        const dayOfWeek = d.getDay();
        const weeklyFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.85 : 1.1;

        // Random variation
        const randomFactor = 0.9 + Math.random() * 0.2;

        return Math.round(baseFlights * seasonalFactor * weeklyFactor * randomFactor);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================================================
// Performance Optimization
// ==========================================================================

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
    updateActiveNavigation();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// ==========================================================================
// Error Handling
// ==========================================================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could implement error reporting here
});

// Handle Chart.js loading errors
window.addEventListener('load', function() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded - charts will not display');
        // Could show fallback static images
    }

    if (typeof Plotly === 'undefined') {
        console.warn('Plotly not loaded - advanced charts will not display');
    }
});

// ==========================================================================
// Accessibility Enhancements
// ==========================================================================

// Keyboard navigation for tabs
document.addEventListener('keydown', function(e) {
    const focusedElement = document.activeElement;

    if (focusedElement.classList.contains('story-tab')) {
        const tabs = Array.from(document.querySelectorAll('.story-tab'));
        const currentIndex = tabs.indexOf(focusedElement);

        let targetIndex;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            targetIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            e.preventDefault();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            targetIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === ' ') {
            focusedElement.click();
            e.preventDefault();
        }

        if (targetIndex !== undefined) {
            tabs[targetIndex].focus();
        }
    }
});

// Announce dynamic content changes for screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ==========================================================================
// Export functions for global use
// ==========================================================================

window.openModal = openModal;

// Initialize everything when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('IAD Flight Analysis website initialized successfully');
    });
} else {
    console.log('IAD Flight Analysis website initialized successfully');
}