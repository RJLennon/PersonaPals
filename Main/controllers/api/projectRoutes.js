const router = require('express').Router();
const { Persona } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPersona = await Persona.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPersona);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const personaData = await Persona.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!personaData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(personaData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
