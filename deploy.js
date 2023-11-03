// @ts-nocheck
const path = require('path')
const config = require('dotenv').config().parsed
const { cdn, cos } = require('@katucloud/utils')

const dirName = process.argv[2] ||''
const pushDir = path.resolve(__dirname,'./root',dirName)

cos.uploadFolder(pushDir, dirName + '/', {config})

const dirs = [
    `https://cdn.katucloud.com/${dirName}`,
    `https://${dirName === 'dev' ? 'dev.' : ''}katucloud.com/`
]

cdn.refreshDirs(dirs, {config})