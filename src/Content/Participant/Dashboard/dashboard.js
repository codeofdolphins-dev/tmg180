document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    // Open sidebar
    toggleBtn.addEventListener("click", function () {
        sidebar.classList.add("show");
        overlay.classList.add("show");
    });

    // Close sidebar when clicking on the dark overlay
    overlay.addEventListener("click", function () {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
    });
});
