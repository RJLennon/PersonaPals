const sequelize = require('../config/connection');
const { User, Persona } = require('../models');

const userData = require('./userData.json');
const personaData = require('./personaData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const persona of personaData) {
    await Persona.create({
      ...persona,
    });
  }

  process.exit(0);
};

seedDatabase();
