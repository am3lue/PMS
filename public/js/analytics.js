/**
 * Analytics JavaScript
 * Handles data visualization and analytics functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dateRangeSelector = document.getElementById('date-range');
    const exportButtons = document.querySelectorAll('.export-btn');
    
    // Charts
    let componentTypeChart;
    let componentStatusChart;
    let projectTimelineChart;
    let componentUsageChart;
    let projectProgressChart;
    
    // Initialize charts
    initCharts();
    
    // Event Listeners
    dateRangeSelector.addEventListener('change', updateCharts);
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const chartContainer = this.closest('.dashboard-card').querySelector('canvas');
            exportChart(chartContainer, format);
        });
    });
    
    // Functions
    function initCharts() {
        // Component Type Distribution Chart
        const componentTypeCtx = document.getElementById('component-type-chart').getContext('2d');
        componentTypeChart = new Chart(componentTypeCtx, {
            type: 'pie',
            data: {
                labels: ['Magnetic Sensors', 'Microcontrollers', 'Display Units', 'Power Systems', 'Other'],
                datasets: [{
                    data: [25, 30, 15, 20, 10],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc',
                        '#f6c23e',
                        '#e74a3b'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function updateComponentTypeChart(data) {
        if (!window.componentTypeChart) return;
        
        window.componentTypeChart.data.labels = data.labels;
        window.componentTypeChart.data.datasets[0].data = data.data;
        window.componentTypeChart.update();
        
        // Update summary below chart
        updateChartSummary('component-type-summary', data);
    }
    
    // Component Status Chart
    function initComponentStatusChart() {
        const ctx = document.getElementById('component-status-chart');
        if (!ctx) return;
        
        window.componentStatusChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Components by Status',
                    data: [],
                    backgroundColor: [
                        '#10b981', // Available - green
                        '#3b82f6', // In Use - blue
                        '#f59e0b', // Testing - amber
                        '#ef4444'  // Deprecated - red
                    ],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw || 0;
                                return `${value} components`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
    
    function updateComponentStatusChart(data) {
        if (!window.componentStatusChart) return;
        
        window.componentStatusChart.data.labels = data.labels;
        window.componentStatusChart.data.datasets[0].data = data.data;
        window.componentStatusChart.update();
        
        // Update summary below chart
        updateChartSummary('component-status-summary', data);
    }
    
    // Project Timeline Chart
    function initProjectTimelineChart() {
        const ctx = document.getElementById('project-timeline-chart');
        if (!ctx) return;
        
        window.projectTimelineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Start Date',
                    data: [],
                    backgroundColor: '#3b82f6',
                    borderWidth: 0,
                    borderRadius: 4
                }, {
                    label: 'End Date',
                    data: [],
                    backgroundColor: '#ef4444',
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatDate(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month',
                            displayFormats: {
                                month: 'MMM yyyy'
                            }
                        },
                        grid: {
                            display: true,
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
    
    function updateProjectTimelineChart(data) {
        if (!window.projectTimelineChart) return;
        
        // Convert string dates to Date objects
        const startDates = data.startDates.map(date => new Date(date));
        const endDates = data.endDates.map(date => new Date(date));
        
        window.projectTimelineChart.data.labels = data.projects;
        window.projectTimelineChart.data.datasets[0].data = startDates;
        window.projectTimelineChart.data.datasets[1].data = endDates;
        window.projectTimelineChart.update();
    }
    
    // Component Usage Chart
    function initComponentUsageChart() {
        const ctx = document.getElementById('component-usage-chart');
        if (!ctx) return;
        
        window.componentUsageChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Component Usage',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw || 0;
                                return `${value} components in use`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
    
    function updateComponentUsageChart(data) {
        if (!window.componentUsageChart) return;
        
        window.componentUsageChart.data.labels = data.labels;
        window.componentUsageChart.data.datasets[0].data = data.data;
        window.componentUsageChart.update();
    }
    
    // Project Progress Chart
    function initProjectProgressChart() {
        const ctx = document.getElementById('project-progress-chart');
        if (!ctx) return;
        
        window.projectProgressChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Current Progress',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Target Progress',
                    data: [],
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw || 0;
                                return `${context.dataset.label}: ${value}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function updateProjectProgressChart(data) {
        if (!window.projectProgressChart) return;
        
        window.projectProgressChart.data.labels = data.projects;
        window.projectProgressChart.data.datasets[0].data = data.currentProgress;
        window.projectProgressChart.data.datasets[1].data = data.targetProgress;
        window.projectProgressChart.update();
    }
});