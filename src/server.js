const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` QuickBite backend server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});
