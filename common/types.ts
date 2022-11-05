// student names allowed
export type StudentNames = "Mori" | "Ethan/Juliette" | "Emma" | "Eden" | ""

export type AvailableLengths = 30 | 45 | 60 | 90 | 120;


// lesson structure
export type LessonData = {
   student: StudentNames;
   length: number,
   // date in format YYYY-MM-DD
   date: string,
   isInPerson: boolean,
}

export type StudentDetails = { name: StudentNames; defaultLength: AvailableLengths }
export type StudentList = Array<StudentDetails>;
