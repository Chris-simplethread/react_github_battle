import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'https://api.github.com/repos/';

const responseBody = res => res.body;

const GHRepo = {
  get: url =>
    superagent.get(`${API_ROOT}${url}`).then(responseBody)
};

export default {
  GHRepo
};
