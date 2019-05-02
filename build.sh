cp index.html build/DIR-Multitrack.app/Contents/Resources/app/index.html
cp package.json build/DIR-Multitrack.app/Contents/Resources/app/package.json
cp renderer.js build/DIR-Multitrack.app/Contents/Resources/app/renderer.js
cp main.js build/DIR-Multitrack.app/Contents/Resources/app/main.js
cd build/DIR-Multitrack.app/Contents/Resources/app/
npm install --production
cd ../../../../../
zip -r build/DIR-Multitrack.app{.zip,}
