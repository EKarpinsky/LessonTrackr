// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { LessonData } from "../../common/types";
import fs from "fs";
import path from "path";

/**
 * Gets the csv located in lessons.csv, parses it by line, and returns an array of LessonData objects
 */
export const fetchAllLessons = (): Promise<LessonData[]> => {
   // csv file located in common/data/[currentMonth]-[currentYear]-lessons.csv
   const date = new Date();
   const month = date.getMonth() + 1;
   const year = date.getFullYear();
   return new Promise((resolve, reject) => {
      fs.readFile(path.join(process.cwd(), "common", "data", `${month}-${year}-lessons.csv`), "utf8", (err, csv) => {
         if (err) {
            reject(err);
         }
         // create file if it doesnt exist
         if (!csv) {
            fs.writeFile(path.join(process.cwd(), "common", "data", `${month}-${year}-lessons.csv`), "date,student,length,inperson\r\n", "utf8", (err) => {
               if (err) {
                  reject(err);
               }
               resolve([]);
            });
         }
         const lines = csv.split(`\r\n`);
         const lessons = lines
             .slice(1) // skip the first line (the heading)
             .map((line) => {
                const [date, student, length, isInPerson] = line.split(",");
                return {
                   date,
                   student,
                   length: parseInt(length),
                   isInPerson: isInPerson === "true",
                } as LessonData;
             })
             .filter((lesson) => lesson.date && lesson.student && lesson.length);
         // order by date from oldest to newest
         lessons.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            return aDate.getTime() - bDate.getTime();
         });
         resolve(lessons);
      });
   });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LessonData[]>
) {
   // fetch allLessons from csv file located in data/lessons.csv
   const allLessons = await fetchAllLessons();
   console.log(allLessons);

   res.status(200).json(allLessons)
}
