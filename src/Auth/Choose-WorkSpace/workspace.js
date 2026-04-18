document.addEventListener('DOMContentLoaded', function() {
    
    // Workspace Selection Form Interception (Demo)
    const workspaceForm = document.getElementById('workspaceForm');
    
    if (workspaceForm) {
        workspaceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Grab the selected workspace value
            const selectedWorkspace = document.querySelector('input[name="workspaceRole"]:checked').value;
            console.log("Selected Workspace:", selectedWorkspace);
            
            // Grab the primary button
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Setting up...';
            btn.disabled = true;
            
            // Simulate saving/redirect delay
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2 me-2"></i> Complete';
                
                // Simulate redirect to the main dashboard
                setTimeout(() => {
                    console.log("Redirecting to dashboard...");
                    window.location.href = '../Session-Time/session-time.html'; 
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            }, 1500);
        });
    }
});