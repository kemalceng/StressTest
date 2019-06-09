import { createAnalysis, listAnalyses, getAnalysis, updateAnalysis, uploadMetadataFile, stopAnalysis, listImagePaths, listStroopImagePaths } from '../controllers';

export default function (app) {
  app.route('/records')
    .post(createAnalysis);

  app.route('/records')
      .get(listAnalyses);

  app.route('/records/:recordId')
    .put(updateAnalysis);

  app.route('/records/:recordId/metadata')
    .post(uploadMetadataFile)

  app.route('/records/:recordId')
    .get(getAnalysis);

  app.route('/records/:recordId/stop')
    .put(stopAnalysis);

  app.route('/images')
    .get(listImagePaths);

  app.route('/stroop-images')
      .get(listStroopImagePaths);

}
