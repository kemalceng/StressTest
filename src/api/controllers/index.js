import uuidv4 from 'uuid/v4';
var fetch = require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;

import { analysisDataCache } from '../../index';

import { listImages, listStroopImages } from '../../images';

const accessToken = process.env.DROPBOX_ACCESS_TOKEN;

var dbx = new Dropbox({ accessToken, fetch });

export const createAnalysis = (req, res) => {
  const id = uuidv4();
  console.log("Created analysis, id: " + id);

  const { frequency } = req.body;
  console.log("Frequency: " + frequency);

  analysisDataCache[id] = {
    frequency,
    data: []
  };

  res.json({
    message: 'Record created successfully.',
    data: { id }
  });
};

export const listAnalyses = (req, res, next) => {
  listFolders()
      .then((folders) => {
        res.send(folders)
      })
      .catch(err => {
        console.error("Err",err);
        next(err)
      });
}

export const getAnalysis = (req, res, next) => {
  const id = req.params.recordId;

  let filename = 'eda.txt';

  if(req.query.file === 'ecg') {
    filename = 'ecg.txt';
  } else if(req.query.file === 'metadata') {
    filename = 'metadata.json';
  }

  downloadFile(id, filename)
    .then((response) => {
      res.send(Buffer.from(response.fileBinary))
    })
    .catch(err => next(err));
}

export const uploadMetadataFile = (req, res, next) => {
  const id = req.params.recordId;
  const fileContent = req.body;

  uploadFile(id, 'metadata.json', JSON.stringify(fileContent))
      .then(() => res.send(null))
      .catch(err => {
        console.error(err);
        next(err);
      });
}

export const updateAnalysis = (req, res) => {
  const id = req.params.recordId;
  const samples = req.body;

  analysisDataCache[id].data.push(samples);

  res.send(null);
}

export const stopAnalysis = (req, res, next) => {
  const id = req.params.recordId;

  if (analysisDataCache && analysisDataCache[id] && analysisDataCache[id].data.length) {
    const { frequency } = analysisDataCache[id];
    let data = analysisDataCache[id].data.sort((a, b) => a.timestamp - b.timestamp);

    const startTime = data[0].timestamp;

    // TODO: Fill lost frames

    const allFrames = data
        .map(sample => sample.frames)
        .reduce((a, b) => a.concat(b), []);

    const analogChannel0Data = allFrames
      .map(bitalinoFrame => bitalinoFrame.analog[0])
      .map(frame => '\n' + frame)
      .reduce((a, b) => a + b) + '\n';

    const analogChannel1Data = allFrames
        .map(bitalinoFrame => bitalinoFrame.analog[1])
        .map(frame => '\n' + frame)
        .reduce((a, b) => a + b) + '\n';

    const edaContents = startTime + '\n' + frequency + analogChannel0Data;
    const ecgContents = startTime + '\n' + frequency + analogChannel1Data;

    Promise.all([
        uploadFile(id, 'eda.txt', edaContents),
        uploadFile(id, 'ecg.txt', ecgContents)
    ]).then(() => {
      return res.json({ 'message': 'EDA and ECG files are successfully saved!' });
    }).catch(err => {
      console.error(err);
      next(err);
    });

  } else {
    next(null);
  }
}

export const listImagePaths = (req, res) => {
   res.json(listImages());
}

export const listStroopImagePaths = (req, res) => {
  res.json(listStroopImages());
}

async function downloadFile(id, filename) {
  const path = `/${id}/${filename}`;
  const response = await dbx.filesDownload({
    path
  });

  console.log("Download completed: ", path);

  return response;
}

async function uploadFile(id, filename, contents) {
  const path = `/${id}/${filename}`;
  const response = await dbx.filesUpload({
    contents,
    path
  });

  console.log("upload completed: ", response);

  delete analysisDataCache[id];
}

async function listFolders() {
  const path = '';
  const response = await dbx.filesListFolder({
    path
  });

  console.log("Dropbox files: ", response);

  return response.entries
      .filter(entry => entry[".tag"] === 'folder')
      .map(entry => entry.path_display.substr(1));
}
