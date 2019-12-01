商业级《王者荣耀》开发实战教程 (https://www.insideria.cn/my/course/615) 服务器部分

注意事项:
1、node_modules 取 服务器阶段性工程“15-13end”的node_modules;
2、服务器课程 53 对应阶段性工程 8-2


$ tsc -v
Version 3.4.4

$ node -v
v10.15.3

课时52:
运行serverframework.js创建框架文件失败，提示"getaddrinfo ENOTFOUND holytech.insideria.cn holytech.insideria.cn:3010"，
手动复制“8-1 光速编写服务器\end”下的"src&main.ts&makeprotots.bat"到目录下，同时将conf也移动到目录下

课时61:
.\makeprotots.bat，会提示pbjs和pbts无法执行，需要全局安装一下protobufjs(npm install protobufjs -g)
