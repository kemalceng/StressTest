const fs = require('fs');

const categoriesFolder = './src/resources/images/categories/';
const stroopFolder = './src/resources/images/stroopTest/';
const sdmtFolder = './src/resources/images/sdmt/';

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

export function listStroopImages() {
    var allImagePaths = [];
    fs.readdirSync(stroopFolder)
        .filter(file => (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file))
        .forEach(image => {
            allImagePaths.push('../resources/images/stroopTest/' + image);
        });
    return allImagePaths;
}

export function listSdmtImages() {
    var allImagePaths = [];
    fs.readdirSync(sdmtFolder)
        .filter(file => (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file))
        .forEach(image => {
            allImagePaths.push('../resources/images/sdmt/' + image);
        });
    return allImagePaths;
}
