// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { LessonData } from '../../common/types';
import fs from 'fs';
import path from 'path';

/**
 * Gets the csv located in lessons.csv, parses it by line, and returns an array of LessonData objects
 */
export const fetchAllLessons = async (): Promise<LessonData[]> => {
	// csv file located in common/data/[currentMonth]-[currentYear]-lessons.csv
	const date = new Date();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const csvFilePath = getCsvFilePath(month, year);

	return new Promise((resolve, reject) => {
		fs.readFile(csvFilePath, 'utf8', (err, csv) => {
			if (err) {
				reject(err);
			}

			// create file if it doesnt exist
			if (!csv) {
				createCsvFile(csvFilePath, err => {
					if (err) {
						reject(err);
					}
					resolve([]);
				});
			}

			const lessons = parseCsv(csv);
			resolve(lessons);
		});
	});
};

const getCsvFilePath = (month: number, year: number): string => {
	return path.join(process.cwd(), 'common', 'data', `${month}-${year}-lessons.csv`);
};

const createCsvFile = (
	filePath: string,
	callback: (err: NodeJS.ErrnoException | null) => void
): void => {
	fs.writeFile(filePath, 'date,student,length,inperson\r\n', 'utf8', callback);
};

const parseCsv = (csv: string): LessonData[] => {
	const lines = csv.split(`\r\n`);
	const lessons = lines
		.slice(1) // skip the first line (the heading)
		.map(line => {
			const [date, student, length, isInPerson] = line.split(',');
			return {
				date,
				student,
				length: parseInt(length),
				isInPerson: isInPerson === 'true',
			} as LessonData;
		})
		.filter(lesson => lesson.date && lesson.student && lesson.length);

	// order by date from oldest to newest
	lessons.sort((a, b) => {
		const aDate = new Date(a.date);
		const bDate = new Date(b.date);
		return aDate.getTime() - bDate.getTime();
	});

	return lessons;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<LessonData[]>) => {
	// fetch allLessons from csv file located in data/lessons.csv
	const allLessons = await fetchAllLessons();
	console.log(allLessons);

	res.status(200).json(allLessons);
};
export default handler;
