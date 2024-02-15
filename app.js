//show hidden pass
const eyeIcon = document.querySelector('#login-eye');
const passwordEl = document.querySelector('#login-pass');

eyeIcon.addEventListener("click", () => {
    if (eyeIcon.classList.contains("fa-eye-slash")) {
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
        passwordEl.setAttribute("type", "password");
    } else {
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
        passwordEl.setAttribute("type", "text");
    }
});

//try fix