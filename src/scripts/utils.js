// Вспомогательные функции, если нужно
export function showCardInputError(inputElement) {
    const errorElement = document.querySelector(`#${inputElement.id}-error`);
    if (!inputElement.validity.valid) {
        errorElement.textContent = inputElement.validationMessage;
    } else {
        errorElement.textContent = '';
    }
}
