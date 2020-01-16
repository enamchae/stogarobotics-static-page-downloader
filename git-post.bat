call ./config.bat
cd ./public
git add .
git config user.email %email%
git config user.name %name%
git commit -m %commitmsg%
git push -u origin master
cd ../