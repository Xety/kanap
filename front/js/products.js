import Elements from './elements.js';

class Products  extends Elements {

    /**
     * The products contructor.
     *
     * @param {object} options A list of options to pass to the constructor.
     */
    constructor(options = {}) {
        super();
        this._baseURL = options.baseURL;
    }

    /**
     *  Get all the products from the API.
     *
     * @returns {array} The products list.
     */
    async getProducts() {
        let products = fetch(this._baseURL)
        .then((response) => response.json())
        .then((products) => {
            return products;
        })
        .catch(function(error) {
            console.log("Erreur : " + error);
        });

        return products;
    }

    /**
     * Display all the products on the page.
     *
     * @returns {void}
     */
    async render() {
        let products = await this.getProducts();

        products.forEach(product => {
            // Create article and append the img, h3 and p elements.
            let article = document.createElement("article");
            article.append(
                this.imgElement(product),
                this.h3Element(product),
                this.pElement(product)
            );

            // Create the link a element and add the href attribute
            let a = this.aElement(product)
            // Append the article element with all it's contains to the link a element.
            a.append(article);

            // Finally add the a element to the DOM.
            document.getElementById("items").append(a);

        });
    }
}

// Initialize the class and the render function.
let products = new Products({
    baseURL: "http://localhost:3000/api/products"
});
products.render();