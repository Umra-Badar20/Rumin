import express from 'express';
import { 
  createContact, 
  getContacts, 
  deleteInquiry 
} from '../controllers/contactController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.route('/')
  .post(createContact) // Public access
  .get(protect, getContacts); // Protected access

router.route('/:id').delete(protect, deleteInquiry); // Protected DELETE route

export default router;