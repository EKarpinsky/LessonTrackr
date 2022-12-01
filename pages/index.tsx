import { useEffect, useState } from "react";
import { LessonData, StudentList } from "../common/types";
import { Student } from "../common/components/Student/Student";

import { Form } from "../common/components/Form/Form";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { getTotalForMonth } from "../common/utils/calc";

const headerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
`;

const STUDENTS: StudentList = [
   {
      name: 'Mori',
      defaultLength: 60
   }, {
      name: 'Eden',
      defaultLength: 45
   }, {
      name: 'Ethan/Juliette',
      defaultLength: 60
   }, {
      name: 'Emma',
      defaultLength: 30
   }
]

const Home = () => {
   const [lessons, setLessons] = useState<LessonData[]>([]);
   const [lessonWasAdded, setLessonWasAdded] = useState<boolean>(false);
   const [lessonIdOfAddedLesson, setLessonIdOfAddedLesson] = useState<string>('');
   const [isInvoiceMode, setIsInvoiceMode] = useState<boolean>(false);

   const onLessonChange = (newLessons: LessonData[]) => {
      if (newLessons.length > 0 && newLessons.length > lessons.length) {
         setLessonWasAdded(true);
         const newLesson = newLessons.find(lesson => {
            return !lessons.find(oldLesson => oldLesson.student === lesson.student && oldLesson.date === lesson.date)
         });
         if (newLesson) {
            const lessonId = newLesson.date.split('-').join('') + '-' + newLesson.student;
            setLessonIdOfAddedLesson(lessonId);
         }
      }
      setLessons(newLessons);
   }

   // load existing csv file on mount
   useEffect(() => {
      fetch('/api/lessons')
          .then(res => res.json())
          .then(data => {
             console.log(data);
             setLessons(data)
          })
          .catch(err => console.log(err));
   }, []);

   // when the content re-renders because a lesson was ADDED, get that specific table row that was added for that lesson (for the specific student)
   // and make a "fade in from the top" effect on it when it loads
   // it should start hidden, moved up by 100% (so it's under the row above it) and then slowly fade in while moving down into its place
   useEffect(() => {
      const lastLesson = lessonIdOfAddedLesson
      if (!lastLesson) return;
      const lastLessonRow = document.getElementById(lastLesson);

      if (lastLessonRow) {
         if (lessonWasAdded) {
            lastLessonRow.style.transition = 'all 0.5s ease-in-out';
            setLessonWasAdded(false);
         }
         lastLessonRow.className = '';
         lastLessonRow.style.transform = 'translateY(0)';
         lastLessonRow.style.opacity = '1';
      }
      setLessonIdOfAddedLesson('');

   }, [lessons]);

   return (
       <div className='App' css={css`
         padding: 0 15px;
       `}>
          <header css={headerStyle}>
             <h1>Lesson Tracker</h1>
             <h2>Month: {
                new Date().toLocaleString('default', {
                   month: 'long'
                })
             }</h2>
          </header>
          <div css={css`
            width: 50%;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;

            @media (max-width: 1024px) {
              width: 100%;
              h2 {
                font-size: 1.5rem;
              }
            }
          `}>
             <Form onLessonSubmit={onLessonChange} students={STUDENTS} lessons={lessons}/>
          {/*   checkbox for invoice mode */}
                <div css={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 10px;
                `}>
                    <label css={css`
                        margin-right: 10px;
                    `}>Invoice Mode</label>
                    <input type="checkbox" checked={isInvoiceMode} onChange={() => setIsInvoiceMode(!isInvoiceMode)}/>
                </div>

          </div>
          {STUDENTS.map(student => <Student key={student.name} student={student.name} lessons={lessons}
                                            onLessonDelete={onLessonChange}
                                            lessonIdOfAddedLesson={lessonIdOfAddedLesson}
          isInvoiceMode={isInvoiceMode}/>)}

          {/*   total for month. use emotion instead of inline style */}
          <div css={css`
            width: 50%;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: center;
          `}>
             <h2>Total for Month</h2>
             <div>
                {/*    return all students totaled together for grand total of month*/}
                ${getTotalForMonth(lessons, STUDENTS)}
             </div>
          </div>
       </div>
   );
};
export default Home
