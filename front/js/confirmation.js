import Network from './Api/Network.js';

class Confirmation
{
    /**
     * Display the orderid on the page.
     *
     * @returns {void}
     */
     render()
     {
        const orderId = Network.getParams("orderid");

        document
            .getElementById('orderId')
            .appendChild(document.createTextNode(orderId));
     }
}

// Initialize the class and the render function.
const confirmation = new Confirmation();
confirmation.render();
