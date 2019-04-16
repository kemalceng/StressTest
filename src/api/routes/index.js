import { createAnalysis, getAnalysis, updateAnalysis, stopAnalysis } from '../controllers';

export default function (app) {
  app.route('/records')
    .post(createAnalysis);

  app.route('/records/:recordId')
    .put(updateAnalysis);

  app.route('/records/:recordId')
    .get(getAnalysis);

  app.route('/records/:recordId/stop')
    .put(stopAnalysis);
}
