document.addEventListener('DOMContentLoaded', function() {
    
    // Session Time Selection Form Interception (Demo)
    const sessionTimeForm = document.getElementById('sessionTimeForm');
    
    if (sessionTimeForm) {
        sessionTimeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Log the selected session value
            const selectedSession = document.querySelector('input[name="sessionTime"]:checked').value;
            console.log("Selected Session Time:", selectedSession);
            
            // Grab the primary button
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving preference...';
            btn.disabled = true;
            
            // Simulate saving/redirect delay
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2 me-2"></i> Saved';
                
                // Simulate redirect to the next onboarding step
                setTimeout(() => {
                    console.log("Redirecting to next step...");
                    window.location.href = '../Areas-Of-Support/areas-of-support.html'; 
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            }, 1500);
        });
    }
});