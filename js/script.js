const menuButton = document.querySelector('.header__menu');
const navigation = document.querySelector('.header__nav');

menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');

    menuButton.setAttribute('aria-expanded', String(isOpen));

    menuButton.setAttribute(
        'aria-label',
        isOpen ? 'Закрыть меню' : 'Открыть меню'
    );
});

const navigationLinks = navigation.querySelectorAll('a');

navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
    }
});

const galleryImages = document.querySelectorAll('.gallery__grid img');

const prevButton = document.querySelector(
    '.gallery__arrow[data-direction="prev"]'
);

const nextButton = document.querySelector(
    '.gallery__arrow[data-direction="next"]'
);

const photos = Array.from(galleryImages, (image) => ({
    src: image.getAttribute('src'),
    alt: image.alt
}));

let currentIndex = 0;

function renderGallery() {
    galleryImages.forEach((image, position) => {
        const photoIndex = (currentIndex + position) % photos.length;
        const photo = photos[photoIndex];

        image.src = photo.src;
        image.alt = photo.alt;
    });
}

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % photos.length;
    renderGallery();
});

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    renderGallery();
});

const phoneInputs = document.querySelectorAll('input[type="tel"]');

function getPhoneDigits(value) {
    return value.replace(/\D/g, '');
}

function formatPhone(value) {
    let digits = getPhoneDigits(value);

    if (!digits) {
        return '';
    }

    if (digits[0] === '7' || digits[0] === '8') {
        digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    let result = '+7';

    if (digits.length > 0) {
        result += ' (' + digits.slice(0, 3);
    }

    if (digits.length >= 3) {
        result += ')';
    }

    if (digits.length > 3) {
        result += ' ' + digits.slice(3, 6);
    }

    if (digits.length > 6) {
        result += '-' + digits.slice(6, 8);
    }

    if (digits.length > 8) {
        result += '-' + digits.slice(8, 10);
    }

    return result;
}

phoneInputs.forEach((input) => {
    input.addEventListener('input', () => {
        input.value = formatPhone(input.value);
    });
});

function validatePhone(value) {
    const digits = getPhoneDigits(value);

    if (digits.length === 0) {
        return 'Введите номер телефона';
    }

    if (digits.length !== 11) {
        return 'Введите номер полностью';
    }

    return '';
}

function showPhoneError(input, message) {
    input.classList.add('is-error');
    input.setAttribute('aria-invalid', 'true');

    let error = input.parentElement.querySelector('.input-error');

    if (!error) {
        error = document.createElement('span');
        error.classList.add('input-error');

        input.insertAdjacentElement('afterend', error);
    }

    error.textContent = message;
}

function clearPhoneError(input) {
    input.classList.remove('is-error');
    input.removeAttribute('aria-invalid');

    const error = input.parentElement.querySelector('.input-error');

    if (error) {
        error.remove();
    }
}

function showFormSuccess(form) {
    let message = form.querySelector('.form-success');

    if (!message) {
        message = document.createElement('p');
        message.classList.add('form-success');
        message.setAttribute('role', 'status');

        form.append(message);
    }

    message.textContent =
        'Номер проверен. Это демонстрационная форма, данные не отправлены.';
}

function clearFormSuccess(form) {
    const message = form.querySelector('.form-success');

    if (message) {
        message.remove();
    }
}

const phoneForms = document.querySelectorAll(
    '.expert__form, .location__booking-form'
);

phoneForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const input = form.querySelector('input[type="tel"]');
        const errorMessage = validatePhone(input.value);

        clearFormSuccess(form);

        if (errorMessage) {
            showPhoneError(input, errorMessage);
            return;
        }

        clearPhoneError(input);
        showFormSuccess(form);

        form.reset();
    });
});

phoneInputs.forEach((input) => {
    input.addEventListener('input', () => {
        const form = input.closest('form');

        clearFormSuccess(form);

        if (!input.classList.contains('is-error')) {
            return;
        }

        const errorMessage = validatePhone(input.value);

        if (errorMessage) {
            showPhoneError(input, errorMessage);
        } else {
            clearPhoneError(input);
        }
    });
});
