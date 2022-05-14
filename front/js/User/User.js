import UserValidator from './UserValidator.js';

export default class User extends UserValidator
{

    /**
     * Constructor.
     *
     * @param {object} user The user informations to set to the class.
     */
    constructor(user = {})
    {
        super();

        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.address = user.address;
        this.city = user.city;
        this.email = user.email;
    }

    /**
     * Validate the user informations.
     *
     * @returns {bool} Whether the validation is successful.
     */
    validate()
    {
        let validate = true;

        if (this.validateFirstname(this.firstName) == false) {
            validate = false;
        }

        if (this.validateLastname(this.lastName) == false) {
            validate = false;
        }

        if (this.validateAddress(this.address) == false) {
            validate = false;
        }

        if (this.validateCity(this.city) == false) {
            validate = false;
        }

        if (this.validateEmail(this.email) == false) {
            validate = false;
        }

        return validate;
    }
}