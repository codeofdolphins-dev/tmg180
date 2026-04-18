// for pop-up modal
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('newPasswordForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevents page reload

            // Show the Bootstrap modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            // Reset the form
            form.reset();

            // Redirect to the sign-in page after 3 seconds
            setTimeout(() => {
                window.location.href = 'sign-in.html';
            }, 5000);

            return false;
        });
    }
});