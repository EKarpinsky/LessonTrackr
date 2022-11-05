// the form component
import { ChangeEvent, FormEvent, useState } from 'react';
import { AvailableLengths, LessonData, StudentList, StudentNames } from "../../types";
/** @jsxImportSource @emotion/react */
import { form, inPersonDiv } from "./styles";

type FormProps = {
   lessons: LessonData[];
   onLessonSubmit: (lessons: LessonData[]) => void;
   students: StudentList;
}
const AVAILABLE_LENGTHS: AvailableLengths[] = [30, 45, 60, 90, 120];


export const Form = ({ lessons, onLessonSubmit, students }: FormProps) => {
   const [student, setStudent] = useState<StudentNames>('');
   const [length, setLength] = useState<AvailableLengths>(30);
   const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
   const [errorMessage, setErrorMessage] = useState<string>('');
   const [isInPerson, setIsInPerson] = useState<boolean>(false);

   const onStudentSelect = (e: ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      setStudent(target.value as StudentNames);
      const defaultLength = students.find(s => s.name === target.value)?.defaultLength;
      if (defaultLength) {
         setLength(defaultLength);
      }
   }

   // update the csv with the new lesson and download
   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const newLesson: LessonData = {
         student,
         length,
         date,
         isInPerson
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
      onLessonSubmit(data);
      setErrorMessage('');
   }
   return (
       <form onSubmit={handleSubmit} css={form}>
          <label>
             Student:
             <select value={student} onChange={onStudentSelect}>
                <option value=''>Select a student</option>
                {students.map(student => <option key={student.name}
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
          <div css={inPersonDiv}>
             In Person:
             <div>
                <input type='radio' id='yes' name='in-person' value='yes' checked={isInPerson}
                       onChange={() => setIsInPerson(true)}/>
                <label htmlFor='yes'>Yes</label>
                <input type='radio' id='no' name='in-person' value='no' checked={!isInPerson}
                       onChange={() => setIsInPerson(false)}/>
                <label htmlFor='no'>No</label>
             </div>
          </div>
          <input type='submit' value='Submit Lesson'/>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
       </form>
   );
}
