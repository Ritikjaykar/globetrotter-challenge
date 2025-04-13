import express from 'express';
import {
  registerUser,
  getUser,
  updateScore
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/:username', getUser);
router.post('/:username/add-score', updateScore);

export default router;