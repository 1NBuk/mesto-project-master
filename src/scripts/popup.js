const imagePopup = document.querySelector('.popup_type_image');

// Открытие и закрытие поп-апов
export function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

export function openImagePopup(link, name) {
    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');

    popupImage.src = link;
    popupImage.alt = name;
    popupCaption.textContent = name;

    openModal(imagePopup);
}

export function closeByEsc(evt) {
    if (evt.key === "Escape") {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
            // Удаляем слушателя, когда поп-ап закрыт
            document.removeEventListener('keydown', closeByEsc);
        }
    }
}