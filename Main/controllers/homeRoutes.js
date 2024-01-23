const router = require('express').Router();
const { Persona, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const personaData = await Persona.findAll({
     
    });

    // Serialize data so the template can read it
    const personas = personaData.map((persona) => persona.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      personas, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/persona/:id', async (req, res) => {
  try {
    const personaData = await Persona.findByPk(req.params.id, {

    });

    const persona = personaData.get({ plain: true });

    res.render('personas', {
      ...persona,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },

    });

    const user = userData.get({ plain: true });

    res.render('prompt', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
