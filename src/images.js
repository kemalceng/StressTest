const fs = require('fs');

const categoriesFolder = './src/resources/images/categories/';

export function listImages() {
    var allImagePaths = [];
    fs.readdirSync(categoriesFolder)
        .forEach(category => {
            fs.readdirSync(categoriesFolder + category)
                .filter(file => (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file))
                .forEach(image => {
                    allImagePaths.push('../resources/images/categories/' + category + '/' + image);
                });
        });
    return allImagePaths;
}


