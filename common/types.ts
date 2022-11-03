// student names allowed
export type Students = "Mori" | "Ethan/Juliette" | "Emma" | "Eden" | ""

export type AvailableLengths = 30 | 45 | 60 | 90 | 120;


// lesson structure
export type LessonData = {
   student: Students;
   length: number,
   // date in format YYYY-MM-DD
   date: string,
}
