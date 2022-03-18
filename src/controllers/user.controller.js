const { User } = require("../../db/models");

const newUserSkill = async (req, res) => {
 const {skill} = req.body;
 
  res.json(['1111', '2222', '3333'])
};

module.exports = { newUserSkill };
