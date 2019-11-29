"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//模块导入
const FileSystem = require("fs-extra");
const ts_simple_ast_1 = require("ts-simple-ast");
const url = require("url");
const request = require("request");
const https = require("https");
const Path = require("path");
const Exec = require("child_process");
//获取url选项
function getOptions(urlString) {
    let _url = url.parse(urlString);
    let headers = {
        'User-Agent': 'insideria'
    };
    let token = process.env['INSIDERIA_TOKEN'];
    if (token) {
        headers['Authorization'] = 'token ' + token;
    }
    return {
        protocol: _url.protocol,
        host: _url.host,
        port: _url.port,
        path: _url.path,
        headers: headers
    };
}
//从web服务器下载文件
function download(url, redirectCount) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((c, e) => {
            var content = '';
            https.get(getOptions(url), function (response) {
                response.on('data', function (data) {
                    content += data.toString();
                }).on('end', function () {
                    if (response.statusCode === 403 && response.headers['x-ratelimit-remaining'] === '0') {
                        e('GitHub API rate exceeded. Set GITHUB_TOKEN environment variable to increase rate limit.');
                        return;
                    }
                    let count = redirectCount || 0;
                    if (count < 5 && response.statusCode >= 300 && response.statusCode <= 303 || response.statusCode === 307) {
                        let location = response.headers['location'];
                        if (location) {
                            console.log("Redirected " + url + " to " + location);
                            download(location, count + 1).then(c, e);
                            return;
                        }
                    }
                    c(content);
                });
            }).on('error', function (err) {
                e(err.message);
            });
        });
    });
}
//生成框架
class ServerFramework {
    static Main() {
        if (ServerFramework._instance == null) {
            ServerFramework._instance = new ServerFramework();
        }
        ServerFramework._instance.NewServer();
    }
    //读取结果
    ConsoleRead(prompt = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (prompt !== '') {
                process.stdout.write(`${prompt}:`);
            }
            process.stdin.resume();
            process.stdin.setEncoding('utf-8');
            return new Promise((resolve, reject) => {
                process.stdin.on('data', (chunk) => {
                    process.stdin.pause();
                    return resolve(chunk);
                }).on('error', () => {
                    process.stdin.pause();
                    return reject('@ERROR&NAME');
                });
            });
        });
    }
    NewServer() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('下面开始。。。。');
            console.log('创建文件');
            this._ast = new ts_simple_ast_1.default();
            yield this.CreateAllFiles(); //等待创建所有框架文件
        });
    }
    //创建所有的框架文件
    CreateAllFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let BASE_URL = 'http://holytech.insideria.cn:3010';
                let version = 'v1';
                let test = yield this.asyncRequest({
                    url: `${BASE_URL}/version`,
                    method: 'GET',
                    headers: {}
                });
                //获取所有的文件
                let baseFiles = JSON.parse(test);
                for (let baseFileItem of baseFiles.files) {
                    let a = yield this.asyncRequest({
                        url: `${baseFileItem.src}`,
                        method: 'GET'
                    });
                    //读取文件内容
                    let content = JSON.parse(a);
                    let fileContent = new Buffer(content.content, 'base64').toString();
                    if (baseFileItem.dst == "main.ts") {
                        FileSystem.createFile(baseFileItem.dst); //在本地创建文件
                        FileSystem.outputFile(baseFileItem.dst, fileContent); //向本地文件中写入内容
                    }
                    else {
                        FileSystem.ensureDirSync(Path.dirname(baseFileItem.dst)); //确认文件目录是否存在，若不存在，创建文件夹
                        FileSystem.createFile(baseFileItem.dst); //在本地创建文件
                        FileSystem.outputFile(baseFileItem.dst, fileContent); //向本地文件中写入内容
                    }
                }
                //获取框架中需要引入的模块
                let dependencies = JSON.parse(test);
                for (let dependency of dependencies.dependencies) {
                    Exec.exec(`npm install ${dependency} --save`); //调用命令行执行安装模块命令
                }
            }
            catch (e) {
                console.log(e.message);
            }
        });
    }
    //获取消息体
    asyncRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(body);
                    }
                });
            });
        });
    }
}
ServerFramework.Main();
//# sourceMappingURL=serverframework.js.map