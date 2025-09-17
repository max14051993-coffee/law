const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const backToTop = document.getElementById('backToTop');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('is-open')) {
            navLinks.classList.remove('is-open');
            navToggle?.classList.remove('is-open');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    });
});

function handleFormSubmit(form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const initialText = button.textContent;
        button.disabled = true;
        button.textContent = 'Заявка отправлена';
        button.classList.add('is-success');

        form.querySelector('.form-success')?.remove();
        const note = document.createElement('p');
        note.className = 'form-success';
        note.textContent = 'Спасибо! Мы свяжемся с вами в течение рабочего дня.';
        form.appendChild(note);

        setTimeout(() => {
            button.disabled = false;
            button.textContent = initialText;
            button.classList.remove('is-success');
            note.remove();
            form.reset();
        }, 5000);
    });
}

['heroForm', 'contactForm'].forEach((id) => {
    const form = document.getElementById(id);
    if (form) {
        handleFormSubmit(form);
    }
});

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 320) {
            backToTop.classList.add('is-visible');
            backToTop.setAttribute('aria-hidden', 'false');
        } else {
            backToTop.classList.remove('is-visible');
            backToTop.setAttribute('aria-hidden', 'true');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Visual feedback for success state
const style = document.createElement('style');
style.textContent = `
    button.is-success {
        background: linear-gradient(135deg, #4cbf65, #5edc7a);
        box-shadow: 0 18px 35px rgba(76, 191, 101, 0.35);
    }
    .form-success {
        margin-top: 16px;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.78);
    }
`;
document.head.appendChild(style);

const modalTriggers = document.querySelectorAll('[data-modal-target="privacyModal"]');
const privacyModal = document.getElementById('privacyModal');
let activeModal = null;
let lastFocusedElement = null;

const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function openModal(modal) {
    if (!modal) return;
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const dialog = modal.querySelector('.modal__dialog');
    dialog?.focus();
    activeModal = modal;
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    activeModal = null;
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(privacyModal);
    });
});

privacyModal?.querySelectorAll('[data-close="modal"]').forEach((element) => {
    element.addEventListener('click', () => {
        closeModal(privacyModal);
    });
});

privacyModal?.addEventListener('click', (event) => {
    if (event.target === privacyModal) {
        closeModal(privacyModal);
    }
});

privacyModal?.addEventListener('keydown', (event) => {
    if (!activeModal) return;
    if (event.key === 'Tab') {
        const focusable = Array.from(privacyModal.querySelectorAll(focusableSelector)).filter(
            (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
        );
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) {
        closeModal(activeModal);
    }
});
