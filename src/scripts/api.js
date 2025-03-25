import { updateLikeState } from "./card.js";

const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
    headers: {
        authorization: '7a281d96-0085-4080-8333-a1e42293bc2d',
        'Content-Type': 'application/json'
    }
};
let userInfoCache = null;

// Функция для выполнения запросов
export function request(url, options) {
    return fetch(`${config.baseUrl}${url}`, {
        ...options,
        headers: config.headers,
    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then(err => Promise.reject(`Ошибка: ${res.status} - ${err.message}`));
            }
            return res.json();
        });
}

// Функция для получения данных пользователя с кэшированием
export function getUserInfo() {
    if (userInfoCache) {
        return Promise.resolve(userInfoCache);
    }

    return request('/users/me', { method: 'GET' })
        .then((data) => {
            userInfoCache = data;
            return data;
        });
}

export function clearUserCache() {
    userInfoCache = null;
}

// Остальные функции остаются без изменений
export function getInitialCards() {
    return request('/cards', { method: 'GET' });
}

export function likeCard(cardId, currentUserId) {
    return request(`/cards/likes/${cardId}`, { method: 'PUT' })
        .then((updatedCard) => {
            updateLikeState(updatedCard, currentUserId);
            return updatedCard;
        });
}

export function unlikeCard(cardId, currentUserId) {
    return request(`/cards/likes/${cardId}`, { method: 'DELETE' })
        .then((updatedCard) => {
            updateLikeState(updatedCard, currentUserId);
            return updatedCard;
        });
}
