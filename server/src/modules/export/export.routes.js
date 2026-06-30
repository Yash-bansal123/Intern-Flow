import { Router } from 'express';
import * as exportController from './export.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/csv', exportController.exportCsv);
router.get('/pdf', exportController.exportPdf);

export default router;
