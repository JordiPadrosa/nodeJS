const { v4: uuid } = require("uuid");

const Producte = require("../database/Producte");

const getAllProductes = () => {
  const allProductes = Producte.getAllProductes();
  return allProductes;
};
  
  const getOneProducte = (producteId) => {
    try {
      const producte = Producte.getOneProducte(producteId);
      return producte;
    } catch (error) {
      throw error;
    }
  };
  
  const createNewProducte = (newProducte) => {
    const producteToInsert = {
      ...newProducte,
      id: uuid(),
      createdAt: new Date().toLocaleString("es-ES", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("es-ES", { timeZone: "UTC" }),
    };
    try {
      const createdProducte = Producte.createNewProducte(producteToInsert);
      return createdProducte;
    } catch (error) {
      throw error;
    }
  };
  
  const updateOneProducte = (producteId, changes) => {
    try {
      const updatedProducte = Producte.updateOneProducte(producteId, changes);
      return updatedProducte;
    } catch (error) {
      throw error;
    }
  };
  const deleteOneProducte = (producteId) => {
    try {
      Producte.deleteOneProducte(producteId);
    } catch (error) {
      throw error;
    } 
  };
  
  module.exports = {
    getAllProductes,
    getOneProducte,
    createNewProducte,
    updateOneProducte,
    deleteOneProducte,
  };