export default class UserValidator
{
    /**
     * Validate the firstname of the user.
     *
     * @param {string} firstname The firstname of the user.
     *
     * @returns {bool} Whether the validation is successful.
     */
    validateFirstname(firstname)
    {
        if (/^[a-zA-Z -]{2,20}$/.test(firstname) == false) {
            document.getElementById("firstNameErrorMsg").textContent = "Votre prénom n'est pas valide.";

            setTimeout(function(){
                document.getElementById("firstNameErrorMsg").textContent = "";
            }, 3000);

            return false;
        }

        return true;
    }

    /**
     * Validate the lastname of the user.
     *
     * @param {string} lastname The lastname of the user.
     *
     * @returns {bool} Whether the validation is successful.
     */
    validateLastname(lastname)
    {
        if (/^[a-zA-Z -]{2,20}$/.test(lastname) == false) {
            document.getElementById("lastNameErrorMsg").textContent = "Votre nom n'est pas valide.";

            setTimeout(function(){
                document.getElementById("lastNameErrorMsg").textContent = "";
            }, 3000);

            return false;
        }

        return true;
    }

    /**
     * Validate the lastname of the user.
     *
     * @param {string} lastname The lastname of the user.
     *
     * @returns {bool} Whether the validation is successful.
     */
    validateAddress(lastname)
    {
        if (/^[a-zA-Z0-9 -_]{3,60}$/.test(lastname) == false) {
            document.getElementById("addressErrorMsg").textContent = "Votre adresse n'est pas valide.";

            setTimeout(function(){
                document.getElementById("addressErrorMsg").textContent = "";
            }, 3000);

            return false;
        }

        return true;
    }

    /**
     * Validate the city of the user.
     *
     * @param {string} city The city of the user.
     *
     * @returns {bool} Whether the validation is successful.
     */
    validateCity(city)
    {
        if (/^[a-zA-Z0-9 -_]{3,60}$/.test(city) == false) {
            document.getElementById("cityErrorMsg").textContent = "Votre ville n'est pas valide.";

            setTimeout(function(){
                document.getElementById("cityErrorMsg").textContent = "";
            }, 3000);

            return false;
        }

        return true;
    }

    /**
     * Validate the email of the user.
     *
     * @param {string} email The email of the user.
     *
     * @returns {bool} Whether the validation is successful.
     */
    validateEmail(email)
    {
        if (/^\S+@\S+\.\S+$/.test(email) == false) {
            document.getElementById("emailErrorMsg").textContent = "Votre email n'est pas valide.";

            setTimeout(function() {
                document.getElementById("emailErrorMsg").textContent = "";
            }, 3000);

            return false;
        }

        return true;
    }
}