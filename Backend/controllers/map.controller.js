const mapService = require("../services/maps.service.js");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
  // Validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract origin and destination from query parameters
  const { origin, destination } = req.query;

  try {
    // Call the service function to calculate distance and time
    const distanceTime = await mapService.getDistanceTime(origin, destination);
    res.status(200).json(distanceTime); // Send the response
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Distance or time not found" });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  try {
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.status(200).json(suggestions); // Send the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Autocomplete suggestions not found" });
  }
};

