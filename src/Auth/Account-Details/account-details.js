document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Profile Image Upload Interaction
    const avatarTrigger = document.getElementById('avatarUploadTrigger');
    const fileInput = document.getElementById('profileImageInput');
    
    if (avatarTrigger && fileInput) {
        // Trigger file input when clicking the avatar circle
        avatarTrigger.addEventListener('click', () => {
            fileInput.click();
        });

        // Handle file selection (Visual preview stub)
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Find the placeholder div and replace its content with the image
                    const placeholder = avatarTrigger.querySelector('.avatar-placeholder');
                    placeholder.innerHTML = `<img src="${e.target.result}" alt="Profile Preview" class="w-100 h-100 rounded-circle object-fit-cover">`;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // 2. Form Submission Interception (Demo)
    const form = document.getElementById('accountDetailsForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Grab the primary button
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving...';
            btn.disabled = true;
            
            // Simulate saving delay
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2 me-2"></i> Saved';
                
                // Simulate redirecting to Step 2 (Business Context)
                setTimeout(() => {
                    console.log("Redirecting to Step 2...");
                    window.location.href = '../Choose-WorkSpace/choose-workspace.html'; 
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            }, 1500);
        });
    }
});