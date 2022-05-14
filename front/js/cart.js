import Elements from './Html/Elements.js';
import LocalStorage from './Storage/LocalStorage.js';
import Network from './Api/Network.js';
import ProductValidator from './Product/ProductValidator.js';
import User from './User/User.js';

class Cart extends ProductValidator
{
    /**
     * Diffine an ENUM for the type of action.
     */
    type = {
        UP: 'increase',
        DOWN: 'decrease'
    }

    /**
     * The products contructor.
     *
     * @param {object} options A list of options to pass to the constructor.
     */
    constructor(options = {})
    {
        super();

        this._baseURL = options.baseURL;
        this.maxItemQuantity = options.maxItemQuantity;
        this.minItemQuantity = options.minItemQuantity;
    }

    /**
     * Handle events in our application.
     *
     * @returns {void}
     */
     events()
     {
        // Event : #deleteItem::click
        const deleteProducts = document.getElementsByClassName("deleteItem");
        for (let i = 0; i < deleteProducts.length; i++) {
            deleteProducts[i].addEventListener('click', (product) => {
                this.deleteProduct(product.target)
            });
        }

        // Event : #itemQuantity::change
        const productsQuantity = document.getElementsByClassName("itemQuantity");
        for (let i = 0; i < productsQuantity.length; i++) {
            productsQuantity[i].addEventListener('change', (product) => {
                this.changeProductQuantity(product.target);

            });
        }

        // Event : #order::click
        const orderSubmit = document.getElementById('order');
        orderSubmit.addEventListener('click', (element) => {
            // Prevent the submit of the form.
            element.preventDefault();

            this.handleOrder();
        })
    }

    /**
     * Handle the order
     *
     * @returns {void}
     */
    async handleOrder()
    {
        const user = new User({
            firstName : document.getElementById('firstName').value,
            lastName : document.getElementById('lastName').value,
            address : document.getElementById('address').value,
            city : document.getElementById('city').value,
            email : document.getElementById('email').value
        });

        // Check the user validation.
        if (user.validate() == false) {
            return false;
        }

        // Get all keys from localStorage and remove color in each ID.
        let products = Object.keys(localStorage).map(function(productId) {
            const color =  localStorage[productId].split(',')[0];

            return productId.replace(`-${color}`,'');
        });

        // Remove duplicate ID.
        const productsSet = new Set(products);
        products = [...productsSet];

        // Convert data to JSON.
        const data = JSON.stringify({
            contact: user,
            products: products
        });

        // POST data to the API and get the orderId.
        const orderId = await Network.postOrderToAPI(`${this._baseURL}order`, data);

        //Delete the localStorage and redirect the user to the confirmation page with the orderId.
        localStorage.clear();
        document.location.href = `./confirmation.html?orderid=${orderId}`;
    }

    /**
     * Change the quantity of a product and update the localStorage and cart total.
     *
     * @param {Element} element The <input> element that has been triggered.
     *
     * @returns {bool} Whether the quantity has been changed successfully.
     */
    changeProductQuantity(element)
    {
        const article = element.closest("article");
        const id = article.dataset.id;
        const color = article.dataset.color;

        const newQuantity = element.value;
        const oldQuantity = parseInt(LocalStorage.getItem(id, color).split(',')[1]);

        let difference = {};

        //  We need to determine if the new value increase or decrease the quantity so we can do the right operation (addition or subtraction) to the total quantity.
        if (oldQuantity < newQuantity) {
            difference.type = this.type.UP;
            difference.number = newQuantity - oldQuantity;
        } else if (oldQuantity > newQuantity) {
            difference.type = this.type.DOWN;
            difference.number = oldQuantity - newQuantity;
        } else {
            // The new value is the same as the old value.
            return false;
        }

        // Check the quantity requirements.
        if (this.validateQuantity(newQuantity) == false) {
            alert(`Le nombre de Kanap doit être compris entre ${this.minItemQuantity} et ${this.maxItemQuantity}`);

            return false;
          }

        // Update the localStorage.
        LocalStorage.setItem(id, color, [color, newQuantity]);

        // Refresh the cart price and quantity.
        return this.refreshCartTotal(`${color},${difference.number}`, article, difference.type);
    }

    /**
     * Delete a product from the localStorage and DOM and refresh the cart.
     *
     * @param {Element} element The p element that the user has trigger.
     *
     * @returns {bool} Whether the product has been deleted successfully.
     */
    deleteProduct(element)
    {
        // Get the closer <article> element from the p element.
        const article = element.closest("article");
        const id = article.dataset.id;
        const color = article.dataset.color;

        // We get the color and quantity values from localStorage before deleting them.
        let product;
        if (product = LocalStorage.getItem(id, color)) {
            // Delete the product from the local storage and remove it from the DOM.
            LocalStorage.removeItem(id, color);
        } else {
            return false;
        }

        // Refresh the total price and products in our cart.
        if (this.refreshCartTotal(product, article)) {
            // Finally we can remove it from the DOM.
            article.remove();
        }

        return true;
    }

    /**
     * Refresh the Cart price and quantity after deleting a product.
     *
     * @param {string} product The product value that was stored in localStorage.
     * @param {Element} article The article element used to retrive the <p> element of the product price.
     * @param {string} type The type of the operation to apply to the cart.
     *
     * @returns {bool} Return true to indicate everything is good.
     */
    refreshCartTotal(product, article, type = this.type.DOWN)
    {
        const quantity = parseInt(product.split(',')[1]);

        // Get old price and quantity from the DOM.
        const oldQuantity = parseInt(document.getElementById('totalQuantity').textContent);
        const oldPrice = parseInt(document.getElementById('totalPrice').textContent);

        // Get the <p> element that have the price of the product.
        let productPrice = article.querySelector('.cart__item__content__description').lastChild;

        productPrice = parseInt(productPrice.textContent);

        let newQuantity;
        let newPrice;

        // Calculate the new price and quantity.
        if (type == this.type.DOWN) {
            newQuantity = oldQuantity - quantity;
            newPrice = oldPrice - (productPrice * quantity);
        } else if (type == this.type.UP) {
            newQuantity = oldQuantity + quantity;
            newPrice = oldPrice + (productPrice * quantity);
        } else {
            return false;
        }

        // Update the new price and quantity.
        document.getElementById('totalQuantity').textContent = newQuantity;
        document.getElementById('totalPrice').textContent = newPrice;

        return true
    }

    /**
     * Display all the products on the page.
     *
     * @returns {void}
     */
    async render()
    {
        const keys = Object.keys(localStorage);

        let totalPrice = 0;
        let totalProducts = 0;

        for (let i = 0; i < keys.length; i++) {
            // Split the key to separate the id and color.
            const [id, color] = keys[i].split('-');

            const quantity = parseInt(LocalStorage.getItem(keys[i]).split(',')[1]);

            // Get the product info fromm the API.
            const product = await Network.getFromAPI(this._baseURL + id);

            Elements.createProductCart(product, color, quantity);

            // Increment the totalPrice and totalProducts.
            totalPrice += product.price * quantity;
            totalProducts += quantity;
        }

        // Update the total price and total products.
        document.getElementById('totalQuantity').textContent = totalProducts;
        document.getElementById('totalPrice').textContent = totalPrice;

        // Trigger all events.
        this.events();
    }
}

// Initialize the class and the render function.
const cart = new Cart({
    baseURL: "http://localhost:3000/api/products/",
    maxItemQuantity: 100,
    minItemQuantity: 1
});
cart.render();