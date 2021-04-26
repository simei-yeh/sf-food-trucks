var SocrataAPI = require('./SocrataAPI.js');

// Trucks class requires a date on instantiation
module.exports = class FoodTrucksList {
  constructor(date = new Date()) {
    this.data = null;
    this.date = date;
  }

  fetchList() {
    // only call Socrata API if this.data is null
    if (this.data) {
      return Promise.resolve(this.data);
    }

    // call Socrata API
    return SocrataAPI.findByTime(this.date)
      // format and sort, then save and return results from Socrata API
      .then((rawData) => {
        this.data = rawData.map((t) => {
          return {
            truckName: this.formatName(t.applicant),
            location: t.location,
            startTime: t.starttime,
            endTime: t.endtime,
          };
        })

        this.data = this.data.sort((a,b) => {
          if (a.truckName.toLowerCase() < b.truckName.toLowerCase()) {
            return -1;
          } else if (a.truckName.toLowerCase() > b.truckName.toLowerCase()) {
            return 1;
          } else {
            return 0;
          }
        })
        return this.data;
      })
  }

  // retrieves a list of items from the food truck data given a start and length
  getItems = (start, length) => {
    return this.fetchList().then((res) => {
        return {
          truckInfo: this.data.slice(start, start + length),
          hasMoreInfo: this.data.length > ( start + length )
        };
    })

  }

  // format name if it has a DBA alias
  // ex: Cinnamon Buns dba Auntie Anne's Pretzels will be returned as Auntie Anne's Pretzels
  formatName(name) {
    return (name.split(/dba[\.\:]?/gi)[1] || name).trim();
  }
}