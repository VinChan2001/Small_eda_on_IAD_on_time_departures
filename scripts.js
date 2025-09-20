// Chart.js Configuration and Data Visualization

// Global Chart.js configuration
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.display = true;
Chart.defaults.plugins.legend.position = 'top';

// Initialize all charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Story 1: Weather Delay Charts
    createWeatherDelayChart();
    createAvgWeatherDelayChart();
    
    // Story 2: Holiday Charts
    createHolidayVolumeChart();
    createHolidayDelayChart();
    
    // Story 3: Duration Charts
    createDurationVolumeChart();
    createDurationDelayChart();
    
    // Story 4: Business Travel Charts
    createWeekdayDelayChart();
    createWeekdayVolumeChart();
    createHourlyPatternsChart();
    createBusinessPeakChart();
    
    // Story 5: COVID Impact Charts
    createCovidVolumeChart();
    createRecoveryTrendChart();
    
    // Story 6: Tech Corridor Charts
    createTechDestinationsChart();
    createTechDelayComparisonChart();
    createTechYearlyTrendChart();
    createTechWeekdayChart();
}

// Story 1: Weather Delay Charts
function createWeatherDelayChart() {
    const ctx = document.getElementById('weatherDelayChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Summer Months (Jun-Aug)',
                data: [0, 0, 0, 0, 0, 52800, 58724, 32000, 0, 0, 0, 0],
                backgroundColor: '#e74c3c',
                borderColor: '#c0392b',
                borderWidth: 1
            }, {
                label: 'Non-Summer Months',
                data: [3200, 2800, 4100, 3500, 4800, 0, 0, 0, 3900, 4200, 2100, 2900],
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Weather Delay Minutes by Month'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Weather Delay (Minutes)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

function createAvgWeatherDelayChart() {
    const ctx = document.getElementById('avgWeatherDelayChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Weather Delay per Flight',
                data: [0.4, 0.3, 0.5, 0.4, 0.6, 7.2, 8.1, 4.8, 0.5, 0.6, 0.3, 0.4],
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Weather Delay per Flight by Month'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Avg Weather Delay per Flight (Minutes)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

// Story 2: Holiday Charts
function createHolidayVolumeChart() {
    const ctx = document.getElementById('holidayVolumeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Normal Days', 'Thanksgiving Week'],
            datasets: [{
                label: 'Average Flights per Day',
                data: [41, 146],
                backgroundColor: ['#3498db', '#f39c12'],
                borderColor: ['#2980b9', '#e67e22'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Daily Flight Volume: Thanksgiving Week vs Normal Operations'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Flights per Day'
                    }
                }
            }
        }
    });
}

function createHolidayDelayChart() {
    const ctx = document.getElementById('holidayDelayChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Normal Operations', 'Thanksgiving Week'],
            datasets: [{
                label: 'Average Delay (Minutes)',
                data: [11.92, 4.96],
                backgroundColor: ['#3498db', '#f39c12'],
                borderColor: ['#2980b9', '#e67e22'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Departure Delay: Thanksgiving Week vs Normal Operations'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Delay (Minutes)'
                    }
                }
            }
        }
    });
}

// Story 3: Duration Charts
function createDurationVolumeChart() {
    const ctx = document.getElementById('durationVolumeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Short-haul\n(<2h)', 'Medium-haul\n(2-4h)', 'Long-haul\n(4-6h)', 'Ultra-long\n(6h+)'],
            datasets: [{
                label: 'Number of Flights',
                data: [49451, 27829, 14101, 1269],
                backgroundColor: ['#74b9ff', '#0984e3', '#2d3436', '#636e72'],
                borderColor: ['#0984e3', '#74b9ff', '#2d3436', '#636e72'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Flight Volume by Duration Category'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Flight Category'
                    }
                }
            }
        }
    });
}

function createDurationDelayChart() {
    const ctx = document.getElementById('durationDelayChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Short-haul\n(<2h)', 'Medium-haul\n(2-4h)', 'Long-haul\n(4-6h)', 'Ultra-long\n(6h+)'],
            datasets: [{
                label: 'Average Delay (Minutes)',
                data: [11.2, 12.8, 11.5, 9.8],
                backgroundColor: ['#fd7f6f', '#ffb347', '#77dd77', '#84b6f4'],
                borderColor: ['#ff6b6b', '#ffa726', '#66bb6a', '#42a5f5'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Delay by Flight Duration'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Delay (Minutes)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Flight Category'
                    }
                }
            }
        }
    });
}

