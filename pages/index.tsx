import { useEffect, useState } from "react";
import { LessonData, StudentList } from "../common/types";
import { Student } from "../common/components/Student/Student";

import { Form } from "../common/components/Form/Form";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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

   const onLessonChange = (lessons: LessonData[]) => {
      setLessons(lessons);
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

   return (
       <div className='App'>
          <header css={headerStyle}>
             <h1>Lesson Tracker</h1>
             <h2>Month: {
                new Date().toLocaleString('default', {
                   month: 'long'
                })
             }</h2>
          </header>
          <div style={{
             width: '50%',
             margin: '0 auto',
             padding: '20px',
             border: '1px solid #ddd',
             borderRadius: '5px',
          }}>
             <Form onLessonSubmit={onLessonChange} students={STUDENTS} lessons={lessons}/>
          </div>
          {STUDENTS.map(student => <Student key={student.name} student={student.name} lessons={lessons}
                                            onLessonDelete={onLessonChange}/>)}

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
       </div>);
};
export default Home
