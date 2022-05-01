import Elements from './elements.js';

class Cart  extends Elements {

    /**
     * The products contructor.
     *
     * @param {object} options A list of options to pass to the constructor.
     */
    constructor(options = {}) {
        super();
        this._baseURL = options.baseURL;
        this._maxItemQuantity = options.maxItemQuantity;
    }


    /**
     * Get the max item quantity.
     *
     * @returns {int} The max item quantity.
     */
     get MAX_ITEM_QUANTITY() {
        return this._maxItemQuantity;
    }

    /**
     * Handle events in our application.
     *
     * @returns {void}
     */
     events() {
        // Event : #deleteItem::click
        let deleteProducts = document.getElementsByClassName("deleteItem");
        for (let i = 0; i < deleteProducts.length; i++) {
            deleteProducts[i].addEventListener('click', (product) => {
                this.deleteProduct(product.target)
            });
        }

        // Event : #itemQuantity::change
        let productsQuantity = document.getElementsByClassName("itemQuantity");
        for (let i = 0; i < productsQuantity.length; i++) {
            productsQuantity[i].addEventListener('change', (product) => {
                this.changeProductQuantity(product.target);

            });
        }

        // Event : #order::click
        let orderSubmit = document.getElementById('order');
        orderSubmit.addEventListener('click', () => {

        })
    }

    /**
     * Change the quantity of a product and update the localStorage and cart total.
     *
     * @param {Element} element The <input> element that has been triggered.
     *
     * @returns {bool} Whether the quantity has been changed successfully.
     */
    changeProductQuantity(element) {
        let article = element.closest("article");
        let id = article.dataset.id;
        let color = article.dataset.color;

        let newQuantity = element.value;
        let productValue = localStorage.getItem(id + "-" + color);
        let oldQuantity = parseInt(productValue.split(',')[1]);

        let difference = {};

        //  We need to determine if the new value increase or decrease the quantity so we can do the right operation (addition or subtraction) to the total quantity.
        if (oldQuantity < newQuantity) {
            difference.type = 'increase';
            difference.number = newQuantity - oldQuantity;
        } else if (oldQuantity > newQuantity) {
            difference.type = 'decrease';
            difference.number = oldQuantity - newQuantity;
        } else {
            // The new value is the same as the old value.
            return false;
        }

        // Check the quantity requirements.
        if (newQuantity <= 0 || newQuantity > this.MAX_ITEM_QUANTITY) {
            alert("Le nombre de Kanap doit être compris entre 1 et " + this.MAX_ITEM_QUANTITY);

            return false;
          }

        // Update the localStorage.
        localStorage.setItem(id + "-" + color, [color, newQuantity]);

        // Refresh the cart price and quantity.
        return this.refreshCartTotal(color + "," + difference.number, article, difference.type);
    }

