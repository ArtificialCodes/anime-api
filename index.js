const express = require("express");
const app = express();
const port = 3000;
const otakudesu = require("./src/Routes/OtakudesuRoute");
const komiku = require("./src/Routes/KomikuRoute");

app.use("/otakudesu", otakudesu);
app.use("/komiku", komiku);
app.use("/", (req, res) => {
    res.send("<h1>API anime cuy!!!</h1>");
});
app.listen(port, () => {
    console.log(`app listening on port http://localhost:${port}`);
});
