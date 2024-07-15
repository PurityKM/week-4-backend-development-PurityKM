const bcrypt = require('bcrypt');

const password = 'user12##';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error(err);
    } else {
        console.log(hash);
    }
});