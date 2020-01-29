module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = 'Username is missing';
    }

    if (email.trim() === '') {
        errors.email = 'Email is missing';
    } else {
        const emailRegex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

        if (!email.match(emailRegex)) {
            errors.email = 'Email must be a valid email address';
        }
    }

    if (password.trim() === '') {
        errors.password = 'Password is missing';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = 'Username is missing';
    }

    if (password.trim() === '') {
        errors.password = 'Password is missing';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}