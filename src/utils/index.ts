import * as fs from 'fs';

export const readJSON = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
export const getToday = () => new Date().toISOString().split('T')[0];