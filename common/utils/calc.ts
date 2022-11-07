import { LessonData, StudentList, StudentNames } from "../types";

export const getTotalAmountForStudent = (lessons: LessonData[], student: StudentNames) => {
    return lessons.filter(lesson => lesson.student === student).reduce((acc, lesson) => {
        return acc + (lesson.length === 45 ? 35 : lesson.length * 50 / 60);
    }, 0);
};

export const getTotalForMonth = (lessons: LessonData[], students: StudentList) => {
    return students.map(student => getTotalAmountForStudent(lessons, student.name)).reduce((acc, curr) => acc + curr, 0);
};
