cd backend
npm i
echo '===== Backend installed! ====='

cd admin
npm i
echo '===== Backend Admin installed! ====='
npm run build
echo '===== Backend Admin builded! ====='

cd ../../frontend
npm i
echo '===== Frontend installed! ====='
npm run build
echo '===== Frontend builded! ====='

cd ../services/passport
npm i
[ -f .env ] || cp .env.example .env # copy example .env file if production .env not exists
echo '===== Passport service installed! ====='

cd ../uploader
npm i
[ -f .env ] || cp .env.example .env
echo '===== Uploader service installed! ====='

cd ../sendi
npm i
[ -f .env ] || cp .env.example .env
echo '===== Sendi service installed! ====='
