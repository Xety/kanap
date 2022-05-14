export default class LocalStorage
{
    /**
     * Separator used to build the storage key.
     *
     * @returns {string} The separator.
     */
    static separator()
    {
        return `-`;
    }

    /**
     * Function to buil a storage key regarding if the color is set or not.
     *
     * Expecting {id} format:
     * - 123456789-blue
     * - 123456789
     *
     * @param {number|string} id The id used to build the key.
     * @param {null|string} color The color used to build the key if needed.
     *
     * @returns {string} They key builded.
     */
     static getKey(id, color)
     {
         let key = id + this.separator() + color;

         // If the color is null, that means the id has already the color : 123456789-blue so we don't need to add again the color to the key.
         if (color == null) {
             key = id;
         }
         return key;
     }

    /**
     * Function to get the a local storage item with a key.
     *
     * @param {number|string} id The id to search in local storage.
     * @param {null|string} color The color used to build the id if the id does not have a color.
     *
     * @returns {string} The value from the key in the local storage.
     *
     * @throws The item does not exist in local storage.
     */
    static getItem(id, color = null)
    {
        const key = LocalStorage.getKey(id, color);

        const item = localStorage.getItem(key);

        // If the key does not exist in local storage, show an error.
        if (item == null) {
            throw(`The item with the key "${key}" does not exist in the local storage !`);
        }
        return item;
    }

    /**
     * Function to remove an item in the local storage from a given key.
     *
     * @param {number|string} id The id used to be deleted in local storage.
     * @param {null|string} color The color used to build the id if the id does not have a color.
     *
     * @returns {void}
     */
     static removeItem(id, color = null)
     {
        const key = LocalStorage.getKey(id, color);

        localStorage.removeItem(key);
     }

     /**
     * Function to set a key/value pair in the localstorage.
     *
     * @param {number|string} id The id used as key in local storage.
     * @param {null|string} color The color used to build the id if the id does not have a color.
     * @param {*} value The value to store with the key.
     *
     * @returns {void}
     */
    static setItem(id, color, value)
    {
        const key = LocalStorage.getKey(id, color);

        localStorage.setItem(key, value);
    }

    /**
     * Function to check is a key of an item exist in the local storage.
     *
     * @param {number|string} id The id used as key in local storage.
     * @param {null|string} color The color used to build the id if the id does not have a color.
     *
     * @returns {bool} Whether the item exist or not.
     */
    static existItem(id, color = null)
    {
        const key = LocalStorage.getKey(id, color);
        const item = localStorage.getItem(key);

        if (item == null) {
            return false;
        }
        return true;
    }
}