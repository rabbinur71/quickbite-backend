const bcrypt = require("bcryptjs");

const generateHash = async () => {
  const password = "admin123";
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Generated hash for "admin123":');
  console.log(hash);
};

generateHash();
