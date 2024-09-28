import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (jsonData, fileName) => {
	// Create a new workbook
	const workbook = XLSX.utils.book_new();

	// Convert the JSON data to a worksheet
	const worksheet = XLSX.utils.json_to_sheet(jsonData);

	// Append the worksheet to the workbook
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

	// Write the workbook to a binary string
	const excelBuffer = XLSX.write(workbook, {
		bookType: 'xlsx',
		type: 'array',
	});

	// Create a Blob from the buffer and save it as a file
	const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
	saveAs(blob, `${fileName}.xlsx`);
};
