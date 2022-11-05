// the form component
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { AvailableLengths, LessonData, StudentNames } from "../../types";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

type FormProps = {
   lessons: LessonData[];
   onLessonSubmit: (lessons: LessonData[]) => void;
   students: Array<{ name: StudentNames, defaultLength: AvailableLengths }>;
}
const AVAILABLE_LENGTHS: AvailableLengths[] = [30, 45, 60, 90, 120];
const inPersonDiv = css`
  display: flex;
  flex-direction: column;;
  align-items: center;
  color: #ffffff;

  input {
    display: none;

    &:not(:checked) + label {
      background-color: #333;
      color: #fff;

      &:hover {
        background-color: #555;
      }

      &:focus {
        outline: none;
      }

      &:focus-visible {
        outline: 2px solid #333;
      }
    }

    &:checked + label {
      background-color: #fff;
      color: #333;

      &:hover {
        background-color: #ddd;

        &:focus {
          outline: none;
        }
      }

      &:active {
        background-color: #bbb;
      }
    }

    &:focus {
      outline: none;
    }
  }

  label {
    display: block;
    padding: 5px 10px;
    border: 1px solid #333;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    margin-top: 5px;
    width: 35%;


    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid #333;
    }

    &:hover {
      background-color: #ddd;
    }
  }

  div {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
`

const form = css`
  // a card like form with 2 columns - length and date dropdowns on the left, and student name and in person checkbox on the right
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0 auto;
  width: 50%;

  label {
    display: block;
    // not first or 2nd of type
    &:not(:first-of-type):not(:nth-of-type(2)) {
      margin-top: 10px;

      input {
        margin-top: 5px;

        &:first-of-type {
          margin-top: 0;
        }
      }
    }

    select {
      margin-top: 5px;
      display: block;
    }

    input:not([type="radio"]), select {
      margin-top: 5px;
      display: block;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 5px;
      width: 100%;

      &:focus {
        outline: none;
        border-color: #333;

        &::placeholder {
          color: #333;
        }
      }
    }
  }
`;


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
