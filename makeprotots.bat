@echo off
:�˵�
cls
echo =================================================
echo       ����ִ�н���ɾ����ǰ���ɵ��ļ����Ƿ������
echo 1.��
echo 2.��
echo.
set /p ѡ��=��������
if %ѡ��%==1 goto yes
if %ѡ��%==2 goto no

:yes
echo '��Ҫɾ����ǰ���ɵ��ļ�������'
del src\module\hokprotobuf.d.ts
del dist\src\module\hokprotobuf.js
echo '�����ļ� hokprotobuf.js...'
call pbjs -t static-module -w commonjs -o hokprotobuf.js proto/*.proto
echo '��ʼ����./src/module/hokprotobuf.d.ts...'
call pbts -o ./src/module/hokprotobuf.d.ts hokprotobuf.js
echo '���� hokprotobuf.d.ts [OK]'
move hokprotobuf.js ./dist/src/module/
echo '�ƶ�js�ļ��� ./dist/src/module/hokprotobuf.js [OK]'
echo '�ű�ִ�� [OK]'
goto end

:no
goto end

:end
