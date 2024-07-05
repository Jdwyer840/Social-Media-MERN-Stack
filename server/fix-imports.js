import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function addJsExtension(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            addJsExtension(filePath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/from\s+['"]([^'"]+)['"]/g, (match, group1) => {
                if (group1.startsWith('.') && !group1.endsWith('.js')) {
                    return match.replace(group1, group1 + '.js');
                }
                return match;
            });
            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
}

addJsExtension(path.join(__dirname, 'dist'));
