import * as exportService from './export.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const exportCsv = asyncHandler(async (req, res) => {
    const csv = await exportService.exportUserDataCsv(req.user.id);
    res.header('Content-Type', 'text/csv');
    res.attachment('internflow_data.csv');
    res.send(csv);
});

export const exportPdf = asyncHandler(async (req, res) => {
    const pdfBuffer = await exportService.exportUserDataPdf(req.user.id, req.user);
    res.header('Content-Type', 'application/pdf');
    res.attachment('internflow_report.pdf');
    res.send(pdfBuffer);
});
