import express from 'express';
import  {getGuardianPatients, updateGuardian, deactivateGuardian } from '../controllers/guardian.controller.js';
import { validateUpdateGuardian } from '../validators/guardian.validator.js';
import { requireAuth, requireRoleAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.use(requireAuth); // all routes require authentication

router.get('/:id/patients', requireRoleAuth('doctor', 'nurse'), getGuardianPatients);
router.patch('/:id', requireRoleAuth('doctor'), validateUpdateGuardian, updateGuardian);
router.delete('/:id', requireRoleAuth('doctor'), deactivateGuardian);

export default router;