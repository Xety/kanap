export default class Elements {

    /**
     *  Create the img element.
     *
     * @param {object} product The product used to build the content.
     *
     * @returns HTMLParagraphElement The html element.
     */
    imgElement(product) {
        let img = document.createElement("img");

        img.setAttribute("src", product.imageUrl);
        img.setAttribute("alt", product.altTxt);

        return img;
    }

    /**
     *  Create the h3 element.
     *
     * @param {object} product The product used to build the content.
     *
     * @returns HTMLParagraphElement The html element.
     */
     h3Element(product) {
        let h3 = document.createElement("h3");

        h3.setAttribute("class", "productName");
        h3.textContent = product.name;

        return h3;
    }

    /**
     *  Create the p element.
     *
     * @param {object} product The product used to build the content.
     *
     * @returns HTMLParagraphElement The html element.
     */
     pElement(product) {
        let p = document.createElement("p");

        p.setAttribute("class", "productDescription");
        p.textContent = product.description;

        return p;
    }

    /**
     *  Create the a element.
     *
     * @param {object} product The product used to build the content.
     *
     * @returns HTMLParagraphElement The html element.
     */
     aElement(product) {
        let a = document.createElement('a');
        a.setAttribute("href", `./product.html?id=${product._id}`);

        return a;
    }

    /**
     *  Create the a element.
     *
     * @param {object} product The product used to build the content.
     *
     * @returns HTMLParagraphElement The html element.
     */
     optionElement(color) {
        let option = document.createElement('option');
        option.setAttribute('value', color);
        option.textContent = color;

        return option
    }
}