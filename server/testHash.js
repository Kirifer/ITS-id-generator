const bcrypt = require('bcryptjs');

const password = 'admin123'; // desired plain text password

bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
  console.log("Stored password hash:", user.password);

});


