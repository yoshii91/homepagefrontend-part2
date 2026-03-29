const { buildApp } = require("./app");
const config = require("./config");

const app = buildApp();

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
