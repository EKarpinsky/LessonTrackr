import { LessonData, StudentNames } from "../../types";
/** @jsxImportSource @emotion/react */
import * as styles from './styles';
import { getTotalAmountForStudent } from "../../utils/calc";
import { useEffect, useLayoutEffect } from "react";

type StudentProps = {
   student: StudentNames;
   lessons: LessonData[];
   onLessonDelete: (lessons: LessonData[]) => void;
   lessonIdOfAddedLesson?: string;
   isInvoiceMode: boolean;
}

const getTotalAmountText = (student: StudentNames, lessons: LessonData[], total: number) => `Hello! In ${new Date().toLocaleString('default', { month: 'long' })}, we had ${lessons.filter(lesson => lesson.student === student).length} lesson${lessons.filter(lesson => lesson.student === student).length === 1 ? '' : 's'} for a total of $${total}, you can etransfer at your convenience, thank you!`;

/**
 * Lessons are $60/hour in person. otherwise, $50/h but $35 for 45 minutes
 * @param lesson
 */
const getLessonCost = (lesson: LessonData) => {
   const IN_PERSON_COST = 60;
   const ONLINE_COST = 50;
   const ONLINE_COST_45_MIN = 35;
   if (lesson.isInPerson) {
      return lesson.length * IN_PERSON_COST / 60;
   }
   if (lesson.length === 45) {
      return ONLINE_COST_45_MIN;
   }
   return lesson.length * ONLINE_COST / 60;
};


export const Student = ({ student, lessons, onLessonDelete, lessonIdOfAddedLesson, isInvoiceMode }: StudentProps) => {

   const handleDelete = async (lesson: LessonData, tr: HTMLTableRowElement) => {
      tr.style.transition = 'all 0.5s ease-in-out';
      tr.style.transform = 'translateY(-100%)';
      tr.style.opacity = '0';
      setTimeout(async () => {
         const res = await fetch('/api/delete-lesson', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(lesson)
         });
         const data = await res.json();
         onLessonDelete(data);
      }, 500);
   }

   return (
       <div css={styles.studentContainer}>
          <h2>{student}</h2>
          <table css={styles.table}>
             <thead>
             <tr>
                <th>Date</th>
                <th>Length</th>
                <th>Price</th>
                {!isInvoiceMode &&
                    <>
                        <th>In Person</th>
                        <th>Delete</th>
                    </>
                }
             </tr>
             </thead>
             <tbody>
             {lessons.filter(lesson => lesson.student === student).map((lesson, index) => {
                const lessonIdForRow = lesson.date.split('-').join('') + '-' + student;
                return <tr key={index} id={lessonIdForRow} css={
                   lessonIdForRow === lessonIdOfAddedLesson
                       ? styles.lastLessonRow
                       : null
                }>
                   <td>{lesson.date}
                   </td>
                   <td>{lesson.length}</td>
                   <td>${getLessonCost(lesson)}</td>
                   {!isInvoiceMode &&
                       <>
                           <td>{lesson.isInPerson ? 'Yes' : 'No'}</td>
                           <td css={styles.deleteCell}>
                               <button onClick={async () => {
                                  const tr = document.getElementById(lessonIdForRow) as HTMLTableRowElement;
                                  await handleDelete(lesson, tr);
                               }} value={JSON.stringify(lesson)}>Delete
                               </button>
                           </td>
                       </>
                   }
                </tr>;
             })}
             {/*if no lessons*/}
             {lessons.filter(lesson => lesson.student === student).length === 0 && <tr>
                 <td colSpan={5}>No lessons
                 </td>
             </tr>}
             </tbody>
          </table>
          <h3>Total: ${getTotalAmountForStudent(lessons, student)}</h3>
          {/*a button to copy text that says how many lessons the student had and the total amount*/}
          <button onClick={() => {
             navigator.clipboard.writeText(getTotalAmountText(student, lessons, getTotalAmountForStudent(lessons, student))).then(r => console.log(r)).catch(err => console.log(err));
          }}>Copy
          </button>
       </div>
   );
}
