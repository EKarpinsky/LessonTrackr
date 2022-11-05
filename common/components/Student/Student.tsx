import { LessonData, StudentNames } from "../../types";
/** @jsxImportSource @emotion/react */
import * as styles from './styles';

type StudentProps = {
   key: string;
   student: StudentNames;
   lessons: LessonData[];
   onLessonDelete: (lessons: LessonData[]) => void;
}

const getTotalAmountText = (student: StudentNames, lessons: LessonData[], total: number) => `Hello! In ${new Date().toLocaleString('default', { month: 'long' })}, we had ${lessons.filter(lesson => lesson.student === student).length} lesson${lessons.filter(lesson => lesson.student === student).length === 1 ? '' : 's'} for a total of $${total}`;

const getTotalAmountForStudent = (lessons: LessonData[], student: StudentNames) => lessons.filter(lesson => lesson.student === student).reduce((acc, lesson) => acc + (lesson.length === 45 ? 35 : lesson.length * 50 / 60), 0);

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


export const Student = ({ key, student, lessons, onLessonDelete }: StudentProps) => {

   const handleDelete = async (lesson: LessonData) => {
      const res = await fetch('/api/delete-lesson', {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(lesson)
      });
      const data = await res.json();
      onLessonDelete(data);
   }

   return (
       <div key={key} style={{
          width: '50%',
          margin: '0 auto',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px',
       }}>
          <h2>{student}</h2>
          <table css={styles.table}>
             <thead>
             <tr>
                <th>Date</th>
                <th>Length</th>
                <th>Price</th>
                <th>In Person</th>
                <th>Delete</th>
             </tr>
             </thead>
             <tbody>
             {lessons.filter(lesson => lesson.student === student).map((lesson, index) => {
                return <tr key={index}>
                   <td>{lesson.date}
                   </td>
                   <td>{lesson.length}</td>
                   <td>${getLessonCost(lesson)}</td>
                   <td>{lesson.isInPerson ? 'Yes' : 'No'}</td>
                   <td css={styles.deleteCell}>
                      <button onClick={async () => {
                         await handleDelete(lesson);
                      }} value={JSON.stringify(lesson)}>Delete
                      </button>
                   </td>
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
