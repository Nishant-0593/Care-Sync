const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    const dir = path.join(__dirname, 'prisma', 'migrations', '0_init');
    fs.mkdirSync(dir, { recursive: true });
    console.log('Generating migration script...');
    const script = execSync('npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script', { encoding: 'utf8' });
    fs.writeFileSync(path.join(dir, 'migration.sql'), script, 'utf8');
    console.log('Baseline migration created successfully.');
} catch (error) {
    console.error('Failed to create baseline:', error.message);
}
