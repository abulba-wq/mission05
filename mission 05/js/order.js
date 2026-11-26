'use strict';
/**
 * Місія 05 — учнівський файл. Це НЕ готове рішення.
 * Місія 04 (фільтри) вже працює у js/app.js.
 * TODO-A: зв'язок картки страви з формою (частково підготовлений).
 * TODO-Б: самостійна перевірка кількості; без готового розв'язку.
 * TODO-В: валідація, підсумок і стани форми.
 */
const orderForm = document.getElementById('orderForm');
const studentNameInput = document.getElementById('studentName');
const selectedDishInput = document.getElementById('selectedDish');
const orderPrice = document.getElementById('orderPrice');
const orderSummary = document.getElementById('orderSummary');
let selectedDish = null;
studentNameInput.addEventListener('blur', () => {
    const name = studentNameInput.value.trim();
    studentNameInput.value = name;
    setFieldError('studentName', name.length < 2 ? 'Введіть ім’я щонайменше з 2 символів.' : '');
});
function isValidQuantity(value) {
    if (typeof value !== 'number' && typeof value !== 'string')
        return false;
    if (value === null || value === undefined || String(value).trim() === '')
        return false;
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity >= 1 && quantity <= 5;
}
function selectDish(dish) {
    selectedDish = dish;
    selectedDishInput.value = dish.name;
    orderPrice.textContent = `Ціна за порцію: ${dish.price} грн`;
    orderSummary.hidden = true;
    document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(({ studentName: 'nameError', studentClass: 'classError', selectedDish: 'dishError', quantity: 'quantityError' })[fieldId]);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
}
function validateOrder() {
    const classInput = document.getElementById('studentClass');
    const quantityInput = document.getElementById('quantity');
    const allowedClasses = ['10-А', '10-Б', '11-А', '11-Б', '11-В', '11-Г'];

    const name = studentNameInput.value.trim();
    studentNameInput.value = name;
    const className = classInput.value;
    const quantity = quantityInput.value;
    let isValid = true;

    if (name.length < 2) {
        setFieldError('studentName', 'Введіть ім’я щонайменше з 2 символів.');
        isValid = false;
    } else {
        setFieldError('studentName', '');
    }

    if (!allowedClasses.includes(className)) {
        setFieldError('studentClass', 'Оберіть клас зі списку.');
        isValid = false;
    } else {
        setFieldError('studentClass', '');
    }

    if (!selectedDish) {
        setFieldError('selectedDish', 'Оберіть страву в меню.');
        isValid = false;
    } else {
        setFieldError('selectedDish', '');
    }

    if (!isValidQuantity(quantity)) {
        setFieldError('quantity', 'Введіть цілу кількість порцій від 1 до 5.');
        isValid = false;
    } else {
        setFieldError('quantity', '');
    }

    return isValid;
}
function calculateTotal() {
    const quantityInput = document.getElementById('quantity');
    if (!selectedDish || !isValidQuantity(quantityInput.value))
        return null;
    return selectedDish.price * Number(quantityInput.value);
}
function resetConfirmation() {
    orderSummary.hidden = true;
}
orderForm.addEventListener('input', resetConfirmation);
orderForm.addEventListener('change', resetConfirmation);
orderForm.addEventListener('submit', event => {
    event.preventDefault();
    orderSummary.hidden = true;
    if (!validateOrder())
        return;
    const total = calculateTotal();
    if (total === null)
        return;
    const quantity = Number(document.getElementById('quantity').value);
    orderSummary.textContent =
        `Дані перевірено. Навчальне замовлення сформовано. Замовлення не надіслано\n` +
        `${selectedDish.name} × ${quantity} = ${total} грн.`;
    orderSummary.hidden = false;
});
window.CanteenOrder = { selectDish, isValidQuantity, validateOrder, calculateTotal };
