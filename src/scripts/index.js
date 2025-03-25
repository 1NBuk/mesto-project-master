import './utils.js';
import './profile.js';
import './card.js';
import './popup.js';
import './form.js';
import './api.js';

import { request, getInitialCards, getUserInfo} from './api.js';
import {renderCards} from "./card.js";
import {handleProfileFormSubmit} from "./profile.js";
import {handleCardFormSubmit, toggleProfileButtonState, toggleCardButtonState} from "./form.js";
import { openModal, closeModal, closeByEsc } from './popup.js';
import '../pages/index.css';


// Находим все нужные поп-апы
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Кнопки для управления поп-апами
const profileEditButton = document.querySelector('.profile__edit-button');
const cardAddButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Элементы формы редактирования профиля
const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

// Элементы на странице, которые нужно обновить
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

// Обработчик открытия поп-апа редактирования профиля
profileEditButton.addEventListener('click', () => {
    // Заполняем поля формы текущими значениями
    nameInput.value = profileName.textContent;
    jobInput.value = profileJob.textContent;
    openModal(profilePopup);
});


// Привязываем обработчик к событию submit
profileFormElement.addEventListener('submit', handleProfileFormSubmit);
nameInput.addEventListener('input', toggleProfileButtonState);
jobInput.addEventListener('input', toggleProfileButtonState);

// Элементы формы добавления карточки
const cardFormElement = cardPopup.querySelector('.popup__form');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

// Кнопка сохранения
const cardSubmitButton = cardFormElement.querySelector('.popup__button');

// Обработчики для полей ввода
cardNameInput.addEventListener('input', () => {
    showCardInputError(cardNameInput);
    toggleCardButtonState();
});

cardLinkInput.addEventListener('input', () => {
    showCardInputError(cardLinkInput);
    toggleCardButtonState();
});

cardFormElement.addEventListener('submit', (evt) => {
    if (userData) {
        handleCardFormSubmit(evt, userData._id);
    } else {
        console.error('Данные пользователя не загружены');
        alert('Не удалось загрузить данные пользователя. Пожалуйста, обновите страницу.');
    }
});

// Обработчик открытия поп-апа добавления карточки
cardAddButton.addEventListener('click', () => {
    // Очищаем поля формы
    cardFormElement.reset();
    toggleCardButtonState(); // Инициализация состояния кнопки
    openModal(cardPopup);
});

// Общий обработчик закрытия поп-апов по клику на оверлей
closeButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
        const popup = evt.target.closest('.popup');
        closeModal(popup);
    });
});

// Обработчик закрытия поп-апа по клику на оверлей
document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('click', (evt) => {
        if (evt.target === popup) { // Проверяем, что клик был именно по оверлею, а не по содержимому поп-апа
            closeModal(popup);
        }
    });
});


// Функция для открытия поп-апа и установки слушателя клавиши Esc
function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEsc); // Добавляем слушателя
}

// Пример закрытия поп-апа при клике на кнопку
document.querySelectorAll('.popup__close').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
        const popup = closeButton.closest('.popup');
        closeModal(popup);
        document.removeEventListener('keydown', closeByEsc); // Убираем слушателя при закрытии поп-апа
    });
});

// Пример открытия поп-апа, например, при клике на кнопку
document.querySelector('.profile__edit-button').addEventListener('click', () => {
    const popup = document.querySelector('.popup_type_edit');
    openPopup(popup);
});
let userData = null;
// Функция для загрузки данных пользователя
function loadUserData() {
    if (userData) {
        return Promise.resolve(userData);
    }

    return getUserInfo()
        .then((data) => {
            userData = data;
            // Обновляем аватар при загрузке
            if (data.avatar) {
                profileImage.style.backgroundImage = `url(${data.avatar})`;
            }
            return data;
        })
        .catch((err) => {
            console.error('Ошибка при загрузке данных пользователя:', err);
            alert('Не удалось загрузить данные пользователя. Пожалуйста, попробуйте позже.');
            throw err;
        });
}
// Загружаем карточки и данные пользователя
Promise.all([getInitialCards(), loadUserData()])
    .then(([cards, loadedUserData]) => {  // Используем другое имя переменной, чтобы не перезаписать глобальную
        // Сохраняем данные пользователя
        userData = loadedUserData;

        // Рендерим карточки с передачей ID текущего пользователя
        renderCards(cards, userData._id);

        // Обновляем информацию о пользователе
        profileName.textContent = userData.name;
        profileJob.textContent = userData.about;

        // Обновляем аватар, если он есть
        if (userData.avatar) {
            profileImage.style.backgroundImage = `url(${userData.avatar})`;
        }
    })
    .catch((err) => {
        console.error('Ошибка при загрузке данных:', err);
    });

const avatarEditButton = document.querySelector('.profile__edit-avatar-button');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarInput = avatarPopup.querySelector('.popup__input_type_avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarSubmitButton = avatarPopup.querySelector('.popup__button');
const profileImage = document.querySelector('.profile__image');

// Обработчик открытия поп-апа редактирования аватара
avatarEditButton.addEventListener('click', () => {
    // Всегда очищаем поле при открытии
    avatarInput.value = '';
    // Сбрасываем валидацию
    toggleAvatarButtonState();
    openModal(avatarPopup);
});

// Привязываем обработчик к полю ввода
avatarInput.addEventListener('input', toggleAvatarButtonState);

// Проверка валидности формы редактирования аватара
function checkAvatarFormValidity() {
    return avatarForm.checkValidity();
}

// Переключение состояния кнопки "Сохранить"
function toggleAvatarButtonState() {
    if (checkAvatarFormValidity()) {
        avatarSubmitButton.classList.remove('popup__button_disabled');
        avatarSubmitButton.disabled = false;
    } else {
        avatarSubmitButton.classList.add('popup__button_disabled');
        avatarSubmitButton.disabled = true;
    }
}

// Обработчик отправки формы редактирования аватара
function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation(); // Добавляем для предотвращения всплытия

    const avatarUrl = avatarInput.value.trim();
    if (!avatarUrl) {
        alert('Пожалуйста, введите ссылку на аватар.');
        return;
    }

    // Блокируем кнопку на время отправки
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Сохранение...';

    request('/users/me/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: avatarUrl })
    })
        .then((userData) => {
            // Обновляем данные пользователя
            userData = userData; // Сохраняем новые данные
            profileImage.style.backgroundImage = `url(${userData.avatar})`;
            closeModal(avatarPopup);
            avatarInput.value = '';
        })
        .catch((err) => {
            console.error('Ошибка:', err);
            alert(`Ошибка: ${err.message || 'Не удалось обновить аватар'}`);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
}

// Привязка обработчика к форме редактирования аватара
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

export function showCardInputError(inputElement) {
    const errorElement = document.querySelector(`[data-error-for="${inputElement.name}"]`);
    if (errorElement) {
        if (!inputElement.validity.valid) {
            errorElement.textContent = inputElement.validationMessage;
        } else {
            errorElement.textContent = '';
        }
    } else {
        console.error(`Элемент для отображения ошибки не найден: ${inputElement.name}`);
    }
}

