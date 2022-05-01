import Elements from './elements.js';

export default class Product  extends Elements {

    /**
     * The product contructor.
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
        // Event : #addToCart::click
        let addToCartBtn = document.getElementById('addToCart');
        addToCartBtn.addEventListener('click', () => {
            let product = {
                id : this.productId,
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
            return window.location.href = './cart.html';;
        });
    }

    /**
     * Validate the product with rules.
     *
     * @returns {bool} Whether the validation passes or not.
     */
    productValidation(product) {
          if (product.color == "") {
            alert('Vous devez choisir une couleur.');

            return false;
          }

          if (product.quantity <= 0 || product.quantity > this.MAX_ITEM_QUANTITY) {
            alert("Le nombre de Kanap doit être compris entre 1 et " + this.MAX_ITEM_QUANTITY);

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
    addToCart(product) {
        if(this.productExistInCart(product) == true) {
            return this.updateProductInCart(product);
        }
        localStorage.setItem(product.id + "-" + product.color, [product.color, product.quantity]);

        return true;
    }

    /**
     *  Check if the combinaison of the product+color already exist in the localStorage.
     *
     * @param {object} product The product data used to test if the product already exist.
     *
     * @returns {bool} Whether the product already exist in the localStorage.
     */
    productExistInCart(product) {
        let check = localStorage.getItem(product.id + "-" + product.color);

        if (check) {
            let color = check.split(',')[0];

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
    updateProductInCart(product) {
        let key = localStorage.getItem(product.id + "-" + product.color);

        let [originalColor, originalQuantity] = key.split(',');
        let quantity = parseInt(originalQuantity) + parseInt(product.quantity);

        if (quantity > this.MAX_ITEM_QUANTITY) {
            alert(
                "Vous avez déjà " + originalQuantity + " kanap dans votre panier. Le nombre de kanap ne peux pas dépasser " + this.MAX_ITEM_QUANTITY
            );
            return false;
        }

        localStorage.setItem(product.id + "-" + product.color, [product.color, quantity]);

        return true;
    }

    /**
     * Display the product on the page.
     *
     * @returns {void}
     */
     async render() {
        let product = await this.getInfoById();

        // Add the product image to the DOM.
        document
            .querySelector('.item__img')
            .appendChild(this.imgElement(product));

        // Change the text of the <title> element.
        document.title = product.name;

        // Add the product title, price and description to the DOM.
        document.getElementById('title').textContent = product.name;
        document.getElementById('price').textContent = product.price;
        document.getElementById('description').textContent = product.description;

        // Add each colors of the product to the option element.
        product.colors.forEach(color => {
            document.getElementById('colors').appendChild(this.optionElement(color));
        });

        // Trigger events.
        this.events();
     }

     /**
      * Get a product by it's ID.
      *
      * @returns {object} The product informations.
      */
    async getInfoById() {
        let product = fetch(this._baseURL + this.productId)
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

    /**
     * Function to get the ID of the product.
     *
     * @returns {(string|null)} Return the ID if fetched or null if not.
     */
    get productId() {
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);

        if (searchParams.has("id")) {
            return searchParams.get("id");
        }

        return null;
    }
}

// Initialize the class and the render function.
let product = new Product({
    baseURL: "http://localhost:3000/api/products/",
    maxItemQuantity: 100
});
product.render();
