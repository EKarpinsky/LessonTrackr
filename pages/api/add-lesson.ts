import type { NextApiRequest, NextApiResponse } from 'next';
import { LessonData } from '../../common/types';
import fs from 'fs';
import path from 'path';
import { fetchAllLessons } from './lessons';

/**
 * Adds a lesson to the csv located in lessons.csv
 * @param allLessons
 */
export const writeLessons = (allLessons: LessonData[]): void => {
	// write allLessons to csv file located in data/[currentMonth]-[currentYear]-lessons.csv. overwrite if exists, make new file if it doesnt. format is date-student-length. use template string
	const date = new Date();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const csvWithHeading = `date,student,length,inperson\r\n${allLessons
		.map(lesson => `${lesson.date},${lesson.student},${lesson.length},${lesson.isInPerson}`)
		.join(`\r\n`)}`;
	fs.writeFile(
		path.join(process.cwd(), 'common', 'data', `${month}-${year}-lessons.csv`),
		csvWithHeading,
		'utf8',
		err => {
			if (err) {
				console.log(err);
			}
		}
	);
};

/**
 * Post path for adding a lesson to the lessons.csv file
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LessonData[] | Error>
) {
	console.log('entering add-lesson.ts');
	// only post requests allowed
	if (req.method !== 'POST') {
		console.log('exiting add-lesson.ts - not a post request');
		res.status(405).json(new Error('Method not allowed'));
	}
	// add new lesson to allLessons
	const newLesson = req.body as LessonData;
	if (!newLesson || !newLesson.date || !newLesson.student || !newLesson.length) {
		res.status(500).json(new Error('Invalid lesson data'));
	}
	// fetch allLessons from csv file located in data/lessons.csv
	const allLessons = await fetchAllLessons();
	if (!allLessons) {
		res.status(500).json(new Error('Could not fetch lessons'));
	}
	allLessons.push(newLesson);
	// write allLessons to lessons.csv
	writeLessons(allLessons);
	// return allLessons
	res.status(200).json(allLessons);
	console.log('exiting add-lesson.ts');
}
