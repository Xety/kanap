export default class ProductValidator
{
    /**
     * Get the max item quantity.
     *
     * @returns {int} The max item quantity.
     */
    get maxItemQuantity()
    {
        return this.MAX_ITEM_QUANTITY;
    }

    /**
     * Set the max item quantity.
     *
     * @returns {void}
     */
    set maxItemQuantity(quantity)
    {
        this.MAX_ITEM_QUANTITY = quantity;
    }

    /**
     * Get the min item quantity.
     *
     * @returns {int} The max item quantity.
     */
     get minItemQuantity()
     {
         return this.MIN_ITEM_QUANTITY;
     }

     /**
      * Set the min item quantity.
      *
      * @returns {void}
      */
     set minItemQuantity(quantity)
     {
         this.MIN_ITEM_QUANTITY = quantity;
     }


     /**
      * Function to validate the given quantity to the max and min quantity requirements.
      *
      * @param {number} quantity The quantity to check.
      *
      * @returns {bool} Whether the item exist or not.
      */
     validateQuantity(quantity)
     {
        if (quantity < this.minItemQuantity || quantity > this.maxItemQuantity) {
            return false;
        }
        return true;
     }
}