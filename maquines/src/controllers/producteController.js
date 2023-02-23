const producteService = require("../services/producteService");

const getAllProductes = (req, res) => {
  try {
    const allProductes = producteService.getAllProductes();
    res.send({ status: "OK", data: allProductes });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  
  const getOneProducte = (req, res) => {
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
      const producte = producteService.getOneProducte(producteId);
      res.send({ status: "OK", data: producte });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  const createNewProducte = (req, res) => {
    const { body } = req;
    if (
        !body.nom ||
        !body.tipus ||
        !body.preu ||
        !body.categoria
    ) {
      res
        .status(400)
        .send({
          status: "FAILED",
          data: {
            error:
              "One of the following keys is missing or is empty in request body: 'nom', 'tipus', 'preu', 'categoria'",
          },
        });
      return body;
    }

  const newProducte = {
    nom: body.nom,
    tipus: body.tipus,
    preu: body.preu,
    categoria: body.categoria,
  };
  
  try {
    const createdProducte = producteService.createNewProducte(newProducte);
    res.status(201).send({ status: "OK", data: createdProducte });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

  const updateOneProducte = (req, res) => {
    const {
      body,
      params: { producteId },
    } = req;
    if (!producteId) {
      res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':producteId' can not be empty" },
      });    }
      try {
        const updatedProducte = producteService.updateOneProducte(producteId, body);
        res.send({ status: "OK", data: updatedProducte });
      } catch (error) {
        res
          .status(error?.status || 500)
          .send({ status: "FAILED", data: { error: error?.message || error } });
      }
  };
  
  const deleteOneProducte = (req, res) => {
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
      producteService.deleteOneProducte(producteId);
      res.status(204).send({ status: "OK" });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  module.exports = {
    getAllProductes,
    getOneProducte,
    createNewProducte,
    updateOneProducte,
    deleteOneProducte,
  };