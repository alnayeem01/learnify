const { env } = process as { env: { [key: string]: string } };

export const MONGO_URI = process.env.MONGO_URI as string;