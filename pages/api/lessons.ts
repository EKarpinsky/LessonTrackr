// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { LessonData } from "../../common/types";
import fs from "fs";
import path from "path";

/**
 * Gets the csv located in lessons.csv, parses it by line, and returns an array of LessonData objects
 */
export const fetchAllLessons = (): LessonData[] => {
   const lessons = [];
   // csv file located in common/data/[currentMonth]-[currentYear]-lessons.csv
   const date = new Date();
   const month = date.getMonth() + 1;
   const year = date.getFullYear();
   const csv = fs.readFileSync(path.join(process.cwd(), "common", "data", `${month}-${year}-lessons.csv`), "utf8");
   const lines = csv.split(`\r\n`);
   for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const [date, student, length, isInPerson] = line.split(',');
      if (!date || !student || !length || !isInPerson) {
         continue;
      }
      lessons.push({ student, length: parseInt(length), date, isInPerson: isInPerson === "true" } as LessonData);
   }
   // order by date from oldest to newest
   lessons.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate.getTime() - bDate.getTime();
   });
   return lessons;

};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<LessonData[]>
) {
   // fetch allLessons from csv file located in data/lessons.csv
   const allLessons = fetchAllLessons();
   console.log(allLessons);

   res.status(200).json(allLessons)
}
