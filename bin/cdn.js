require('dotenv').config()
const tencentcloud = require("tencentcloud-sdk-nodejs-cdn");

const CdnClient = tencentcloud.cdn.v20180606.Client;

const clientConfig = {
  credential: {
    secretId: process.env['SecretId'],
    secretKey: process.env['SecretKey'],
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "cdn.tencentcloudapi.com",
    },
  },
};

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new CdnClient(clientConfig);


function refreshDirs(dirs){
    const params = {
        Paths: dirs,
        FlushType: "delete"
    };
    client.PurgePathCache(params).then(
        (data) => {
          console.log(data);
        },
        (err) => {
          console.error("error", err);
        }
      );
}

const dirName = process.argv[2]
const dirs = [
    `https://cdn.katucloud.com/${dirName||''}`
]
console.log('刷新 CDN 目录:', dirs)
refreshDirs(dirs)