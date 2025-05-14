$(document).ready(function() {
  // Load projects on the dashboard
  if (window.location.pathname === '/dashboard') {
    $.get('/api/projects', function(data) {
      const projectList = $('#project-list');
      data.forEach(project => {
        projectList.append(`
          <div class="project-item">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="dates">
              <span>Start: ${new Date(project.start_date).toLocaleDateString()}</span>
              ${project.end_date ? `<span>End: ${new Date(project.end_date).toLocaleDateString()}</span>` : ''}
            </div>
          </div>
        `);
      });
    });
  }
  
  // Handle form submissions
  $('#new-project-form').on('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      name: $('#project-name').val(),
      description: $('#project-description').val(),
      start_date: $('#project-start-date').val(),
      end_date: $('#project-end-date').val() || null
    };
    
    $.post('/api/projects', formData, function(response) {
      alert('Project created successfully!');
      window.location.href = '/dashboard';
    }).fail(function() {
      alert('Failed to create project. Please try again.');
    });
  });
});