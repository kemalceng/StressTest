import { createAnalysis, listAnalyses, getAnalysis, updateAnalysis, uploadMetadataFile, stopAnalysis, listImagePaths, listStroopImagePaths } from '../controllers';

export default function (app) {
  app.route('/records/:test')
    .post(createAnalysis);

  app.route('/records/:test/:recordId')
    .put(updateAnalysis);

  app.route('/records/:test')
      .get(listAnalyses);

  app.route('/records/:test/:recordId/metadata')
    .post(uploadMetadataFile)

  app.route('/records/:test/:recordId')
    .get(getAnalysis);

  app.route('/records/:test/:recordId/stop')
    .put(stopAnalysis);

  app.route('/images')
    .get(listImagePaths);

  app.route('/stroop-images')
      .get(listStroopImagePaths);

}
