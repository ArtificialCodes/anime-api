const express = require("express");
const app = express();
const port = 3000;
const otakudesu = require("./Routes/OtakudesuRoute");
const komiku = require("./Routes/KomikuRoute");

app.use("/otakudesu", otakudesu);
app.use("/komiku", komiku);
app.use("/", (req, res) => {
    res.send("<h1>API anime cuy!!!</h1>");
});
app.listen(port, () => {
    console.log(`app listening on port http://localhost:${port}`);
});
