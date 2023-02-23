const { v4: uuid } = require("uuid");

const Estoc = require("../database/Estoc");

const getAllEstocs = (filterParams) => {
  try {
    const allEstocs = Estoc.getAllEstocs(filterParams);
    return allEstocs;
  } catch (error) {
    throw error;
  }
};
  
  const getOneEstoc = (estocId) => {
    try {
      const estoc = Estoc.getOneEstoc(estocId);
      return estoc;
    } catch (error) {
      throw error;
    }
  };
  
  const createNewEstoc = (newEstoc) => {
    const estocToInsert = {
      ...newEstoc,
      id: uuid(),
      createdAt: new Date().toLocaleString("es-ES", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("es-ES", { timeZone: "UTC" }),
    };
    try {
      const createdEstoc = Estoc.createNewEstoc(estocToInsert);
      return createdEstoc;
    } catch (error) {
      throw error;
    }
    
  };
  
  const updateOneEstoc = (estocId, changes) => {
    try {
      const updatedEstoc = Estoc.updateOneEstoc(estocId, changes);
      return updatedEstoc;
    } catch (error) {
      throw error;
    }
  };
  const deleteOneEstoc = (estocId) => {
    try {
      Estoc.deleteOneEstoc(estocId);
    } catch (error) {
      throw error;
    }   
  };

  const getEstocForProducte = (producteId) => {
    try {
      const estoc = Estoc.getEstocForProducte(producteId);
      return estoc;
    } catch (error) {
      throw error;
    }
  };
  
  const getEstocsDisponibles = () => {
    try {
      const allEstocs = Estoc.getEstocsDisponibles();
      return allEstocs;
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    getAllEstocs,
    getOneEstoc,
    createNewEstoc,
    updateOneEstoc,
    deleteOneEstoc,
    getEstocForProducte,
    getEstocsDisponibles
  };