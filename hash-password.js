const bcrypt = require('bcrypt');

const password = 'student1'; // Replace with the password to hash
const saltRounds = 10; // Number of salt rounds (10 is standard)

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
});