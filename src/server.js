const app = require('./app');
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});