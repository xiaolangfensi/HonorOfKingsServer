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
const ts_simple_ast_1 = require("ts-simple-ast");
const FileSystem = require("fs");
const Path = require("path");
const mylogger_1 = require("../src/common/mylogger");
const utils_1 = require("../src/common/utils");
class XML2TSConfig {
    static getInstance() {
        if (!this._instance) {
            this._instance = new XML2TSConfig();
        }
        return this._instance;
    }
    constructor() {
        mylogger_1.myLogger.info(`当前工作目录：${process.cwd()}`);
        this._ast = new ts_simple_ast_1.default();
    }
    checkFolderExist(folder) {
        return FileSystem.existsSync(folder);
    }
    removeExistFile(pathFile) {
        try {
            if (FileSystem.existsSync(pathFile)) {
                FileSystem.unlinkSync(pathFile);
            }
        }
        catch (e) {
            mylogger_1.myLogger.error(e.message);
        }
    }
    checkAddExtName(name, extname) {
        if (!name.toLowerCase().endsWith('.' + extname.toLowerCase())) {
            return `${name}.${extname}`;
        }
        return name;
    }
    addConfig(srcconfig, dstpathname) {
        let srcFile = this.checkAddExtName(srcconfig, 'ts');
        if (!FileSystem.existsSync(srcFile)) {
            mylogger_1.myLogger.error(`${srcFile}文件不存在`);
            return;
        }
        let dstFile = this.checkAddExtName(dstpathname, 'ts');
        if (!FileSystem.existsSync(dstFile)) {
            mylogger_1.myLogger.error(`${dstFile}文件不存在`);
            return;
        }
        this._sourceFile = this._ast.addExistingSourceFile(srcFile);
        let destSourceFile = this._ast.addExistingSourceFile(dstFile);
        if (this._sourceFile && destSourceFile) {
            // let symbols = this._sourceFile.getExportSymbols();
            let hasInterfaces = this._sourceFile.getInterfaces();
            let hasClasses = this._sourceFile.getClasses();
            let project = destSourceFile.getClasses();
            if (project.length > 0) {
                let classDeclaration = project[0];
                let interName = hasInterfaces[0].getName();
                let className = hasClasses[0].getName();
                let propName = `_${className[0].toLowerCase()}${className.slice(1)}`;
                let methodDef = hasClasses[0].getMethod(`get${interName}Item`);
                let returnTypeString = `${interName}`;
                if (methodDef.getReturnType().isArray()) {
                    returnTypeString = `Array<${interName}>`;
                }
                if (classDeclaration.getMethod(`get${interName}Item`)) {
                    mylogger_1.myLogger.error(`get${interName}Item method exsits`);
                    return;
                }
                // propName = `_${propName}`;
                let paramDef = methodDef.getParameter('key');
                let paramType = 'number';
                if (paramDef.getType().isString()) {
                    paramType = 'string';
                }
                // 增加类变量
                classDeclaration.addProperty({
                    name: `${propName}`,
                    type: `${className}`,
                    scope: ts_simple_ast_1.Scope.Private
                });
                classDeclaration.addMethod({
                    name: `get${interName}Item`,
                    returnType: returnTypeString,
                    parameters: [{ name: 'keyId', type: paramType }],
                    bodyText: `return this.${propName}.get${interName}Item(keyId);`
                });
                let initMethod = classDeclaration.getMethod('initialize');
                let interBodyText = initMethod.getBody().getText();
                interBodyText = interBodyText.slice(2, interBodyText.length - 1);
                initMethod.setBodyText(`${interBodyText}this.${propName} = await ${className}.getInstance();`);
                let modulePath = destSourceFile.getRelativePathTo(this._sourceFile);
                modulePath = modulePath.substring(0, modulePath.length - 3);
                destSourceFile.addImportDeclaration({
                    namedImports: [className, interName],
                    moduleSpecifier: modulePath
                });
                //格式化代码，保证代码的规矩
                destSourceFile.formatText();
                //写回到ts文件中
                this._ast.saveSync();
            }
        }
        else {
            mylogger_1.myLogger.error(`${srcFile}、${dstFile}文件打开有问题`);
            return;
        }
    }
    generateTSConfig(xmlConfigFile) {
        return __awaiter(this, void 0, void 0, function* () {
            mylogger_1.myLogger.log(`处理文件${xmlConfigFile}...`);
            let className = Path.basename(xmlConfigFile, '.xml').replace('_', '');
            this._className = `Auto${className}`;
            this._filePath = xmlConfigFile;
            //判断输出目录是否存在，不存在的话需要创建
            let dstFolder = `./tools/autots`;
            if (!this.checkFolderExist(dstFolder)) {
                this._ast.createDirectory(dstFolder);
            }
            let dstPathFile = `${dstFolder}/${this._className.toLowerCase()}.ts`;
            //如果文件存在，那么删除
            this.removeExistFile(dstPathFile);
            //读取XML文件并转化成JSON对象返回来
            let jsonData = yield utils_1.default.getJSObject(this._filePath).catch((e) => {
                mylogger_1.myLogger.error(e.message);
                return Promise.reject;
            });
            //创建TS文件，回写之前文件不存在
            this._sourceFile = this._ast.createSourceFile(dstPathFile);
            //创建一个Class
            const classDeclaration = this._sourceFile.addClass({
                name: this._className
            });
            let isArrayType = false;
            let dataType = null;
            if (jsonData) {
                //增加数据类型的接口
                let interfaceName = `${this._className}Info`;
                const interfaceDeclaration = this._sourceFile.addInterface({
                    name: interfaceName
                });
                //定位到数据的根本info位置，并且循环处理所有数据，判断类型
                let mapKeyType = '';
                let root = jsonData[Object.keys(jsonData)[0]];
                if (root && root.info && root.info.length > 0) {
                    let mapTmpType = new Map();
                    let mapKeyName = '';
                    let infoItemSet = new Set();
                    for (let infoItem of root.info) {
                        if (!infoItem || infoItem === "")
                            continue;
                        if (!isArrayType) {
                            if (!infoItem.$)
                                continue;
                            let keys = Object.keys(infoItem.$);
                            if (keys.length == 0)
                                continue;
                            let typeKey = keys[0];
                            if (!infoItemSet.has(infoItem.$[typeKey])) {
                                infoItemSet.add(infoItem.$[typeKey]);
                            }
                            else {
                                isArrayType = true;
                            }
                        }
                        let infoKeys = Object.keys(infoItem);
                        for (let infokey of infoKeys) {
                            if (infoItem[infokey] instanceof Array) {
                                //如果数据个数大于1,这个有点奇怪了啊
                                if (infoItem[infokey].length > 1) {
                                    mylogger_1.myLogger.warn(`${infoItem[infokey]} 数组的个数怎么会大于1啊？`);
                                    mapTmpType.set(infokey, []);
                                }
                                else { //判断这个是数值？
                                    let oldType = mapTmpType.get(infokey);
                                    let isNumber = utils_1.default.checkNumber(infoItem[infokey][0]);
                                    if (oldType && oldType === 'number') {
                                        if (!isNumber) {
                                            mapTmpType.set(infokey, 'string');
                                        }
                                    }
                                    else if (!oldType) {
                                        if (isNumber) {
                                            mapTmpType.set(infokey, 'number');
                                        }
                                        else {
                                            mapTmpType.set(infokey, 'string');
                                        }
                                    }
                                }
                            }
                            else {
                                // let valueType = typeof infoItem[infokey];
                                //
                                let tmpKeyName = Object.keys(infoItem[infokey])[0];
                                if (mapKeyName === '') {
                                    mapKeyName = tmpKeyName;
                                }
                                else if (mapKeyName !== tmpKeyName) {
                                    mylogger_1.myLogger.error(`${mapKeyName} is not same with ${tmpKeyName}`);
                                }
                                if (mapKeyType !== '' && mapKeyType !== typeof infoItem[infokey][tmpKeyName]) {
                                    mylogger_1.myLogger.error('map的类型不相等，应该有问题啊');
                                }
                                if (mapKeyType === '') {
                                    let isNumber = utils_1.default.checkNumber(infoItem[infokey][tmpKeyName]);
                                    if (!isNumber) {
                                        mapKeyType = 'string';
                                    }
                                }
                            }
                        }
                    }
                    //加入接口类型
                    for (let [keyName, keyType] of mapTmpType.entries()) {
                        interfaceDeclaration.addProperty({
                            name: keyName,
                            type: keyType
                        });
                    }
                    //设置map的类型
                    dataType = interfaceName;
                    if (isArrayType) {
                        dataType = `Array<${interfaceName}>`;
                    }
                    classDeclaration.addProperty({
                        name: '_mapInfo',
                        type: `Map<${mapKeyType === '' ? 'number' : mapKeyType}, ${dataType}>`
                    });
                    //加入构造函数
                    classDeclaration.addConstructor({
                        scope: ts_simple_ast_1.Scope.Private,
                        bodyText: `this._mapInfo = new Map<${mapKeyType === '' ? 'number' : mapKeyType}, ${dataType}>();`
                    });
                }
                // 增加_instance单例的变量
                let instanceProp = classDeclaration.addProperty({
                    name: '_instance',
                    type: this._className,
                    scope: ts_simple_ast_1.Scope.Private
                });
                instanceProp.setIsStatic(true);
                //增加getInstance的方法
                let getInstanceFunDeclaration = classDeclaration.addMethod({
                    name: 'getInstance',
                    returnType: `Promise<${this._className}>`,
                    bodyText: `if (!this._instance) {
                                this._instance = new ${this._className}();
                                await this._instance.initialize('${this._filePath}');
                            }
                            return Promise.resolve(this._instance);`
                });
                getInstanceFunDeclaration.setIsStatic(true);
                getInstanceFunDeclaration.setIsAsync(true);
                let mapAddText = `dataKey`;
                if (mapKeyType === '') {
                    mapAddText = `Number.parseInt(dataKey)`;
                }
                let bodyTypeProcess = `this._mapInfo.set(${mapAddText}, data);`;
                // dataType = interfaceName;
                if (isArrayType) {
                    bodyTypeProcess = `let dataInfo = this._mapInfo.get(${mapAddText});
                if (dataInfo) {
                    dataInfo.push(data);
                } else {
                    let dataList = new Array<${interfaceName}>();
                    dataList.push(data);
                    this._mapInfo.set(${mapAddText}, dataList);
                }`;
                }
                //增加initialize初始化的方法
                let initFuncDeclaration = classDeclaration.addMethod({
                    name: 'initialize',
                    scope: ts_simple_ast_1.Scope.Private,
                    bodyText: `try {
                    let jsonData = await Utils.getJSObject(xmlFile);
                    let root = jsonData[Object.keys(jsonData)[0]];
                    if (root && root.info && root.info.length > 0) {
                        for(let infoItem of root.info) {
                            let infoKeys = Object.keys(infoItem);
                            let data = <any>{};
                            let dataKey = '';
                            for (let infokey of infoKeys) {
                                if (infoItem[infokey] instanceof Array) {
                                    data[infokey] = infoItem[infokey][0];
                                } else {
                                    dataKey = infoItem[infokey][Object.keys(infoItem[infokey])[0]];
                                }
                            }
                            ${bodyTypeProcess}
                        }
                        return Promise.resolve;
                    }
                } catch(e) {
                    myLogger.error(e.message);
                    return Promise.reject;
                }`
                });
                initFuncDeclaration.addParameters([{ name: 'xmlFile', type: 'string' }]);
                initFuncDeclaration.setIsAsync(true);
                //增加printAll的方法
                classDeclaration.addMethod({
                    name: 'printAll',
                    bodyText: `for (let [key, value] of this._mapInfo.entries()) {
                        myLogger.log(\`\${key} : \${JSON.stringify(value)}\`);
                    }`
                });
                //增加printAll的方法
                classDeclaration.addMethod({
                    name: `get${interfaceName}Item`,
                    parameters: [{ name: 'key', type: `${mapKeyType === '' ? 'number' : mapKeyType}` }],
                    returnType: `${dataType}`,
                    bodyText: `return this._mapInfo.get(key);`
                });
                //增加import导入的头部模块
                let myLoggerFile = this._ast.addExistingSourceFile('./src/common/mylogger.ts');
                let myLoggerModule = this._sourceFile.getRelativePathTo(myLoggerFile);
                myLoggerModule = myLoggerModule.substring(0, myLoggerModule.length - 3);
                let utilsFile = this._ast.addExistingSourceFile('./src/common/utils.ts');
                let utilsModule = this._sourceFile.getRelativePathTo(utilsFile);
                utilsModule = utilsModule.substring(0, utilsModule.length - 3);
                this._sourceFile.addImportDeclarations([{
                        namedImports: ['myLogger'],
                        moduleSpecifier: myLoggerModule
                    }, {
                        defaultImport: 'Utils',
                        moduleSpecifier: utilsModule
                    }]);
                mylogger_1.myLogger.log(this._className, interfaceName);
                //增加export导出class和interface
                this._sourceFile.addExportDeclarations([
                    { namedExports: [this._className, interfaceName] }
                ]);
                //格式化代码，保证代码的规矩
                this._sourceFile.formatText();
                //写回到ts文件中
                this._ast.saveSync();
            }
            return Promise.resolve;
        });
    }
}
exports.XML2TSConfig = XML2TSConfig;
// XML2TSConfig.getInstance().addConfig('tools/autots/combinecfg', 'src/module/battle/cfgmanager');
// XML2TSConfig.getInstance().generateTSConfig('./conf/NewSkill/SkillCfg_account.xml');
//# sourceMappingURL=xml2tsconfig.js.map