    /**
     * Delete a product from the localStorage and DOM and refresh the cart.
     *
     * @param {Element} element The p element that the user has trigger.
     *
     * @returns {bool} Whether the product has been deleted successfully.
     */
    deleteProduct(element) {
        // Get the closer <article> element from the p element.
        let article = element.closest("article");
        let id = article.dataset.id;
        let color = article.dataset.color;

        // We get the color and quantity values from localStorage before deleting them.
        let product;
        if (product = localStorage.getItem(id + "-" + color)) {
            // Delete the product from the local storage and remove it from the DOM.
            localStorage.removeItem(id + "-" + color);
        } else {
            return false;
        }

        // Refresh the total price and products in our cart.
        if (this.refreshCartTotal(product, article)) {
            // Finally we can remove it from the DOM.
            article.remove();
        }

        return true
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
    refreshCartTotal(product, article, type = "decrease") {
        let quantity = parseInt(product.split(',')[1]);

        // Get old price and quantity from the DOM.
        let oldQuantity = document.getElementById('totalQuantity').textContent;
        let oldPrice = document.getElementById('totalPrice').textContent;

        // Get the <p> element that have the price of the product.
        let productPrice = article.closest('div').querySelector('.cart__item__content__description').lastChild;

        // Calculate the new price and quantity.
        if (type == "decrease") {
            var newQuantity = parseInt(oldQuantity) - quantity;
            var newPrice = parseInt(oldPrice) - (parseInt(productPrice.textContent) * quantity);
        } else {
            var newQuantity = parseInt(oldQuantity) + quantity;
            var newPrice = parseInt(oldPrice) + (parseInt(productPrice.textContent) * quantity);
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
    async render() {
        let keys = Object.keys(localStorage);

        let totalPrice = 0;
        let totalProducts = 0;

        for (let i = 0; i < keys.length; i++) {
            // Split the key to separate the id and color.
            let [id, color] = keys[i].split('-');

            let quantity = parseInt(localStorage.getItem(keys[i]).split(',')[1]);

            // Get the product info fromm the API.
            let product = await this.getInfoById(id);

            // Create the article element.
            let article = document.createElement('article');
            article.setAttribute('class', 'cart__item');
            article.setAttribute('data-id', product._id);
            article.setAttribute('data-color', color);

            // Create a div element, then an image element and append them to the article.
            let divItemImg = document.createElement("div");
            divItemImg.setAttribute("class", "cart__item__img");
            divItemImg.appendChild(this.imgElement(product));

            article.appendChild(divItemImg);

            // Create the div element for the item content.
            let cartItemContent = document.createElement('div');
            cartItemContent.setAttribute('class', 'cart__item__content');
            article.appendChild(cartItemContent);

            // Create the div element for the content description with title, price and color.
            let cartItemContentDescription = document.createElement('div');
            cartItemContentDescription.setAttribute('class', 'cart__item__content__description');

            let productName = document.createElement('h2');
            productName.appendChild(document.createTextNode(product.name));

            let productColor = document.createElement('p');
            productColor.appendChild(document.createTextNode(color));

            let productPrice = document.createElement('p');
            productPrice.appendChild(document.createTextNode(product.price + "€"));

            cartItemContentDescription.append(
                productName,
                productColor,
                productPrice
            );
            cartItemContent.appendChild(cartItemContentDescription);

            // Create the div element for the content settings with quantity and delete.
            let cartItemContentSettings = document.createElement('div');
            cartItemContentSettings.setAttribute('class', 'cart__item__content__settings');

            let settingsQuantity = document.createElement('div');
            settingsQuantity.setAttribute('class', 'cart__item__content__settings__quantity');

            let p = document.createElement('p');
            p.appendChild(document.createTextNode('Qté : '));

            let input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('class', 'itemQuantity');
            input.setAttribute('min', 1);
            input.setAttribute('max', 100);
            input.setAttribute('value', quantity);

            settingsQuantity.append(p, input);
            cartItemContentSettings.appendChild(settingsQuantity);

            let settingsDelete = document.createElement('div');
            settingsDelete.setAttribute('class', 'cart__item__content__settings__delete');

            let pDeleteItem = document.createElement('p');
            pDeleteItem.setAttribute('class', 'deleteItem');
            pDeleteItem.appendChild(document.createTextNode('Supprimer'));
            settingsDelete.appendChild(pDeleteItem);

            // Append the div elements settings__quantity & settings__delete to the content__settings element.
            cartItemContentSettings.append(settingsQuantity, settingsDelete);

            cartItemContent.appendChild(cartItemContentSettings);

            article.appendChild(cartItemContent);

            // Get the section items and append the article.
            let items = document.getElementById('cart__items');
            items.appendChild(article);

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

    /**
      * Get a product by it's ID.
      *
      * @param {int} id The id of the product to get.
      *
      * @returns {object} The product informations.
      */
     async getInfoById(id) {
        let product = fetch(this._baseURL + id)
        .then(function(response)  {
            return response.json();
        })
        .then(function(product) {
            return product;
        })
        .catch(function(error) {
            console.log("Erreur : " + error);
        });

        return product;
      }
}

// Initialize the class and the render function.
let cart = new Cart({
    baseURL: "http://localhost:3000/api/products/",
    maxItemQuantity: 100
});
cart.render();