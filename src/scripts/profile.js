import { request } from './api.js';
import { openModal, closeModal } from './popup.js';
const profilePopup = document.querySelector('.popup_type_edit');
// Функция редактирования профиля
export function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const updatedUserData = {
        name: nameInput.value,
        about: jobInput.value
    };

    request('/users/me', { method: 'PATCH', body: JSON.stringify(updatedUserData) })
        .then((userData) => {
            profileName.textContent = userData.name;
            profileJob.textContent = userData.about;
            closeModal(profilePopup);
        })
        .catch((err) => alert('Не удалось обновить профиль.'));
}

const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
