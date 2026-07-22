const fs = require('fs');
let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

if (!content.includes('import { useAuth } from')) {
    content = content.replace(
        "import { Profile } from '../types';",
        "import { Profile } from '../types';\nimport { useAuth } from '../contexts/AuthContext';"
    );
}

// Check where to place `const { availableClasses } = useAuth();`
// We will replace `const availableClasses = ...` with it.
content = content.replace(
    "const availableClasses = ['7A','7B','7C','7D','7E','7F','7G','7H','8A','8B','8C','8D','8E','8F','8G','8H','9A','9B','9C','9D','9E','9F','9G','9H'];",
    "const { availableClasses } = useAuth();"
);

fs.writeFileSync('pages/UsersData.tsx', content);
