const { parse } = require('csv-parse');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const records = [];
const handleRecords = () => {
  let certs = '';
  records.slice(1).reverse().forEach((record, count) => {
    record.forEach((value, index) => {
      let key = records[0][index];
      if (key === 'Name') {
        certs += `${count + 1}) ${value}\n`;
        return;
      }
      if (key === 'Url') key = 'Link';
      if (key === 'Started On') {
        key = 'Obtained';
        const index = shortMonths.indexOf(value.split(' ')[0]);
        value = value.replace(shortMonths[index], longMonths[index]);
      }
      if (key === 'Finished On') {
        if (!value) return;
        key = 'Expired';
        const index = shortMonths.indexOf(value.split(' ')[0]);
        value = value.replace(shortMonths[index], longMonths[index]);
      }
      if (key === 'License Number') {
        key = 'Code';
        if (!value) return;
      }
      certs += `${key}: ${value}\n`;
    });
    certs += '\n';    
  });
  writeFileSync('cert.txt', certs);
};


const parser = parse();
parser.on('readable', () => {
  let record;
  while ((record = parser.read()) !== null) records.push(record);
});
parser.on('end', handleRecords);
parser.write(readFileSync(join(__dirname, 'cert.csv')));
parser.end();
