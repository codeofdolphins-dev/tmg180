// Role selector toggle login
const roleButtons = document.querySelectorAll(".role-selector button");

roleButtons.forEach(button => {
    button.addEventListener("click", () => {
        
        // Remove active from all
        roleButtons.forEach(btn => {
            btn.classList.remove("active-role");
            btn.classList.add("text-muted");
        });

        // Add active to clicked
        button.classList.add("active-role");
        button.classList.remove("text-muted");
    });
});

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const toggleIcon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";

    // Toggle input type
    passwordInput.setAttribute(
        "type",
        isPassword ? "text" : "password"
    );

    // Toggle icon
    toggleIcon.classList.toggle("bi-eye");
    toggleIcon.classList.toggle("bi-eye-slash");
});