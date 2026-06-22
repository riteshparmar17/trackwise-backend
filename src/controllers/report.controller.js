const reportService = require('../services/report.service');

const getDashboardReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fromDate, toDate } = req.query;
        const report = await reportService.getDashboardReport(userId, fromDate, toDate);
        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Report generation error:', error);
        return res.status(400).json({
            success: false,
            message: 'Failed to generate report'
        });
    }
};

module.exports = {
    getDashboardReport
};