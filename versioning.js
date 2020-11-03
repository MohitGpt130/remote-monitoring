const exec = require('child_process').exec
var { execSync } = require("child_process");
var gitLastCommit = require('git-last-commit');
var gitTags = require('git-tags');
var moment = require('moment');

var fs = require("fs");

fs.writeFileSync('a', 'a');
execSync("git add -A");
execSync("git commit -m 'build'");
execSync("npm version patch");
execSync("node timestamp");
fs.unlinkSync("a");

gitLastCommit.getLastCommit(function (err, commit) {
    console.log(commit);
    gitTags.latest(function(err, latest) {
        if(err) return;
        var v = latest.split('.');
        const commitMgs = [];
        v[latest.split('.').length-1] = latest.split('.')[latest.split('.').length-1] -1
        const latestBefore = v.join('.');
        exec('git log --pretty=oneline '+latestBefore+'...'+latest, (err, stdout, stderr) => {
            const list = stdout.split('\n');
            var flg = false;
            list.forEach(c => {
                if(c !== '' && flg) {
                    commitMgs.push(c.split(' ')[1])
                }
                flg = true;
            });
            commit['version'] = latest;
            commit['deployedOn'] = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
            commit['commitMessages'] = commitMgs;
            commit['newFeatures'] = commitMgs;
            commit['deployedBy'] = commit.author.name;
            commit['emailMessage'] = 
                'Commit Hash:' + commit.hash + '\n' +
                'Deployed Version:' + latest + '\n' +
                'Deployed by:' + commit.author.name + '\n' +
                'Commit Features:\n\t->' + commitMgs.join('\n\t->') + '\n' +
                '';
            fs.writeFileSync('lastCommit.json', JSON.stringify(commit));
            execSync("git add -A");
            execSync("git commit -m 'post-build'");
            execSync("git push -u origin master -f");
        })
    });
});