const estocService = require("../services/estocService");

const getAllEstocs = (req, res) => {
  const { venda } = req.query;
 try {
    const allEstocs = estocService.getAllEstocs({ venda });
    res.send({ status: "OK", data: allEstocs });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  
  const getOneEstoc = (req, res) => {
    const {
      params: { estocId },
    } = req;
    if (!estocId) {
      res
        .status(400)
        .send({
          status: "FAILED",
          data: { error: "Parameter ':estocId' can not be empty" },
        });
    }
    try {
      const estoc = estocService.getOneEstoc(estocId);
      res.send({ status: "OK", data: estoc });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };

  const createNewEstoc = (req, res) => {
    const { body } = req;
    if (
        !body.producte ||
        !body.caducitat ||
        !body.dataVenda ||
        !body.ubicacio
    ) {
      res
      .status(400)
      .send({
        status: "FAILED",
        data: {
          error:
            "One of the following keys is missing or is empty in request body: 'producte', 'caducitat', 'dataVenda', 'ubicacio'",
        },
      });
    return body;
    }

    const newEstoc = {
      producte: body.producte,
      caducitat: body.caducitat,
      dataVenda: body.dataVenda,
      ubicacio: body.ubicacio,
    };
    try {
      const createdEstoc = estocService.createNewEstoc(newEstoc);
      res.status(201).send({ status: "OK", data: createdEstoc });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };

  const updateOneEstoc = (req, res) => {
    const {
      body,
      params: { estocId },
    } = req;
    if (!estocId) {
      res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':estocId' can not be empty" },
      });    }
      try {
        const updatedEstoc = estocService.updateOneEstoc(estocId, body);
        res.send({ status: "OK", data: updatedEstoc });
      } catch (error) {
        res
          .status(error?.status || 500)
          .send({ status: "FAILED", data: { error: error?.message || error } });
      }
  };
  
  const deleteOneEstoc = (req, res) => {
    const {
      params: { estocId },
    } = req;
    if (!estocId) {
      res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':estocId' can not be empty" },
      });
    }
    try {
      estocService.deleteOneEstoc(estocId);
      res.status(204).send({ status: "OK" });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  const getEstocForProducte = (req, res) => {
    const {
      params: { producteId },
    } = req;
    if (!producteId) {
      res
        .status(400)
        .send({
          status: "FAILED",
          data: { error: "Parameter ':producteId' can not be empty" },
        });
    }
    try {
      const estoc = estocService.getEstocForProducte(producteId);
      console.log(estoc);
      res.send({ status: "OK", data: estoc });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  module.exports = {
    getAllEstocs,
    getOneEstoc,
    createNewEstoc,
    updateOneEstoc,
    deleteOneEstoc,
    getEstocForProducte
  };