var { execSync } = require("child_process");
var deploy = process.argv[2];
var fs = require("fs");
var path = require("path");

if (deploy) {
    const upload = "scp -i " + process.env['HOME']+ '/testing.pem' + " -r " + path.resolve("./dist/sfw-pdv-dashboard/") + '/* ' + "ubuntu@ec2-3-7-71-38.ap-south-1.compute.amazonaws.com:/home/ubuntu/hosts/" + deploy + "/";
    const uploadVerDetails = "scp -i " + process.env['HOME']+ '/testing.pem' + " -r " + path.resolve("./") + '/lastCommit.json ' + "ubuntu@ec2-3-7-71-38.ap-south-1.compute.amazonaws.com:/home/ubuntu/hosts/" + deploy + "/configs/";
    const versionDirCreate = "ssh -i " + process.env['HOME']+ '/testing.pem' + " " + "ubuntu@ec2-3-7-71-38.ap-south-1.compute.amazonaws.com"+ " \"mkdir -p /home/ubuntu/hosts/" + deploy + "/$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[\", ]//g')\"";
    const versionUpload = "scp -i " + process.env['HOME']+ '/testing.pem' + " -r "+ path.resolve("./dist/sfw-pdv-dashboard/") + '/*' +" " + "ubuntu@ec2-3-7-71-38.ap-south-1.compute.amazonaws.com"+ ":/home/ubuntu/hosts/" + deploy +"/$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[\", ]//g')";

    // console.log(upload, versionDirCreate, versionUpload);
    execSync(upload);
    execSync(uploadVerDetails);
    execSync(versionDirCreate);
    execSync(versionUpload);
} else {
    console.log('please give deployment name');
}