import type { NextApiRequest, NextApiResponse } from 'next'
import { LessonData } from "../../common/types";
import fs from "fs";
import path from "path";
import { fetchAllLessons } from "./lessons";
import { writeLessons } from "./add-lesson";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<LessonData[] | Error>
) {
   console.log("entering delete-lesson.ts");
   // only delete requests allowed
   if (req.method === "DELETE") {
      // delete lesson from allLessons
      const lessonToDelete = req.body as LessonData;
      if (!lessonToDelete || !lessonToDelete.date || !lessonToDelete.student || !lessonToDelete.length) {
         res.status(500).json(new Error("Invalid lesson data"));
         return;
      }
      // fetch allLessons from csv file located in data/lessons.csv
      const allLessons = fetchAllLessons();
      if (!allLessons) {
         res.status(500).json(new Error("Could not fetch lessons"));
         return;
      }
      const index = allLessons.findIndex(lesson => lesson.date === lessonToDelete.date && lesson.student === lessonToDelete.student && lesson.length === lessonToDelete.length);
      if (index === -1) {
         res.status(500).json(new Error("Could not find lesson to delete"));
         return;
      }
      allLessons.splice(index, 1);
      // write allLessons to lessons.csv
      writeLessons(allLessons);
      allLessons.sort((a, b) => {
         const aDate = new Date(a.date);
         const bDate = new Date(b.date);
         return aDate.getTime() - bDate.getTime();
      });
      // return allLessons
      res.status(200).json(allLessons)
      console.log("exiting delete-lesson.ts");
   } else {
      console.log("exiting delete-lesson.ts - not a delete request");
      res.status(405).json(new Error("Method not allowed"));
   }
}
