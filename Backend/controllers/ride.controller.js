const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

// module.exports.createRide = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { userId, pickup, destination, vehicleType } = req.body;

//   try {
//     const ride = await rideService.createRide({
//       user: req.user._id,
//       pickup,
//       destination,
//       vehicleType,
//     });

//     // Send the response to the client immediately
//     res.status(201).json(ride);

//     // Perform the background task for captain notifications
//     (async () => {
//       try {
//         // Get the pickup coordinates and captains in the radius
//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
//         console.log(pickupCoordinates);

//         const captainsInRadius = await mapService.getCaptainsInTheRadius(
//           pickupCoordinates.lat,
//           pickupCoordinates.lng,
//           20
//         );
//         console.log(captainsInRadius);

//         ride.otp = ""; // Optional: Clear the OTP

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         // Notify captains
//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         });


//       } catch (notificationError) {
//         console.error("Error during notifications:", notificationError);
//         // Log errors during notification but don't interfere with the client response
//       }
//     })();
//   } catch (err) {
//     // Catch and handle errors that happen during the ride creation process
//     return res.status(500).json({ message: err.message });
//   }
// };


module.exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    // 🚀 Save the ride immediately in DB
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    // ✅ Send response to user after saving in DB
    res.status(201).json(ride);

    // 📌 Run the notification process in the background
    setImmediate(async () => {
      try {
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
          pickupCoordinates.lat,
          pickupCoordinates.lng,
          20
        );

        // Retrieve ride with user details
        const rideWithUser = await rideModel.findById(ride._id).populate("user");

        // 🔔 Notify captains about the new ride request
        captainsInRadius.forEach((captain) => {
          sendMessageToSocketId(captain.socketId, {
            event: "new-ride",
            data: rideWithUser,
          });
        });
      } catch (error) {
        console.error("Error during notifications:", error);
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getAllPendingRides = async (req, res) => {
  try {
    const rides = await rideModel.find({ status: "pending" }).populate("user"); // Get only pending rides
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rides", error });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}