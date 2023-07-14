const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const baseUrl = "https://komiku.id/";

exports.search = (req, res) => {
    const query = req.params.query.replace(/%20/g, "+");
    Axios.get(`https://data.komiku.id/cari/?post_type=manga&s=${query}`).then((response) => {
        const $ = cheerio.load(response.data);
        const element = $(".daftar");
        const result = {};
        const data = [];
        result.message = "success";
        element.find(".bge").each(function () {
            id = $(this).find(".kan a").attr("href").replace(`${baseUrl}manga/`, "").replace("/", "");
            image = $(this).find(".bgei img").attr("data-src");
            title1 = $(this).find(".kan h3").text().replace(/\t/g, "").replace(/\n/g, "");
            title2 = $(this).find(".kan .judul2").text();
            url = $(this).find(".kan a").attr("href");
            note = $(this).find(".kan p").text().replace(/\t/g, "").replace(/\n/g, "");
            awal = {
                chapter: $(this).find(".kan .new1").eq(0).find("a span").eq(1).text(),
                url: $(this).find(".kan .new1").eq(0).find("a").attr("href"),
            };
            terbaru = {
                chapter: $(this).find(".kan .new1").eq(1).find("a span").eq(1).text(),
                url: $(this).find(".kan .new1").eq(1).find("a").attr("href"),
            };
            data.push({ id, image, title1, title2, note, url, awal, terbaru });
        });
        result.data = data;
        res.json(result);
    });
};

exports.mangaDetail = (req, res) => {
    const id = req.params.id;
    Axios.get(`${baseUrl}manga/${id}`).then((response) => {
        const $ = cheerio.load(response.data);
        const result = {};
        const info = $("#Informasi");
        result.title = info.find("tr:eq(0) td:eq(1)").text();
        result.type = info.find("tr:eq(1) td:eq(1)").text();
        result.artist = info.find("tr:eq(3) td:eq(1)").text();
        result.status = info.find("tr:eq(4) td:eq(1)").text();
        result.rating = info.find("tr:eq(5) td:eq(1)").text();
        let genre = "";
        info.find("li.genre").each(function () {
            genre += `${$(this).text()}, `;
        });
        result.readership = info.find("tr:eq(6) td:eq(1)").text();
        result.genre = genre.slice(0, -2);
        result.synopsis = $("#Judul").find(".desc").text().replace(/\t/g, "").replace(/\n/g, "");
        let chapters = [];
        let id, title, chapter, url, date;
        $("#Daftar_Chapter")
            .find("tr:not(:first)")
            .each(function () {
                id = $(this).find(".judulseries a").attr("href").slice(4, -1);
                title = $(this).find(".judulseries a").attr("title");
                chapter = $(this).find(".judulseries span").text();
                url = baseUrl + $(this).find(".judulseries a").attr("href").slice(1);
                date = $(this).find(".tanggalseries").text().replace(/\t/g, "").replace(/\n/g, "");
                chapters.push({ id, title, chapter, url, date });
            });
        result.chapters = chapters;
        res.json(result);
    });
};

exports.chapter = (req, res) => {
    const id = req.params.id;
    Axios.get(`${baseUrl}ch/${id}`).then((response) => {
        const $ = cheerio.load(response.data);
        const result = {};
        const list = [];
        result.message = "success";
        $("#Baca_Komik")
            .find("img")
            .each(function () {
                title = $(this).attr("alt");
                image = $(this).attr("src");
                list.push({ title, image });
            });
        result.data = list;
        res.json(result);
    });
};
