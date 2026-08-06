import request from "supertest";
import app from "../app.js";
import prisma from "../core/prisma/prisma.js";

const runId = Date.now();
const password = "FlowTest123";

const users = {};
const ids = {
    departmentId: null,
    facultyId: null,
    studentId: null,
    courseId: null,
    notificationId: null,
};

async function registerUser(role) {
    const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
            firstName: role,
            lastName: "Flow",
            email: `${role.toLowerCase()}.flow.${runId}@example.com`,
            password,
            role,
        });

    expect(res.status).toBe(201);

    users[role] = {
        user: res.body.data.user,
        token: res.body.data.accessToken,
    };
}

function auth(token) {
    return { Authorization: `Bearer ${token}` };
}

describe("Core module flow", () => {
    beforeAll(async () => {
        await registerUser("ADMIN");
        await registerUser("FACULTY");
        await registerUser("STUDENT");
    });

    afterAll(async () => {
        if (ids.courseId) {
            await prisma.attendanceRecord.deleteMany({
                where: { enrollment: { courseId: ids.courseId } },
            });
            await prisma.enrollment.deleteMany({
                where: { courseId: ids.courseId },
            });
            await prisma.course.deleteMany({ where: { id: ids.courseId } });
        }

        if (ids.notificationId) {
            await prisma.notification.deleteMany({
                where: { id: ids.notificationId },
            });
        }

        if (ids.studentId) {
            await prisma.student.deleteMany({ where: { id: ids.studentId } });
        }

        if (ids.facultyId) {
            await prisma.faculty.deleteMany({ where: { id: ids.facultyId } });
        }

        if (ids.departmentId) {
            await prisma.department.deleteMany({
                where: { id: ids.departmentId },
            });
        }

        const userIds = Object.values(users).map(({ user }) => user.id);
        await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } });
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
        await prisma.$disconnect();
    });

    test("admin can create department, faculty, student, course, notification, and reports can summarize them", async () => {
        const departmentRes = await request(app)
            .post("/api/v1/departments")
            .set(auth(users.ADMIN.token))
            .send({
                name: `Computer Science Flow ${runId}`,
                code: `CSF${String(runId).slice(-6)}`,
                description: "Temporary department for integration tests",
            });

        expect(departmentRes.status).toBe(201);
        ids.departmentId = departmentRes.body.data.id;

        const forbiddenDepartmentRes = await request(app)
            .post("/api/v1/departments")
            .set(auth(users.STUDENT.token))
            .send({
                name: `Blocked Department ${runId}`,
                code: `BLK${String(runId).slice(-6)}`,
            });

        expect(forbiddenDepartmentRes.status).toBe(403);

        const facultyRes = await request(app)
            .post("/api/v1/faculty")
            .set(auth(users.ADMIN.token))
            .send({
                userId: users.FACULTY.user.id,
                employeeId: `EMP${String(runId).slice(-8)}`,
                departmentId: ids.departmentId,
                designation: "Assistant Professor",
                phone: "9876543210",
            });

        expect(facultyRes.status).toBe(201);
        expect(facultyRes.body.data.user.password).toBeUndefined();
        ids.facultyId = facultyRes.body.data.id;

        const studentRes = await request(app)
            .post("/api/v1/students")
            .set(auth(users.ADMIN.token))
            .send({
                userId: users.STUDENT.user.id,
                studentId: `STU${String(runId).slice(-8)}`,
                departmentId: ids.departmentId,
                semester: 3,
                phone: "9876543210",
                cgpa: 8.4,
                attendance: 0,
            });

        expect(studentRes.status).toBe(201);
        expect(studentRes.body.data.user.password).toBeUndefined();
        ids.studentId = studentRes.body.data.id;

        const courseRes = await request(app)
            .post("/api/v1/courses")
            .set(auth(users.ADMIN.token))
            .send({
                code: `CSE${String(runId).slice(-6)}`,
                name: "Integration Systems",
                credits: 4,
                departmentId: ids.departmentId,
                facultyId: ids.facultyId,
            });

        expect(courseRes.status).toBe(201);
        ids.courseId = courseRes.body.data.id;

        const notificationRes = await request(app)
            .post("/api/v1/notifications")
            .set(auth(users.ADMIN.token))
            .send({
                title: `Flow Notice ${runId}`,
                description: "Temporary notification for integration tests",
                category: "ANNOUNCEMENT",
            });

        expect(notificationRes.status).toBe(201);
        ids.notificationId = notificationRes.body.data.id;

        const reportsRes = await request(app)
            .get("/api/v1/reports/summary")
            .set(auth(users.ADMIN.token));

        expect(reportsRes.status).toBe(200);
        expect(reportsRes.body.data.totalStudents).toBeGreaterThanOrEqual(1);
        expect(reportsRes.body.data.totalFaculty).toBeGreaterThanOrEqual(1);
        expect(reportsRes.body.data.totalCourses).toBeGreaterThanOrEqual(1);
    });

    test("student enrollment, faculty attendance, and student attendance summary work end to end", async () => {
        const enrollRes = await request(app)
            .post(`/api/v1/courses/${ids.courseId}/enroll`)
            .set(auth(users.STUDENT.token));

        expect(enrollRes.status).toBe(201);

        const duplicateEnrollRes = await request(app)
            .post(`/api/v1/courses/${ids.courseId}/enroll`)
            .set(auth(users.STUDENT.token));

        expect(duplicateEnrollRes.status).toBe(409);

        const studentCoursesRes = await request(app)
            .get("/api/v1/courses/my")
            .set(auth(users.STUDENT.token));

        expect(studentCoursesRes.status).toBe(200);
        expect(
            studentCoursesRes.body.data.some(
                (item) => item.course.id === ids.courseId
            )
        ).toBe(true);

        const facultyCoursesRes = await request(app)
            .get("/api/v1/courses/my")
            .set(auth(users.FACULTY.token));

        expect(facultyCoursesRes.status).toBe(200);
        expect(
            facultyCoursesRes.body.data.some((course) => course.id === ids.courseId)
        ).toBe(true);

        const attendanceRes = await request(app)
            .post("/api/v1/attendance")
            .set(auth(users.FACULTY.token))
            .send({
                courseId: ids.courseId,
                date: "2026-08-05",
                records: [
                    {
                        studentId: ids.studentId,
                        status: "PRESENT",
                    },
                ],
            });

        expect(attendanceRes.status).toBe(200);
        expect(attendanceRes.body.data.saved).toHaveLength(1);
        expect(attendanceRes.body.data.errors).toHaveLength(0);

        const myAttendanceRes = await request(app)
            .get("/api/v1/attendance/my")
            .set(auth(users.STUDENT.token));

        expect(myAttendanceRes.status).toBe(200);
        expect(myAttendanceRes.body.data[0].percentage).toBe(100);
    });

    test("authenticated users can read notifications", async () => {
        const res = await request(app)
            .get("/api/v1/notifications")
            .set(auth(users.STUDENT.token));

        expect(res.status).toBe(200);
        expect(
            res.body.data.some((notification) => notification.id === ids.notificationId)
        ).toBe(true);
    });
});
