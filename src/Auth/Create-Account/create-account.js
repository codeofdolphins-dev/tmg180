document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Password Visibility Toggle
    const toggleButtons = document.querySelectorAll('.toggle-pw');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });

    // 2. Real-time Password Strength & Registration Validation
    const regPasswordInput = document.getElementById('password');
    
    if (regPasswordInput) {
        const reqLength = document.getElementById('req-length');
        const reqNumber = document.getElementById('req-number');
        
        const strengthText = document.getElementById('strengthText');
        const bars = [
            document.getElementById('bar1'),
            document.getElementById('bar2'),
            document.getElementById('bar3'),
            document.getElementById('bar4')
        ];

        regPasswordInput.addEventListener('input', function(e) {
            const val = e.target.value;
            let checksPassed = 0;

            // Rule 1: Length >= 8
            if (val.length >= 8) {
                setCheckState(reqLength, true);
                checksPassed++;
            } else {
                setCheckState(reqLength, false);
            }

            // Rule 2: Contains Number
            if (/\d/.test(val)) {
                setCheckState(reqNumber, true);
                checksPassed++;
            } else {
                setCheckState(reqNumber, false);
            }

            // Update Strength Bars
            updateRegStrengthMeter(checksPassed, val.length);
        });
    }

    // Helper: Toggle checkmark UI
    function setCheckState(element, isMet) {
        const icon = element.querySelector('i');
        if (isMet) {
            element.classList.replace('text-muted-custom', 'text-accent');
            icon.className = 'bi bi-check-circle-fill me-2 fs-6';
        } else {
            element.classList.replace('text-accent', 'text-muted-custom');
            icon.className = 'bi bi-circle me-2 fs-6';
        }
    }

    // Helper: Update Bars and Text
    function updateRegStrengthMeter(checks, length) {
        // Reset bars
        bars.forEach(bar => bar.classList.remove('active'));
        
        if (length === 0) {
            strengthText.innerText = "NONE";
            strengthText.className = "fw-bold text-muted-custom text-uppercase strength-label";
            return;
        }

        // Logic for setting active bars
        let activeCount = 1; // Default 1 bar if typing
        if (checks === 1) activeCount = 2; // Medium
        if (checks === 2) activeCount = 3; // Strong
        if (checks === 2 && length >= 12) activeCount = 4; // Very Strong (Bonus)

        for(let i = 0; i < activeCount; i++) {
            if(bars[i]) bars[i].classList.add('active');
        }

        // Update Text Label
        strengthText.className = "fw-bold text-main text-uppercase strength-label";
        if (activeCount === 1) strengthText.innerText = "WEAK";
        if (activeCount === 2) strengthText.innerText = "MEDIUM";
        if (activeCount >= 3) strengthText.innerText = "STRONG";
    }

    // 3. Form Submission Simulation (Demo only)
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Creating...';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2 me-2"></i> Account Created!';
                setTimeout(() => {
                    window.location.href = '../Account-Details/account-details.html'; 
                }, 1500);
            }, 1500);
        });
    }
});