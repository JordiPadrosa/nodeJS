const express = require("express");
const estocController = require("../../controllers/estocController");

const router = express.Router();

router.get("/", estocController.getAllEstocs);

router.get("/:estocId", estocController.getOneEstoc);

router.post("/", estocController.createNewEstoc);

router.patch("/:estocId", estocController.updateOneEstoc);

router.delete("/:estocId", estocController.deleteOneEstoc);

module.exports = router;