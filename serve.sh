if [ -z "$npm_package_name" ]; then
    echo "This script must be run via \"npm start\""
    exit 1
fi

stylus --include src/styl --include node_modules/bootstrap/dist/css --include-css --watch src/styl src/styl/app.styl -o public/css &
webpack --watch &
nodemon --watch src server.js
