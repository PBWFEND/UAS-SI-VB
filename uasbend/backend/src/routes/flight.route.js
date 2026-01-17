import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { 
  getFlights, 
  getFlightDetail, 
  createFlight, 
  updateFlight, 
  deleteFlight 
} from "../controllers/flight.controller.js";
import { body } from "express-validator";

const router = express.Router();

// CREATE FlightSchedule
router.post(
  "/",
  authenticate,
  [
    body("flightNumber").notEmpty(),
    body("origin").notEmpty(),
    body("destination").notEmpty(),
    body("departureTime").notEmpty().isISO8601(),
    body("arrivalTime").notEmpty().isISO8601(),
    body("airline").notEmpty()
  ],
  createFlight
);

// GET LIST FlightSchedule
router.get("/", authenticate, getFlights);

// 🥇 GET DETAIL FlightSchedule
router.get("/:id", authenticate, getFlightDetail);

// 🥈 UPDATE FlightSchedule
router.put("/:id", authenticate, updateFlight);

// 🥉 DELETE FlightSchedule
router.delete("/:id", authenticate, deleteFlight);

export default router;
