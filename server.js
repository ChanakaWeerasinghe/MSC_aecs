const database = require('./sqlConnection');
const express = require('express')
const app = express()
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const base_url = "https://api.github.com";
var https = require('https');
const request = require('request');

app.get('/', (req, res) => {
    let owner = "ChanakaWeerasinghe";
    let repo = "Farmera-Coding-Challenge";
    let sha = "master";
    let singleRowInsert = () => {

        let query = `INSERT INTO gfg_table
                         (name, commitCount)
                     VALUES (?, ?);`;

        // Value to be inserted
        let userName = "ChanakaWeerasinghe";
        let commitCount = get_all_commits_count(owner, repo, sha);

        // Creating queries
        database.query(query, [userName,
            commitCount], (err, rows) => {
            if (err) throw err;
            console.log("Row inserted with id = "
                + rows.insertId);
        });
    };

    singleRowInsert.apply();
    res.status(200).json({
        success: {
            message: get_all_commits_count(owner, repo, sha)
        }
    });

})


app.get('/LineCount', function (req, resSend) {

    let dataJson;
    var url = 'https://api.github.com/repos/chanakaweerasinghe/Farmera-Coding-Challenge/languages';

    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            dataJson = data;
            resSend.send(data);

            console.log(data);
        }
    });

})

app.listen(8080, () => {
    console.log('Server is up on 8080')
})

function get_all_commits_count(owner, repo, sha) {
    let first_commit = get_first_commit(owner, repo);
    let compare_url =
        base_url +
        "/repos/" +
        owner +
        "/" +
        repo +
        "/compare/" +
        first_commit +
        "..." +
        sha;
    let commit_req = httpGet(compare_url);
    let commit_count = JSON.parse(commit_req)["total_commits"] + 1;
    console.log("Commit Count: ", commit_count);
    return commit_count;
}

function httpGet(theUrl, return_headers) {

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    if (return_headers) {
        return xmlHttp;
    }
    return xmlHttp.responseText;
}

function get_first_commit(owner, repo) {
    let url = base_url + "/repos/" + owner + "/" + repo + "/commits";
    let req = httpGet(url, true);
    let first_commit_hash = "";
    if (req.getResponseHeader("Link")) {
        let page_url = req
            .getResponseHeader("Link")
            .split(",")[1]
            .split(";")[0]
            .split("<")[1]
            .split(">")[0];
        let req_last_commit = httpGet(page_url);
        let first_commit = JSON.parse(req_last_commit);
        first_commit_hash = first_commit[first_commit.length - 1]["sha"];
    } else {
        let first_commit = JSON.parse(req.responseText);
        first_commit_hash = first_commit[first_commit.length - 1]["sha"];
    }
    return first_commit_hash;
}





