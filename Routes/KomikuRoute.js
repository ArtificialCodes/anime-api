const express = require("express");
const router = express.Router();
const KomikuController = require("../Controllers/KomikuController");

router.get("/search/:query", KomikuController.search);
router.get("/manga-detail/:id", KomikuController.mangaDetail);
router.get("/chapter/:id", KomikuController.chapter);

module.exports = router;
