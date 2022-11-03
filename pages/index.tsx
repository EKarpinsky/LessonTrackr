import { ChangeEvent, CSSProperties, FormEvent, useCallback, useEffect, useState } from "react";
import { LessonData, Students, AvailableLengths } from "../common/types";

// styles to make the tables look like cards
const styles: { [key: string]: CSSProperties } = {
   table: {
      borderCollapse: 'collapse',
      margin: '0 auto',
      width: '50%',
      border: '1px solid #ddd',
      textAlign: 'left',
   },
   th: {
      padding: '16px',
   },
   td: {
      padding: '16px',
      border: '1px solid #ddd',
   },
}

const STUDENTS: Array<{ name: Students, defaultLength: AvailableLengths }> = [
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

const AVAILABLE_LENGTHS: AvailableLengths[] = [30, 45, 60, 90, 120];

const getTotalAmountText = (student: Students, lessons: LessonData[], total: number) => `Hello! In ${new Date().toLocaleString('default', { month: 'long' })}, we had ${lessons.filter(lesson => lesson.student === student).length} lesson${lessons.filter(lesson => lesson.student === student).length === 1 ? '' : 's'} for a total of $${total}`;

const getTotalAmountForStudent = (lessons: LessonData[], student: Students) => lessons.filter(lesson => lesson.student === student).reduce((acc, lesson) => acc + (lesson.length === 45 ? 35 : lesson.length * 50 / 60), 0);

export default function Home() {
   const [lessons, setLessons] = useState<LessonData[]>([]);
   const [student, setStudent] = useState<Students>('');
   const [length, setLength] = useState<AvailableLengths>(30);
   const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
   const [errorMessage, setErrorMessage] = useState<string>('');
   const [lessonToDelete, setLessonToDelete] = useState<LessonData | null>(null);

   // update the csv with the new lesson and download
   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const newLesson: LessonData = {
         student,
         length,
         date
      }
      // don't allow multiple lessons per day PER SAME STUDENT
      if (lessons.some(lesson => lesson.student === student && lesson.date === date)) {
         setErrorMessage('You already have a lesson scheduled for this day!');
         return;
      }
      if (!student || !length || !date) {
         setErrorMessage('Please fill out all fields!');
         return;
      }
      // add the new lesson to the lessons array using epi endpoint
      const res = await fetch('/api/add-lesson', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },

         body: JSON.stringify(newLesson)
      });
      const data = await res.json();
      setLessons(data);
      setErrorMessage('');
   }

   const onStudentSelect = (e: ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      setStudent(target.value as Students);
      const defaultLength = STUDENTS.find(s => s.name === target.value)?.defaultLength;
      if (defaultLength) {
         setLength(defaultLength);
      }
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

   // delete useEffect
   useEffect(() => {
      // if null return
      if (!lessonToDelete || !(lessonToDelete.student && lessonToDelete.length && lessonToDelete.date)) {
         return;
      }
      fetch('/api/delete-lesson', {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(lessonToDelete)
      }).then(res => res.json()).then(data => {
         setLessons(data);
         setLessonToDelete({
            student: '',
            length: 0,
            date: ''
         });
      }).catch(err => console.log(err));
   }, [lessonToDelete]);

   return (
       <div className='App'>
          <h1>Lesson Tracker</h1>
          <h2>Month: {
             new Date().toLocaleString('default', {
                month: 'long'
             })
          }</h2>
          <div style={{
             width: '50%',
             margin: '0 auto',
             padding: '20px',
             border: '1px solid #ddd',
             borderRadius: '5px',
          }}>
             <form onSubmit={handleSubmit} style={
                {
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                }
             }>
                <label>
                   Student:
                   <select value={student} onChange={onStudentSelect}>
                      <option value=''>Select a student</option>
                      {STUDENTS.map(student => <option key={student.name}
                                                       value={student.name}>{student.name}</option>)}
                   </select>
                </label>
                <label>
                   Length:
                   <select value={length}
                           onChange={(e: ChangeEvent<HTMLSelectElement>) => setLength(parseInt(e.target.value) as AvailableLengths)}>
                      {AVAILABLE_LENGTHS.map(length => <option key={length} value={length}>{length}</option>)}
                   </select>
                </label>
                <label>
                   Date:
                   <input type='date' value={date} onChange={e => setDate(e.target.value)}/>
                </label>
                <input type='submit' value='Submit Lesson'/>
             </form>
             {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
          {STUDENTS.map(student => <div key={student.name} style={{
             width: '50%',
             margin: '0 auto',
             padding: '20px',
             border: '1px solid #ddd',
             borderRadius: '5px',
          }}>
             <h2>{student.name}</h2>
             <table style={
                styles.table
             }>
                <thead>
                <tr>
                   <th style={
                      styles.th
                   }>Date
                   </th>
                   <th style={
                      styles.th
                   }>Length
                   </th>
                   <th style={
                      styles.th
                   }>Price
                   </th>
                   <th style={
                      styles.th
                   }>Delete
                   </th>
                </tr>
                </thead>
                <tbody>
                {lessons.filter(lesson => lesson.student === student.name).map((lesson, index) => {
                   return <tr key={index}>
                      <td style={
                         styles.td
                      }>{lesson.date}</td>
                      <td style={
                         styles.td
                      }>{lesson.length}</td>
                      {/*price is 50/h. if 45 round down to 35*/}
                      <td style={
                         styles.td
                      }>${lesson.length === 45 ? 35 : lesson.length * 50 / 60}</td>
                      <td style={
                         styles.td
                      }>
                         <button onClick={async () => {
                            setLessonToDelete(lesson);
                         }} value={JSON.stringify(lesson)}>Delete
                         </button>
                      </td>
                   </tr>;
                })}
                {/*if no lessons*/}
                {lessons.filter(lesson => lesson.student === student.name).length === 0 && <tr>
                    <td style={
                       styles.td
                    } colSpan={4}>No lessons
                    </td>
                </tr>}
                </tbody>
             </table>
             <h3>Total: ${getTotalAmountForStudent(lessons, student.name)}</h3>
             {/*a button to copy text that says how many lessons the student had and the total amount*/}
             <button onClick={() => {
                navigator.clipboard.writeText(getTotalAmountText(student.name, lessons, getTotalAmountForStudent(lessons, student.name))).then(r => console.log(r)).catch(err => console.log(err));
             }}>Copy
             </button>
          </div>)}
       </div>

   )
}
