function loadFromDropbox(test) {
    const recordId = document.getElementById("dropboxFile").value;
    if (recordId) {
        // Load metadata file
        httpGetAsync(`/records/${test}/${recordId}?file=metadata`, function (response) {
            const jsonContent = JSON.parse(response);

            console.log("Age: " + jsonContent.age);
            console.log("Gender: " + jsonContent.gender);

            preRestIntervalOfRecord = jsonContent.preRestInterval || 0;
            console.log("Pre rest (ms): " + preRestIntervalOfRecord)


            if(test === 'image' || test === 'vr_image') {
                intervalOfRecord = jsonContent.interval;
                console.log("Interval: " + intervalOfRecord);
            }

            if(test === 'stroop') {
                typeOfRecord = jsonContent.type;
            }

            imagesShownTimeList = jsonContent.imagesShownTimeList;
            console.log("ImagesShownTimeList: " + JSON.stringify(imagesShownTimeList));

            imageSequence = imagesShownTimeList.times.map(t => t.imageFile);


            //Load EDA file
            httpGetAsync(`/records/${test}/${recordId}`, function (response) {
                console.log('EDA file loaded.')
                var splitted = response.split(/\r\n|\n/);

                edaInitTime = parseFloat(splitted[0]);
                edaFrequency = parseFloat(splitted[1]);

                drawEdaGraphics(splitted, edaInitTime, edaFrequency, "edaChartContainer");
            });

            // Load ECG file
            httpGetAsync(`/records/${test}/${recordId}?file=ecg`, function (response) {
                console.log('ECG file loaded.')
                var splitted = response.split(/\r\n|\n/);

                ecgInitTime = parseFloat(splitted[0]);
                ecgFrequency = parseFloat(splitted[1]);

                drawEcgGraphics(splitted, edaInitTime, edaFrequency, "ecgChartContainer");
            });
        });
    }
}

function setDropboxId(id) {
    document.getElementById("dropboxFile").value = id;
    $('#modalSelectRecord').modal('hide');
}

function listFolders(test) {
    httpGetAsync(`/records/${test}`, function (res) {
        const recordList = JSON.parse(res).map(record => `<li onclick="setDropboxId('${record}')">${record}</li>`).join('');

        document.getElementById("recordListInModal").innerHTML = `<ul>${recordList}</ul>`
    });
}