import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

// Function to clear the database
async function cleanDatabase() {
    await prisma.mark.deleteMany({});
    await prisma.movieGenre.deleteMany({});
    await prisma.movieCountry.deleteMany({});
    await prisma.movie.deleteMany({});
    await prisma.country.deleteMany({});
    await prisma.genre.deleteMany({});
    await prisma.user.deleteMany({});
}

// Function to convert duration from h:m to minutes
function convertDurationToMinutes(duration: string): number {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours * 60 + minutes;
}

async function main() {
    // Clean the database before import
    await cleanDatabase();

    // Create users
    const users = ['Yaroslav', 'Yegor', 'Sanya'];
    for (const user of users) {
        const email = `${user.toLowerCase()}@example.com`;
        
        // Use upsert to avoid duplicate emails
        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                login: user,
                email,
            },
        });
    }

    // Import data from CSV
    const csvFilePath = '/Users/yegor/Downloads/FilmsProcessed.csv'; // Specify the path to your CSV file

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', async (row) => {
            const titleMatch = row.Title.match(/(.*)\s*\((.*)\)/);
            const title_ru = titleMatch ? titleMatch[1].trim() : row.Title;
            const title_or = titleMatch && titleMatch[2] ? titleMatch[2].trim() : null;

            const year = row.Year;
            const duration = convertDurationToMinutes(row.Duration);
            const genres = row.Genre.split(',').map((g: string) => g.trim().toLowerCase());
            const countries = row.Country.split(',').map((c: string) => c.trim().toLowerCase());

            // Create movie
            const movie = await prisma.movie.create({
                data: {
                    title_ru,
                    title_or,
                    duration,
                    launch: new Date(`${year}-01-01`),
                    marksAmount: 0,
                    marksScore: 0,
                },
            });

            // Handle genres
            for (const genre of genres) {
                const trimmedGenre = genre.trim().toLowerCase();

                try {
                    // Upsert genre
                    await prisma.genre.upsert({
                        where: { value: trimmedGenre },
                        update: {},
                        create: { value: trimmedGenre },
                    });
                } catch (error: any) {
                    if (error.code === 'P2002') {
                        console.warn(`Genre "${trimmedGenre}" already exists. Skipping...`);
                    } else {
                        console.error(`Error processing genre "${trimmedGenre}":`, error);
                    }
                }

                // Connect genre to movie
                const genreRecord = await prisma.genre.findUnique({
                    where: { value: trimmedGenre },
                });

                if (genreRecord) {
                    await prisma.movieGenre.create({
                        data: {
                            movieId: movie.id,
                            genreId: genreRecord.id,
                        },
                    });
                }
            }

            // Handle countries
            for (const country of countries) {
                const trimmedCountry = country.trim().toLowerCase();

                try {
                    // Upsert country
                    await prisma.country.upsert({
                        where: { value: trimmedCountry },
                        update: {},
                        create: { value: trimmedCountry },
                    });
                } catch (error:any) {
                    if (error.code === 'P2002') {
                        console.warn(`Country "${trimmedCountry}" already exists. Skipping...`);
                    } else {
                        console.error(`Error processing country "${trimmedCountry}":`, error);
                    }
                }

                // Connect country to movie
                const countryRecord = await prisma.country.findUnique({
                    where: { value: trimmedCountry },
                });

                if (countryRecord) {
                    await prisma.movieCountry.create({
                        data: {
                            movieId: movie.id,
                            countryId: countryRecord.id,
                        },
                    });
                }
            }

            // Create marks
            for (const user of users) {
                const userRecord = await prisma.user.findUnique({
                    where: { email: `${user.toLowerCase()}@example.com` },
                });

                if (userRecord) {
                    const markValue = parseInt(row[user], 10) || null;
                    if(markValue){
                        await prisma.mark.create({
                            data: {
                                movieId: movie.id,
                                userId: userRecord.id,
                                value: markValue,
                            },
                        });

                        // Update marksAmount and marksScore
                        await prisma.movie.update({
                            where: { id: movie.id },
                            data: {
                                marksAmount: { increment: 1 },
                                marksScore: { increment: markValue },
                            },
                        });
                    }
                } else {
                    console.warn(`User ${user} not found.`);
                }
            }
        })
        .on('end', async () => {
            console.log('Import finished!');
            await prisma.$disconnect();
        })
        .on('error', (error) => {
            console.error('Error reading CSV:', error);
        });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
