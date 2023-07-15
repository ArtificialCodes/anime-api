const express = require("express");
const router = express.Router();
const OtakudesuController = require("../Controllers/OtakudesuController");

router.get("/home/:page", OtakudesuController.home);
router.get("/anime-list", OtakudesuController.animeList);
router.get("/search/:query", OtakudesuController.search);
router.get("/anime/:id", OtakudesuController.detailAnime);
router.get("/eps/:id", OtakudesuController.epsAnime);
router.get("/eps/mirror/:id", OtakudesuController.epsMirror);

module.exports = router;
