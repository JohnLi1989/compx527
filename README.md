# compx527


前端打包运行 
cd view
npm i
npm run build 

然后 cp -rf dist/ ../server/

cd ../server/
npm i

启动服务器

npm intall forever -g
forever start bin/www