const DB = require("./db.json");

const { saveToDatabase } = require("./utils");


const getAllEstocs = (filterParams) => {
  try {
    let estocs = DB.estocs;
    if (filterParams.venda) {
      return DB.estocs.filter((estoc) =>
        estoc.dataVenda.toLowerCase().includes(filterParams.venda)
      );
    }
    return estocs;
  } catch (error) {
    throw { status: 500, message: error };
  }
};

const getOneEstoc = (estocId) => {
  try {
    const estoc = DB.estocs.find((estoc) => estoc.id === estocId);
    if (!estoc) {
      throw {
        status: 400,
        message: `Can't find estoc with the id '${estocId}'`,
      };
    }
    return estoc;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewEstoc = (newEstoc) => {
  try {
    DB.estocs.push(newEstoc);
    saveToDatabase(DB);
    return newEstoc;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  };
}

  const updateOneEstoc = (estocId, changes) => {
    try {
      const indexForUpdate = DB.estocs.findIndex(
        (estoc) => estoc.id === estocId
      );
      if (indexForUpdate === -1) {
        throw {
          status: 400,
          message: `Can't find estoc with the id '${estocId}'`,
        };
      }
      const updatedEstoc = {
        ...DB.estocs[indexForUpdate],
        ...changes,
        updatedAt: new Date().toLocaleString("es-ES", { timeZone: "UTC" }),
      };
      DB.estocs[indexForUpdate] = updatedEstoc;
      saveToDatabase(DB);
      return updatedEstoc;
    } catch (error) {
      throw { status: error?.status || 500, message: error?.message || error };
    }
  }
  
  const deleteOneEstoc = (estocId) => {
    try{
      const indexForDeletion = DB.estocs.findIndex(
        (estoc) => estoc.id === estocId
      );
      if (indexForDeletion === -1) {
        throw {
          status: 400,
          message: `Can't find estoc with the id '${estocId}'`,
        };
      }
      DB.estocs.splice(indexForDeletion, 1);
      saveToDatabase(DB);
    }catch (error) {
      throw { status: error?.status || 500, message: error?.message || error };
    }
  };
  const getEstocForProducte = (producteId) => {
    try {
      const estoc = DB.estocs.find((estoc) => estoc.producte === producteId);
      console.log(estoc);
      if (!estoc) {
        throw {
          status: 400,
          message: `Can't find producte with the id '${producteId}'`,
        };
      }
      return estoc;
    } catch (error) {
      throw { status: error?.status || 500, message: error?.message || error };
    }
  };

  const getEstocsDisponibles = () => {
    try {
      return DB.estocs.filter((estoc) =>
      estoc.caducitat <= new Date().toLocaleString("es-ES", { timeZone: "UTC" })
      );
      
    } catch (error) {
      throw { status: 500, message: error };
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