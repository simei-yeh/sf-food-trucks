var inquirer = require('inquirer');

// FoodTruckInterface class will take a truckList instantiation
module.exports = class FoodTruckInterface {
  constructor(truckList) {
    this.trucks = truckList
    this.prompt = [{
      type: 'confirm',
      name: 'prompt',
      message: 'Would you like to see the next set of results?',
      default: false,
      loop: true,
    }];
  }

  // method to populate the Food Trucks list and starts the inquirer prompts
  showMeFoodTrucks(page = 0) {
    return this.trucks.getItems(page * 10, 10)
      .then((data) => {
        if (!data) {
          return this.endPrompt(page);
        }

        this.display(data.truckInfo, page * 10);
        // if there are still remaining trucks to list, calls asksQuestions to see
        // if user wants to see more trucks
        if (data.hasMoreInfo) {
          return this.askQuestions()
            .then((showMore) => {
              if (showMore) {
                return this.showMeFoodTrucks(page + 1);
              }
              return this.endPrompt(page);
            });
        }
      })
      .catch ((error) => {
        console.log(`Couldn't retrieve!! ${error}`);
      })
  }

// askQuestions will run the inquirer command-line prompt
// and return boolean if user wants to continue
  askQuestions() {
    return inquirer.prompt(this.prompt).then((answers) => {
      return answers['prompt'];
    })
  }

  display(data, currentIndex) {
    data.forEach((truck, index) => console.log(`${index + currentIndex + 1}. Name: ${truck.truckName} | Address: ${truck.location}`));
  }

  // ending message depending on # of trucks seen
  endPrompt(page) {
    if (page=== 0) {
      console.log(`Ok, let me know when you're ready.`);
    } else {
      console.log('See you next time!');
    }
  }
}
