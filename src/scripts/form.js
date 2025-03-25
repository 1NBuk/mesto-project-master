import { request } from './api.js';
import { createCard } from "./card.js";
import { closeModal } from './popup.js';
import {handleProfileFormSubmit} from "./profile";

const cardPopup = document.querySelector('.popup_type_new-card');
const cardFormElement = cardPopup.querySelector('.popup__form');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');
const cardSubmitButton = cardFormElement.querySelector('.popup__button');
const placesList = document.querySelector('.places__list');
const profilePopup = document.querySelector('.popup_type_edit');
const profileFormElement = profilePopup.querySelector('.popup__form');

// Добавляем параметр currentUserId
export function handleCardFormSubmit(evt, currentUserId) {
    evt.preventDefault();

    const name = cardNameInput.value;
    const link = cardLinkInput.value;

    const newCardData = { name, link };

    // Блокируем кнопку на время отправки
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Сохранение...';

    request('/cards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCardData)
    })
        .then((newCard) => {
            const newCardElement = createCard(newCard, currentUserId);
            placesList.prepend(newCardElement);
            closeModal(cardPopup);
            cardFormElement.reset();
        })
        .catch((err) => {
            console.error('Ошибка при добавлении карточки:', err);
            alert('Не удалось добавить карточку. Попробуйте снова.');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
}


export function checkProfileFormValidity() {
    return profileFormElement.checkValidity();
}

export function toggleProfileButtonState() {
    if (checkProfileFormValidity()) {
        profileFormElement.querySelector('.popup__button').classList.remove('popup__button_disabled');
        profileFormElement.querySelector('.popup__button').disabled = false;
    } else {
        profileFormElement.querySelector('.popup__button').classList.add('popup__button_disabled');
        profileFormElement.querySelector('.popup__button').disabled = true;
    }
}

export function checkCardFormValidity() {
    return cardFormElement.checkValidity();
}

export function toggleCardButtonState() {
    if (checkCardFormValidity()) {
        cardSubmitButton.classList.remove('popup__button_disabled');
        cardSubmitButton.disabled = false;
    } else {
        cardSubmitButton.classList.add('popup__button_disabled');
        cardSubmitButton.disabled = true;
    }
}
