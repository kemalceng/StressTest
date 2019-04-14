import uuidv4 from 'uuid/v4';
var fetch = require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;

import { analysisDataCache } from '../../index';

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

    const analogChannel0Data = data
      .map(sample => sample.frames)
      .reduce((a, b) => a.concat(b), [])
      .map(bitalinoFrame => bitalinoFrame.analog[0])
      .map(frame => '\n' + frame)
      .reduce((a, b) => a + b) + '\n';

    const contents = startTime + '\n' + frequency + analogChannel0Data;

    uploadFile(id, contents)
      .then(() => {
        return res.json({ 'message': 'Record file successfully saved!' });
      })
      .catch(err => {
        console.error(err);
        next(err);
      });

  } else {
    next(null);
  }
}

async function uploadFile(id, contents) {
  const path = `/${id}.txt`;
  const response = await dbx.filesUpload({
    contents,
    path
  });

  console.log("upload completed: ", response);

  delete analysisDataCache[id];
}
