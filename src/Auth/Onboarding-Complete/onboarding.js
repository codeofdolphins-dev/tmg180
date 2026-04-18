document.addEventListener('DOMContentLoaded', function() {
    
    // Onboarding Completion Form Submission (Demo)
    const completionForm = document.getElementById('completionForm');
    
    if (completionForm) {
        completionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Grab the primary button
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Finishing setup...';
            btn.disabled = true;
            
            // Simulate saving/redirect delay
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2 me-2"></i> Launching Dashboard';
                
                // Simulate redirect to the main app dashboard
                setTimeout(() => {
                    console.log("Redirecting to the main dashboard...");
                    // window.location.href = 'dashboard.html'; 
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            }, 1500);
        });
    }
});