const fs = require('fs');

// Add animation to index.html
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('shrinkToTopRight')) {
    const splashCSS = `
      @keyframes shrinkToTopRight {
        0% { transform: scale(1) translate(0, 0); opacity: 1; }
        20% { transform: scale(1.1) translate(0, 0); opacity: 1; }
        100% { transform: scale(0.2) translate(150vw, -150vh); opacity: 0; }
      }
      .animate-shrink-to-top-right {
        animation: shrinkToTopRight 1.5s cubic-bezier(0.5, 0, 0.2, 1) forwards;
      }
    `;
    html = html.replace('</style>', splashCSS + '\n    </style>');
    fs.writeFileSync('index.html', html);
}

// Modify PublicDashboard.tsx
let publicDash = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

if (!publicDash.includes('showSuccessSplash')) {
    // 1. Add state
    publicDash = publicDash.replace(
        'const [isSubmitting, setIsSubmitting] = useState(false);',
        'const [isSubmitting, setIsSubmitting] = useState(false);\n  const [showSuccessSplash, setShowSuccessSplash] = useState(false);'
    );

    // 2. Modify handleLoginSubmit
    publicDash = publicDash.replace(
        `localStorage.setItem('saved_nip', userId);\n        navigate('/dashboard');`,
        `localStorage.setItem('saved_nip', userId);\n        setShowSuccessSplash(true);\n        setTimeout(() => navigate('/dashboard'), 1500);`
    );

    // 3. Add splash markup at the end of the return statement (before </Layout>)
    // The main component returns <Layout>...</Layout>. I'll insert it right before the last `</Layout>` or inside it.
    // Actually PublicDashboard returns <div className="min-h-screen...">...</div>
    // Let's just insert it before the last `</div>`
    const insertPos = publicDash.lastIndexOf('</div>');
    const splashMarkup = `
      {showSuccessSplash && (
        <div className="fixed inset-0 z-[999999] bg-slate-900 flex items-center justify-center">
            <div className="relative animate-shrink-to-top-right">
                <Bell size={120} className="text-[#fb923c] animate-pulse drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
                <span className="absolute top-0 right-2 z-20 min-w-[36px] h-[36px] flex items-center justify-center text-[18px] font-bold text-slate-100 border-4 border-slate-900 rounded-full px-[3px] bg-[#fb923c]">
                    3
                </span>
            </div>
        </div>
      )}
    `;
    publicDash = publicDash.substring(0, insertPos) + splashMarkup + publicDash.substring(insertPos);

    // Add Bell to imports if not there. Wait, is Bell imported in PublicDashboard?
    if (!publicDash.includes('Bell,') && !publicDash.includes('{ Bell')) {
         publicDash = publicDash.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { Bell, $1 } from 'lucide-react';");
    }

    fs.writeFileSync('pages/PublicDashboard.tsx', publicDash);
}

