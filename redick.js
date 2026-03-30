const fs = require('fs');
const path = require('path');

// Какие файлы ищем
const filesToFind = new Set([
  'products.json',
  'Product.ts',
  'productService.ts',
  'productController.ts',
  'User.ts',
  'ShopPage.tsx'
]);

// Куда писать результат
const outputFile = path.join(__dirname, 'bundle.txt');

// Рекурсивный обход всех папок
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

function mergeFiles() {
  let output = '';

  walkDir(__dirname, (filePath) => {
    const fileName = path.basename(filePath);

    if (filesToFind.has(fileName)) {
      const content = fs.readFileSync(filePath, 'utf8');

      output += `\n\n===== ${fileName} (${filePath}) =====\n\n`;
      output += content;
    }
  });

  fs.writeFileSync(outputFile, output, 'utf8');
  console.log('Готово! Все найденные файлы собраны в bundle.txt');
}

mergeFiles();
