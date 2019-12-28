cd backend
npm version minor
echo '===== Backend minor version updated! ====='

cd admin
npm version minor
echo '===== Backend Admin minor version updated! ====='

cd ../../frontend
npm version minor
echo '===== Frontend minor version updated! ====='

cd ../services/passport
npm version minor
echo '===== Passport service minor version updated! ====='

cd ../uploader
npm version minor
echo '===== Uploader service minor version updated! ====='

cd ../sendi
npm version minor
echo '===== Sendi service minor version updated! ====='
