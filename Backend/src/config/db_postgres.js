const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres@127.0.0.1:5432/caresync_sql';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const connectPostgres = async () => {
    try {
        await prisma.$connect();
        console.log('Successfully connected to PostgreSQL via Prisma');
    } catch (error) {
        console.error('Prisma Connection Error:', error.message);
    }
};

module.exports = { prisma, connectPostgres };
