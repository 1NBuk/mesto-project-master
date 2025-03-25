import {getInitialCards, getUserInfo, request, likeCard, unlikeCard} from './api.js';
import { openImagePopup } from './popup.js';


// Функция удаления карточки
export function deleteCard(cardId) {
    request(`/cards/${cardId}`, { method: 'DELETE' })
        .then(() => {
            const cardElement = document.querySelector(`[data-id="${cardId}"]`);
            if (cardElement) {
                cardElement.remove();
            }
        })
        .catch((err) => {
            console.error('Ошибка при удалении карточки:', err);
            alert('Не удалось удалить карточку. Пожалуйста, попробуйте ещё раз.');
        });
}

// Функция создания карточки
export function createCard({ name, link, _id, owner, likes }, currentUserId) {
    const cardTemplate = document.querySelector('#card-template').content.querySelector(".card");
    const cardElement = cardTemplate.cloneNode(true);
    cardElement.setAttribute('data-id', _id);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');

    cardImage.src = link;
    cardImage.alt = name;
    cardTitle.textContent = name;
    likeCount.textContent = likes.length;

    // Убираем запрос к getUserInfo() и сразу используем currentUserId
    if (currentUserId !== owner._id) {
        deleteButton.style.display = 'none';
    } else {
        deleteButton.addEventListener('click', () => deleteCard(_id));
    }

    if (likes.some((like) => like._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    likeButton.addEventListener('click', () => {
        const cardId = cardElement.getAttribute('data-id');
        if (likeButton.classList.contains('card__like-button_is-active')) {
            unlikeCard(cardId, currentUserId)
                .then(() => {
                    likeButton.classList.remove('card__like-button_is-active');
                });
        } else {
            likeCard(cardId, currentUserId)
                .then(() => {
                    likeButton.classList.add('card__like-button_is-active');
                });
        }
    });

    cardImage.addEventListener('click', () => openImagePopup(link, name));

    return cardElement;
}


export function renderCards(cards, currentUserId) {
    const placesList = document.querySelector('.places__list');
    placesList.innerHTML = ''; // Очистка списка перед рендерингом
    cards.forEach((cardData) => {
        const card = createCard(cardData, currentUserId);
        placesList.append(card);
    });
}

export function updateLikeState(updatedCard, currentUserId) {
    const cardElement = document.querySelector(`[data-id="${updatedCard._id}"]`);
    if (!cardElement) return;

    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');

    // Обновление количества лайков
    likeCount.textContent = updatedCard.likes.length;

    // Обновление состояния кнопки лайка
    if (updatedCard.likes.some((like) => like._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    } else {
        likeButton.classList.remove('card__like-button_is-active');
    }
}