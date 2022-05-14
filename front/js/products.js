import Elements from './Html/Elements.js';
import Network from './Api/Network.js';

class Products
{
    /**
     * The products contructor.
     *
     * @param {object} options A list of options to pass to the constructor.
     */
    constructor(options = {})
    {
        this._baseURL = options.baseURL;
    }

    /**
     * Display all the products on the page.
     *
     * @returns {void}
     */
    async render()
    {
        const products = await Network.getFromAPI(this._baseURL);

        products.forEach(product => {
            // Create product HTML.
            Elements.createProductIndex(product);
        });
    }
}

// Initialize the class and the render function.
const products = new Products({
    baseURL: "http://localhost:3000/api/products"
});
products.render();