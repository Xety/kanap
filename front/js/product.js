import Elements from './Html/Elements.js';
import LocalStorage from './Storage/LocalStorage.js';
import Network from './Api/Network.js';
import ProductValidator from './Product/ProductValidator.js';

class Product extends ProductValidator
{
    /**
     * The product contructor.
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
        // Event : #addToCart::click
        const addToCartBtn = document.getElementById('addToCart');
        addToCartBtn.addEventListener('click', () => {
            const product = {
                id : Network.getParams("id"),
                color: document.getElementById('colors').value,
                quantity: document.getElementById('quantity').value,
            };

            // Validate the product details.
            if (this.productValidation(product) == false) {
                return;
            }

            // Add the product to the cart.
            if (this.addToCart(product) == false) {
                return;
            }

            // Redirect the user to the cart page.
            return window.location.href = './cart.html';
        });
    }

    /**
     * Validate the product with rules.
     *
     * @returns {bool} Whether the validation passes or not.
     */
    productValidation(product)
    {
        if (product.color == "") {
            alert(`Vous devez choisir une couleur.`);

            return false;
        }

        if (this.validateQuantity(product.quantity) == false) {
            alert(`Le nombre de Kanap doit être compris entre ${this.minItemQuantity} et ${this.maxItemQuantity}`);

            return false;
        }

        return true;
    }

    /**
     * Fonction to add a product to the cart or update an existing one.
     *
     * @param {object} product The product data to be stored.
     *
     * @returns {bool} Whether the item was added to the cart or not.
     */
    addToCart(product)
    {
        if(this.productExistInCart(product) == true) {
            return this.updateProductInCart(product);
        }
        LocalStorage.setItem(product.id, product.color, [product.color, product.quantity]);

        return true;
    }

    /**
     *  Check if the combinaison of the product+color already exist in the localStorage.
     *
     * @param {object} product The product data used to test if the product already exist.
     *
     * @returns {bool} Whether the product already exist in the localStorage.
     */
    productExistInCart(product)
    {
        const exist = LocalStorage.existItem(product.id, product.color);

        if (exist == true) {
            const item = LocalStorage.getItem(product.id, product.color);
            const color = item.split(',')[0];

            return color === product.color;
        }
        return false;
    }

    /**
     *  Update an existing product in the localStorage.
     *
     * @param {object} product The product data used to update the stored product.
     *
     * @returns {bool} Whether the product has been updated successfully in the localStorage.
     */
    updateProductInCart(product)
    {
        const values = LocalStorage.getItem(product.id, product.color);

        const originalQuantity = values.split(',')[1];
        const quantity = parseInt(originalQuantity) + parseInt(product.quantity);

        if (quantity > this.MAX_ITEM_QUANTITY) {
            alert(
                `Vous avez déjà ${originalQuantity} kanap dans votre panier. Le nombre de kanap ne peux pas dépasser ${this.MAX_ITEM_QUANTITY}`
            );
            return false;
        }
        LocalStorage.setItem(product.id, product.color, [product.color, quantity]);

        return true;
    }

    /**
     * Display the product on the page.
     *
     * @returns {void}
     */
     async render()
     {
        const product = await Network.getFromAPI(this._baseURL + Network.getParams("id"));

        // Add the product image to the DOM.
        document
            .querySelector('.item__img')
            .appendChild(Elements.imgElementIndex(product));

        // Change the text of the <title> element.
        document.title = product.name;

        // Add the product title, price and description to the DOM.
        document.getElementById('title').textContent = product.name;
        document.getElementById('price').textContent = product.price;
        document.getElementById('description').textContent = product.description;

        // Add each colors of the product to the option element.
        product.colors.forEach(color => {
            document.getElementById('colors').appendChild(Elements.optionElementProduct(color));
        });

        // Trigger events.
        this.events();
     }
}

// Initialize the class and the render function.
const product = new Product({
    baseURL: "http://localhost:3000/api/products/",
    maxItemQuantity: 100,
    minItemQuantity: 1
});
product.render();
