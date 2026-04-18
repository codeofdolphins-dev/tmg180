document.addEventListener('DOMContentLoaded', function() {
    
    // Areas of Support Form Interception (Demo)
    const supportAreasForm = document.getElementById('supportAreasForm');
    
    if (supportAreasForm) {
        supportAreasForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Gather all selected support areas
            const selectedAreas = [];
            const checkboxes = document.querySelectorAll('input[name="supportArea"]:checked');
            checkboxes.forEach((cb) => {
                selectedAreas.push(cb.value);
            });
            
            console.log("Selected Areas of Support:", selectedAreas);
            
            // Grab the primary button
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving preferences...';
            btn.disabled = true;
            
            // Simulate saving/redirect delay
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2 me-2"></i> Saved';
                
                // Simulate redirect to the next dashboard step
                setTimeout(() => {
                    console.log("Redirecting...");
                    window.location.href = '../Onboarding-Complete/onboarding-complete.html'; 
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            }, 1500);
        });
        
        // Handle the SKIP button
        const skipBtn = supportAreasForm.querySelector('.btn-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("User skipped support selection. Redirecting...");
                window.location.href = '../Onboarding-Complete/onboarding-complete.html';
            });
        }
    }
});