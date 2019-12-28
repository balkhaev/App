cd backend
npm version major
echo '===== Backend major version updated! ====='

cd admin
npm version major
echo '===== Backend Admin major version updated! ====='

cd ../../frontend
npm version major
echo '===== Frontend major version updated! ====='

cd ../services/passport
npm version major
echo '===== Passport service major version updated! ====='

cd ../uploader
npm version major
echo '===== Uploader service major version updated! ====='

cd ../sendi
npm version major
echo '===== Sendi service major version updated! ====='
