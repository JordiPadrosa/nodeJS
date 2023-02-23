const express = require("express");
const producteController = require("../../controllers/producteController");
const estocController = require("../../controllers/estocController");

const router = express.Router();

router.get("/", producteController.getAllProductes);

router.get("/:producteId", producteController.getOneProducte);

router.get("/:producteId/estocs", estocController.getEstocForProducte);

router.post("/", producteController.createNewProducte);

router.patch("/:producteId", producteController.updateOneProducte);

router.delete("/:producteId", producteController.deleteOneProducte);

module.exports = router;