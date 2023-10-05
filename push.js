require('dotenv').config()
var util = require('./util');
var path = require('path');
var COS = require('cos-nodejs-sdk-v5');

const config = {
    SecretId: process.env['SecretId'],
    SecretKey: process.env['SecretKey'],
    Bucket: process.env['Bucket'],
    Region: process.env['Region'],
}

var cos = new COS({
    // 必选参数
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
    // 可选参数
    FileParallelLimit: 3, // 控制文件上传并发数
    ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
    ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
    Proxy: '',
    Protocol: 'https:',
    FollowRedirect: false,
});

function uploadFolder(localFolder, remotePrefix) {
    util.fastListFolder(localFolder, function (err, list) {
        if (err) return console.error(err);
        let files = list.map(function (file) {
            var filename = path.relative(localFolder, file.path).replace(/\\/g, '/');
            if (filename && file.isDir && !filename.endsWith('/')) filename += '/';
            var Key = remotePrefix + filename;
            return {
                Bucket: config.Bucket,
                Region: config.Region,
                Key: Key,
                FilePath: file.path,
            };
        });

        files = files.filter(e=>!e.FilePath.endsWith('.DS_Store'))
        cos.uploadFiles(
            {
                files: files,
                SliceSize: 1024 * 1024,
                onFileFinish: function (err, data, options) {
                    console.log(options.Key + ' 上传' + (err ? '失败' : '完成'));
                },
            },
            function (err, data) {
                // console.log(err || data);
            },
        );
    });
}

const pushDir = path.join(__dirname,process.argv[2])
const cosDir = process.argv[3]
uploadFolder(pushDir, cosDir)