import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function generateRandomNumber(min = 1, max = 1000) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Example usage:

export const downloadPDF = (name) => {
	const table = document.getElementById(name);

	html2canvas(table).then((canvas) => {
		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF('p', 'pt', 'a4');
		// const imgWidth = 300;
		// const pageHeight = 290;
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		const imgWidth = pageWidth;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		let heightLeft = imgHeight;
		let position = 0;

		pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;

		while (heightLeft >= 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
		}
		const randomNum = generateRandomNumber(1, 100);
		pdf.save(`${name}-${randomNum}.pdf`);
	});
};
