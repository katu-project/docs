const path = require('path')
const utils = require('@katucloud/utils')
const cdn = utils.getAction('cdn')
const cos = utils.getAction('cos')

const dirName = process.argv[2] ||''
const pushDir = path.resolve(__dirname,'./root',dirName)

cos.uploadFolder(pushDir, dirName + '/')

const dirs = [
    `https://cdn.katucloud.com/${dirName}`
]

cdn.refreshDirs(dirs)