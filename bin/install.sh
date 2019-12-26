cd backend && npm i
echo 'Backend installed!'

cd ../frontend && npm i
echo 'Frontend installed!'

cd ../services/admin && npm i
echo 'Admin service installed!'

cd ../passport && npm i
[ -f .env ] || cp .env.example .env # copy example .env file if production .env file not exists
echo 'Passport service installed!'

cd ../uploader && npm i
[ -f .env ] || cp .env.example .env
echo 'Uploader service installed!'
