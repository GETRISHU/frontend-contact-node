document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageTextarea = document.getElementById('message');
    const messageCounter = document.getElementById('message-counter');

    messageTextarea.addEventListener('input', function () {
        const currentLength = this.value.length;
        const maxLength = this.getAttribute('maxlength');
        messageCounter.textContent = `${currentLength}/${maxLength} characters`;

        if (currentLength > maxLength * 0.9) {
            messageCounter.className = 'message-counter error';
        } else if (currentLength > maxLength * 0.75) {
            messageCounter.className = 'message-counter warning';
        } else {
            messageCounter.className = 'message-counter';
        }
    });

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const data = {
            name: document.getElementById('user_name').value,
            email: document.getElementById('user_email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('https://backend-nodejs-form.onrender.com/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            showToast(result.message, response.ok ? 'success' : 'danger');

            if (response.ok) contactForm.reset();
        } catch (err) {
            console.error(err);
            showToast('Server error. Try again later.', 'danger');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function showToast(message, type) {
        const toastEl = document.getElementById('toast');
        const toastBody = toastEl.querySelector('.toast-body');
        toastEl.classList.remove('text-bg-success', 'text-bg-danger');
        toastEl.classList.add(`text-bg-${type}`);
        toastBody.textContent = message;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
});
