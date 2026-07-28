const fs = require('fs');
let dash = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

dash = dash.replace(
  `? 'text-blue-500 dark:text-blue-500' \n                                                                    : 'text-blue-600 dark:text-blue-500'`,
  `? 'text-blue-500 dark:text-blue-500' \n                                                                    : 'text-red-500 dark:text-red-500'`
);
dash = dash.replace(
  `? 'text-blue-500 dark:text-blue-500' \n                                                                    : 'text-blue-600 dark:text-blue-400'`,
  `? 'text-blue-500 dark:text-blue-500' \n                                                                    : 'text-red-500 dark:text-red-500'`
);
// just in case they were single line
dash = dash.replace(
  `cell.isFilled \n                                                                    ? 'text-blue-500 dark:text-blue-500' \n                                                                    : 'text-blue-600 dark:text-blue-500'`,
  `cell.isFilled \n                                                                    ? 'text-blue-500 dark:text-blue-500' \n                                                                    : 'text-red-500 dark:text-red-500'`
);

fs.writeFileSync('pages/Dashboard.tsx', dash);
console.log("Done color");
