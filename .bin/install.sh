cd backend
npm i
echo 'Backend installed!'

cd admin
npm i
echo 'Backend Admin installed!'
npm run build
echo 'Backend Admin builded!'

cd ../../frontend
npm i
echo 'Frontend installed!'
npm run build
echo 'Frontend builded!'

cd ../services/passport
npm i
echo 'Passport service installed!'
[ -f .env ] || cp .env.example .env # copy example .env file if production .env not exists
echo 'Passport service envs copied!'

cd ../uploader
npm i
echo 'Uploader service installed!'
[ -f .env ] || cp .env.example .env
echo 'Uploader service envs copied!'
