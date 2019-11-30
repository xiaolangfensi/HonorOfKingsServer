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
const FileSystem = require("fs");
const mylogger_1 = require("../src/common/mylogger");
const utils_1 = require("../src/common/utils");
const xml2tsconfig_1 = require("./xml2tsconfig");
var ArgumentCommandEnum;
(function (ArgumentCommandEnum) {
    ArgumentCommandEnum["MAKEALL"] = "-makeall";
    ArgumentCommandEnum["MAKE"] = "-make";
    ArgumentCommandEnum["ADDALL"] = "-addall";
    ArgumentCommandEnum["ADD"] = "-add";
})(ArgumentCommandEnum || (ArgumentCommandEnum = {}));
class Main {
    static main() {
        return __awaiter(this, void 0, void 0, function* () {
            let args = process.argv;
            if (args.length >= 3) {
                switch (args[2].toLowerCase()) {
                    case ArgumentCommandEnum.MAKEALL:
                        for (let pathFile of utils_1.default.readDir('./conf')) {
                            yield Main.convertXML2Config(pathFile);
                        }
                        Main.addConfigFiles('src/module/configmanager');
                        break;
                    case ArgumentCommandEnum.ADD: //加Config到指定的文件内
                        if (!args[3]) {
                            mylogger_1.myLogger.error('缺少需要生成文件的文件名字。');
                            return -2;
                        }
                        let pathFile = `${args[2]}`;
                        if (!FileSystem.existsSync(`${pathFile}.xml`)) {
                            mylogger_1.myLogger.error(`${pathFile}.xml 文件不存在`);
                            return -1;
                        }
                        Main.convertXML2Config(pathFile);
                        break;
                    case ArgumentCommandEnum.ADDALL: //加Config到指定的文件内
                        if (args[3]) {
                            Main.addConfigFiles(args[3]);
                        }
                        else {
                            Main.addConfigFiles();
                        }
                        break;
                    case ArgumentCommandEnum.ADD: //加Config到指定的文件内
                        if (args.length <= 5) {
                            xml2tsconfig_1.XML2TSConfig.getInstance().addConfig(args[3], args[4]);
                        }
                        else {
                            mylogger_1.myLogger.error('参数个数有问题');
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
                mylogger_1.myLogger.error(`参数不对，至少包含一个参数才可以运行。`);
            }
            return Promise.resolve;
        });
    }
    static convertXML2Config(pathFile) {
        return __awaiter(this, void 0, void 0, function* () {
            // let fileName = Path.basename(pathFile, '.xml');
            yield xml2tsconfig_1.XML2TSConfig.getInstance().generateTSConfig(pathFile);
            return Promise.resolve;
        });
    }
    static addConfigFiles(destFile = 'src/module/configmanager') {
        for (let pathFile of utils_1.default.readDir('./tools/autots', '.ts')) {
            xml2tsconfig_1.XML2TSConfig.getInstance().addConfig(`${pathFile}`, destFile);
        }
    }
}
Main.main();
//# sourceMappingURL=makeconfig.js.map