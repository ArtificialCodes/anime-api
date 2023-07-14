const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const baseUrl = "https://otakudesu.lol/";

exports.animeList = (req, res) => {
    Axios.get(baseUrl + "anime-list").then((response) => {
        const $ = cheerio.load(response.data);
        const element = $("#abtext");
        let animeList = [];
        let titleList = [];
        let abjact, title, link, id;
        element.find(".bariskelom").each(function () {
            abjact = $(this).find(".barispenz > a").text();
            titleList = [];
            $(this)
                .find(".penzbar:not(:first)")
                .each(function () {
                    title = $(this).find(".hodebgst").text();
                    link = $(this).find(".hodebgst").attr("href");
                    id = link.replace(baseUrl + "anime/", "");
                    titleList.push({ title, id, link });
                });
            animeList.push({ abjact, titleList });
        });
        res.json({ animeList });
    });
};
exports.search = (req, res) => {
    const query = req.params.query;
    const fullUrl = `${baseUrl}?s=${query}&post_type=anime`;
    Axios.get(fullUrl).then((response) => {
        const $ = cheerio.load(response.data);
        const element = $(".page");
        let obj = {};
        let anime_list = [];
        (obj.status = "success"), (obj.baseUrl = fullUrl);
        if (element.find("ul > li").length === 0) {
            obj.search_results = [];
        } else {
            element.find("ul > li").each(function () {
                const genre_list = [];
                $(this)
                    .find(".set")
                    .find("a")
                    .each(function () {
                        const genre_result = {
                            genre_title: $(this).text(),
                            genre_link: $(this).attr("href"),
                            genre_id: $(this).attr("href").replace(`${baseUrl}genres/`, ""),
                        };
                        genre_list.push(genre_result);
                    });
                const results = {
                    thumb: $(this).find("img").attr("src"),
                    title: $(this).find("h2").text(),
                    link: $(this).find("h2 > a").attr("href"),
                    id: $(this).find("h2 > a").attr("href").replace(`${baseUrl}anime/`, ""),
                    status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
                    score: parseFloat($(this).find(".set").eq(2).text().replace("Rating : ", "")),
                    genre_list,
                };
                anime_list.push(results);
                obj.search_results = anime_list;
            });
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(obj);
    });
};
exports.detailAnime = async (req, res) => {
    const id = req.params.id;
    const fullUrl = baseUrl + `anime/${id}`;
    try {
        const response = await Axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const detailElement = $(".venser").find(".fotoanime");
        let object = {};
        let episode_list = [];
        object.thumb = detailElement.find("img").attr("src");
        object.anime_id = req.params.id;
        let genre_name, genre_id, genre_link;
        let genreList = [];
        object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc").find("p").text();
        detailElement.find(".infozin").filter(function () {
            object.title = $(this).find("p").children().eq(0).text().replace("Judul: ", "");
            object.japanase = $(this).find("p").children().eq(1).text().replace("Japanese: ", "");
            object.score = parseFloat($(this).find("p").children().eq(2).text().replace("Skor: ", ""));
            object.producer = $(this).find("p").children().eq(3).text().replace("Produser:  ", "");
            object.type = $(this).find("p").children().eq(4).text().replace("Tipe: ", "");
            object.status = $(this).find("p").children().eq(5).text().replace("Status: ", "");
            object.total_episode = parseInt($(this).find("p").children().eq(6).text().replace("Total Episode: ", ""));
            object.duration = $(this).find("p").children().eq(7).text().replace("Durasi: ", "");
            object.release_date = $(this).find("p").children().eq(8).text().replace("Tanggal Rilis: ", "");
            object.studio = $(this).find("p").children().eq(9).text().replace("Studio: ", "");
            $(this)
                .find("p")
                .children()
                .eq(10)
                .find("span > a")
                .each(function () {
                    genre_name = $(this).text();
                    genre_id = $(this)
                        .attr("href")
                        .replace(baseUrl + "genres/", "");
                    genre_link = $(this).attr("href");
                    genreList.push({ genre_name, genre_id, genre_link });
                    object.genre_list = genreList;
                });
        });
        $("#venkonten > div.venser > div:nth-child(8) > ul > li").each((i, element) => {
            const dataList = {
                title: $(element).find("span > a").text(),
                id: $(element)
                    .find("span > a")
                    .attr("href")
                    .replace(baseUrl + "episode/", ""),
                link: $(element).find("span > a").attr("href"),
                uploaded_on: $(element).find(".zeebr").text(),
            };
            episode_list.push(dataList);
        });
        object.episode_list =
            episode_list.length === 0
                ? [
                      {
                          title: "Masih kosong cuy",
                          id: "Masih kosong cuy",
                          link: "Masih kosong cuy",
                          uploaded_on: "Masih kosong cuy",
                      },
                  ]
                : episode_list;
        res.json(object);
    } catch (err) {
        console.log(err);
    }
};
exports.epsAnime = async (req, res) => {
    const id = req.params.id;
    const fullUrl = `${baseUrl}episode/${id}`;
    try {
        const response = await Axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const streamElement = $("#lightsVideo").find("#embed_holder");
        const obj = {};
        obj.title = $(".venutama > h1").text();
        obj.baseUrl = fullUrl;
        obj.id = fullUrl.replace(baseUrl, "");
        const streamLink = streamElement.find("iframe").attr("src");
        obj.link_stream = streamLink;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(obj);
    } catch (err) {
        console.log(err);
    }
};
