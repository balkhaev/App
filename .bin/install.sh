cd backend;
npm i;
[ -f .env ] || cp .env.example .env; # copy example .env file if production .env not exists
echo '===== Backend installed! =====';

cd admin;
npm i;;
npm run build;
echo '===== Backend Admin builded! =====';

# cd ../../frontend;
# npm i --registry https://verdaccio.mvs.wtf/;
# npm run build;
# echo '===== Frontend builded! =====';

cd ../services/passport;
npm i;
[ -f .env ] || cp .env.example .env;
echo '===== Passport service installed! =====';

cd ../sendi;
npm i;
[ -f .env ] || cp .env.example .env;
echo '===== Sendi service installed! =====';
