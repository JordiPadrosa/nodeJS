const Maquina = require("../database/Maquina");

const getAllMaquines = () => {
  const allMaquines = Maquina.getAllMaquines();
  return allMaquines;
};
  
  const getOneMaquina = (maquinaId) => {
    try {
    const maquina = Maquina.getOneMaquina(maquinaId);
    return maquina;
    } catch (error) {
      throw error;
    }
  };

  module.exports = {
    getAllMaquines,
    getOneMaquina
  };