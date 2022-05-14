export default class Elements
{

    /**
     * Create all the HTML for a product displayed on the index page.
     *
     * @param {object} product The product used to build the HTML.
     *
     * @returns {void}
     */
    static createProductIndex(product)
    {
        const article = document.createElement("article");
        article.append(
            Elements.imgElementIndex(product),
            Elements.h3ElementIndex(product),
            Elements.pElementIndex(product)
        );

        // Create the link a element and add the href attribute
        const a = Elements.aElementIndex(product)
        // Append the article element with all it's contains to the link a element.
        a.append(article);

        // Finally add the a element to the DOM.
        document.getElementById("items").append(a);
    }

    /**
     *  Create the img element.
     *
     * @param {object} product The product used to build the HTML.
     *
     * @returns {HTMLImageElement} The HTML image element.
     */
    static imgElementIndex(product)
    {
        const img = document.createElement("img");

        img.setAttribute("src", product.imageUrl);
        img.setAttribute("alt", product.altTxt);

        return img;
    }

    /**
     *  Create the h3 element.
     *
     * @param {object} product The product used to build the HTML.
     *
     * @returns {HTMLHeadingElement} The HTML heading element.
     */
    static h3ElementIndex(product)
    {
        const h3 = document.createElement("h3");

        h3.setAttribute("class", "productName");
        h3.textContent = product.name;

        return h3;
    }

    /**
     *  Create the p element.
     *
     * @param {object} product The product used to build the HTML.
     *
     * @returns {HTMLParagraphElement} The HTML paragraph element.
     */
    static pElementIndex(product)
    {
        const p = document.createElement("p");

        p.setAttribute("class", "productDescription");
        p.textContent = product.description;

        return p;
    }

    /**
     *  Create the a element.
     *
     * @param {object} product The product used to build the HTML.
     *
     * @returns {HTMLAnchorElement} The HTML anchor element.
     */
    static aElementIndex(product)
    {
        const a = document.createElement('a');
        a.setAttribute("href", `./product.html?id=${product._id}`);

        return a;
    }

    /**
     * Create a HTML product and add it to the cart page.
     *
     * @param {object} product The product data used to build the HTML.
     * @param {string} color The color of the product.
     * @param {number} quantity The quantity of the product.
     *
     * @returns {void}
     */
    static createProductCart(product, color, quantity)
    {
        // Create the article element.
        const article = Elements.articleElementCart(product._id, color);

        // Create a div element, then an image element and append them to the article.
        const divItemImg = document.createElement("div");
        divItemImg.setAttribute("class", "cart__item__img");
        divItemImg.appendChild(Elements.imgElementIndex(product));

        article.appendChild(divItemImg);

        // Create the div element for the item content.
        const cartItemContent = document.createElement('div');
        cartItemContent.setAttribute('class', 'cart__item__content');
        article.appendChild(cartItemContent);

        // Create the div element for the content description with title, price and color.
        const cartItemContentDescription = document.createElement('div');
        cartItemContentDescription.setAttribute('class', 'cart__item__content__description');

        const productName = document.createElement('h2');
        productName.appendChild(document.createTextNode(product.name));

        const productColor = document.createElement('p');
        productColor.appendChild(document.createTextNode(color));

        const productPrice = document.createElement('p');
        productPrice.appendChild(document.createTextNode(product.price + "€"));

        cartItemContentDescription.append(
            productName,
            productColor,
            productPrice
        );
        cartItemContent.appendChild(cartItemContentDescription);

        // Create the div element for the content settings with quantity and delete.
        const cartItemContentSettings = document.createElement('div');
        cartItemContentSettings.setAttribute('class', 'cart__item__content__settings');

        const settingsQuantity = document.createElement('div');
        settingsQuantity.setAttribute('class', 'cart__item__content__settings__quantity');

        const p = document.createElement('p');
        p.appendChild(document.createTextNode('Qté : '));

        const input = Elements.inputElementCart(quantity);

        settingsQuantity.append(p, input);
        cartItemContentSettings.appendChild(settingsQuantity);

        const settingsDelete = document.createElement('div');
        settingsDelete.setAttribute('class', 'cart__item__content__settings__delete');

        const pDeleteItem = document.createElement('p');
        pDeleteItem.setAttribute('class', 'deleteItem');
        pDeleteItem.appendChild(document.createTextNode('Supprimer'));
        settingsDelete.appendChild(pDeleteItem);

        // Append the div elements settings__quantity & settings__delete to the content__settings element.
        cartItemContentSettings.append(settingsQuantity, settingsDelete);

        cartItemContent.appendChild(cartItemContentSettings);

        article.appendChild(cartItemContent);

        // Get the section items and append the article.
        const items = document.getElementById('cart__items');
        items.appendChild(article);
    }

    /**
     *  Create the a element.
     *
     * @param {object} product The product used to build the HTML.
     *
     * @returns {HTMLOptionElement} The HTML option element.
     */
    static optionElementProduct(color)
    {
        const option = document.createElement('option');
        option.setAttribute('value', color);
        option.textContent = color;

        return option;
    }

    /**
     * Create the article element used with a product on cart page.
     *
     * @param {string} id The id of the product.
     * @param {string} color The color of the product.
     *
     * @returns {HTMLElement} The HTML article element.
     */
    static articleElementCart(id, color)
    {
        const article = document.createElement('article');
        article.setAttribute('class', 'cart__item');
        article.setAttribute('data-id', id);
        article.setAttribute('data-color', color);

        return article;
    }

    /**
     * Create the input element used with a product on cart page.
     *
     * @param {number} quantity The quantity of product.
     *
     * @returns {HTMLInputElement} The HTML input element.
     */
    static inputElementCart(quantity)
    {
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('class', 'itemQuantity');
        input.setAttribute('min', 1);
        input.setAttribute('max', 100);
        input.setAttribute('value', quantity);

        return input;
    }
}