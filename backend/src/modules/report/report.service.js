import reportRepository from "./report.repository.js";

class ReportService {

    async getDashboardSummary() {
        const [counts, departments] = await Promise.all([
            reportRepository.getSummaryCounts(),
            reportRepository.getDepartmentBreakdown(),
        ]);

        return {
            ...counts,
            departments,
        };
    }
}

export default new ReportService();
