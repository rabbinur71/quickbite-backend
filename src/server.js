const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`QuickBite backend server running on port ${PORT}`);
  console.log(
    `Health check: https://quickbite-backend-6d7i.onrender.com/api/health`
  );
});
