cd backend && npm version major
echo 'Backend version updated!'

cd ../frontend && npm version major
echo 'Frontend version updated!'

cd ../services/admin && npm version major
echo 'Admin service version updated!'

cd ../passport && npm version major
echo 'Passport service version updated!'

cd ../uploader && npm version major
[ -f .env ] || cp .env.example .env # copy example .env file if production .env file not exists
echo 'Uploader service version updated!'
