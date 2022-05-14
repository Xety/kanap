export default class Network
{
    /**
     *  Get the data from API with the given URL.
     *
     * @param {string} url The URL used to request the API.
     *
     * @returns {array} The products list.
     */
    static async getFromAPI(url)
    {
        const data = fetch(url)
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
            });

            return data;
    }

    /**
     * Post the order to the API with the given URL.
     *
     * @param {string} url The URL used to request the API.
     * @param {object} data The JSON data to send to the API.
     *
     * @returns {string} The orderid of the order.
     */
    static async postOrderToAPI(url, data)
    {
        const orderId = fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        })
        .then((response) => response.json())
        .then((data) => {
            return data.orderId;
        })
        .catch((error) => {
            console.error(`Error: ${error}`);
        });

        return orderId;
    }

    /**
     * Function to get the params id from the current URL.
     *
     * @returns {(string|null)} Return the id if fetched or null if not.
     */
    static getParams(param)
    {
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);

        if (searchParams.has(param)) {
            return searchParams.get(param);
        }

        return null;
    }
}