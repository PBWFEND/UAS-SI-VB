import prisma from "../../prisma/client.js";
import { validationResult } from "express-validator";

// CREATE
export const createFlight = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const flight = await prisma.flightSchedule.create({
    data: {
      flightNumber: req.body.flightNumber,
      origin: req.body.origin,
      destination: req.body.destination,
      departureTime: new Date(req.body.departureTime),
      arrivalTime: new Date(req.body.arrivalTime),
      airline: req.body.airline,
      userId: req.user.id
    }
  });

  res.status(201).json({ message: "Flight schedule created", data: flight });
};

// GET LIST
export const getFlights = async (req, res) => {
  const flights = await prisma.flightSchedule.findMany({
    where: { userId: req.user.id },
    orderBy: { departureTime: "asc" }
  });
  res.json({ message: "Flight schedules retrieved", data: flights });
};

// GET DETAIL
export const getFlightDetail = async (req, res) => {
  const flightId = parseInt(req.params.id);
  const flight = await prisma.flightSchedule.findFirst({
    where: { id: flightId, userId: req.user.id }
  });
  if (!flight) return res.status(404).json({ message: "Flight not found" });
  res.json({ message: "Flight detail retrieved", data: flight });
};

// UPDATE
export const updateFlight = async (req, res) => {
  const flightId = parseInt(req.params.id);
  const existing = await prisma.flightSchedule.findFirst({
    where: { id: flightId, userId: req.user.id }
  });
  if (!existing) return res.status(404).json({ message: "Flight not found or not yours" });

  const updated = await prisma.flightSchedule.update({
    where: { id: flightId },
    data: {
      flightNumber: req.body.flightNumber || existing.flightNumber,
      origin: req.body.origin || existing.origin,
      destination: req.body.destination || existing.destination,
      departureTime: req.body.departureTime ? new Date(req.body.departureTime) : existing.departureTime,
      arrivalTime: req.body.arrivalTime ? new Date(req.body.arrivalTime) : existing.arrivalTime,
      airline: req.body.airline || existing.airline
    }
  });

  res.json({ message: "Flight updated", data: updated });
};

// DELETE
export const deleteFlight = async (req, res) => {
  const flightId = parseInt(req.params.id);
  const existing = await prisma.flightSchedule.findFirst({
    where: { id: flightId, userId: req.user.id }
  });
  if (!existing) return res.status(404).json({ message: "Flight not found or not yours" });

  await prisma.flightSchedule.delete({ where: { id: flightId } });
  res.json({ message: "Flight deleted successfully" });
};