// Story 4: Business Travel Charts
function createWeekdayDelayChart() {
    const ctx = document.getElementById('weekdayDelayChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Average Delay (Minutes)',
                data: [11.2, 11.8, 11.5, 12.1, 13.14, 10.8, 10.2],
                backgroundColor: ['#f39c12', '#3498db', '#3498db', '#3498db', '#e74c3c', '#3498db', '#3498db'],
                borderColor: ['#e67e22', '#2980b9', '#2980b9', '#2980b9', '#c0392b', '#2980b9', '#2980b9'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Delay by Day of Week'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Delay (Minutes)'
                    }
                }
            }
        }
    });
}

function createWeekdayVolumeChart() {
    const ctx = document.getElementById('weekdayVolumeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Daily Flight Volume',
                data: [14800, 14200, 14100, 14300, 14500, 10200, 10550],
                backgroundColor: '#27ae60',
                borderColor: '#229954',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Flight Volume by Day of Week'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                }
            }
        }
    });
}

function createHourlyPatternsChart() {
    const ctx = document.getElementById('hourlyPatternsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'],
            datasets: [{
                label: 'Weekdays',
                data: [8.2, 7.5, 8.8, 9.2, 10.5, 11.8, 12.2, 12.8, 14.2, 15.1, 13.8, 11.2],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
            }, {
                label: 'Weekends',
                data: [7.1, 6.8, 7.2, 8.1, 8.8, 9.2, 9.8, 10.1, 10.8, 11.2, 10.5, 9.1],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Delay by Hour: Weekdays vs Weekends'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Delay (Minutes)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Departure Hour'
                    }
                }
            }
        }
    });
}

function createBusinessPeakChart() {
    const ctx = document.getElementById('businessPeakChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon Morning\n(6-10 AM)', 'Fri Evening\n(4-8 PM)', 'Overall Average'],
            datasets: [{
                label: 'Average Delay (Minutes)',
                data: [3.05, 13.08, 11.70],
                backgroundColor: ['#3498db', '#e74c3c', '#95a5a6'],
                borderColor: ['#2980b9', '#c0392b', '#7f8c8d'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Business Travel Peak Comparison'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Delay (Minutes)'
                    }
                }
            }
        }
    });
}

// Story 5: COVID Impact Charts
function createCovidVolumeChart() {
    const ctx = document.getElementById('covidVolumeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'COVID Year (2020)',
                data: [0, 0, 0, 6102, 0, 0, 0, 0],
                backgroundColor: '#e74c3c',
                borderColor: '#c0392b',
                borderWidth: 2
            }, {
                label: 'Normal Operations',
                data: [12850, 13200, 13580, 0, 13200, 13400, 13950, 13850],
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Flight Volume at IAD'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

function createRecoveryTrendChart() {
    const ctx = document.getElementById('recoveryTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Flight Volume Trend',
                data: [12850, 13200, 13580, 6102, 13200, 13400, 13950, 13850],
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'IAD Flight Volume Recovery Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

// Story 6: Tech Corridor Charts
function createTechDestinationsChart() {
    const ctx = document.getElementById('techDestinationsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['SFO', 'LAX', 'SEA', 'SJC', 'OAK', 'BUR', 'PDX'],
            datasets: [{
                label: 'Number of Flights',
                data: [8325, 4250, 3800, 1580, 850, 420, 217],
                backgroundColor: '#9b59b6',
                borderColor: '#8e44ad',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Flight Volume to West Coast Tech Hubs'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Destination'
                    }
                }
            }
        }
    });
}

function createTechDelayComparisonChart() {
    const ctx = document.getElementById('techDelayComparisonChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['West Coast Tech', 'Other Destinations'],
            datasets: [{
                label: 'Average Delay (Minutes)',
                data: [12.26, 11.70],
                backgroundColor: ['#9b59b6', '#95a5a6'],
                borderColor: ['#8e44ad', '#7f8c8d'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Delays: Tech Corridor vs Others'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Delay (Minutes)'
                    }
                }
            }
        }
    });
}

function createTechYearlyTrendChart() {
    const ctx = document.getElementById('techYearlyTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Annual Tech Flights',
                data: [2850, 2920, 3100, 1180, 2850, 2950, 3180, 3362],
                borderColor: '#9b59b6',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Tech Corridor Flight Volume Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Annual Flights'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

function createTechWeekdayChart() {
    const ctx = document.getElementById('techWeekdayChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Number of Flights',
                data: [2931, 2821, 2754, 2806, 2890, 2115, 2125],
                backgroundColor: ['#2c3e50', '#74b9ff', '#74b9ff', '#74b9ff', '#2c3e50', '#74b9ff', '#74b9ff'],
                borderColor: ['#34495e', '#0984e3', '#0984e3', '#0984e3', '#34495e', '#0984e3', '#0984e3'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Tech Corridor Flights by Day'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day of Week'
                    }
                }
            }
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});