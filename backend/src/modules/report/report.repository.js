import prisma from "../../core/prisma/prisma.js";

class ReportRepository {

    async getSummaryCounts() {
        const [totalStudents, totalFaculty, totalCourses] = await Promise.all([
            prisma.student.count(),
            prisma.faculty.count(),
            prisma.course.count(),
        ]);

        return { totalStudents, totalFaculty, totalCourses };
    }

    async getDepartmentBreakdown() {
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                name: true,
                code: true,
                _count: {
                    select: {
                        students: true,
                        faculty: true,
                        courses: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return departments.map((dept) => ({
            id: dept.id,
            name: dept.name,
            code: dept.code,
            students: dept._count.students,
            faculty: dept._count.faculty,
            courses: dept._count.courses,
        }));
    }
}

export default new ReportRepository();
