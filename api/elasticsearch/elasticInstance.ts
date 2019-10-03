var elasticsearch = require("elasticsearch");
import config from '../config/elasticsearch.config';
let elasticClient;

const getElasticInstance = () => {
    if (elasticClient) {
      return elasticClient;
    }
    elasticClient = new elasticsearch.Client({
      host: config.host
    });
    return elasticClient;
};

export default getElasticInstance;