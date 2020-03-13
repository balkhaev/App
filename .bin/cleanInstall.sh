rm -rf backend/.env;
rm -rf services/*/.env;
echo '===== Old envs deleted! =====';

./.bin/install.sh;
