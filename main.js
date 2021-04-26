var FoodTrucksList = require('./app/FoodTrucksList.js');
var FoodTruckInterface = require('./app/FoodTruckInterface.js');

// create a new interface
var prompt = new FoodTruckInterface(new FoodTrucksList());

// start command-line prompts
prompt.showMeFoodTrucks();