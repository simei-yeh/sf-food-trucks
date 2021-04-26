const axios = require('axios');
const config = require('./config.json');

// public data source from SF govt's of city's food trucks
const URL = 'http://data.sfgov.org/resource/bbb8-hzi6.json';

class API {
  // method which will return a promise that sends a GET request to the URL and
  // receives response of alphabetically sorted open food trucks
  findByTime (date) {
    const time = `${date.getHours()}:${date.getMinutes()}`;

    return axios.get(URL, {
      //SoQL request parameters for JSON data
      params: {
        dayorder: date.getDay(),
        $where: `start24 <= '${time}' AND end24 >= '${time}'`,
        $order: `applicant ASC`,
        $$app_token: config.token,
      }
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log('Error!', error);
      })
  }
}

module.exports = new API();