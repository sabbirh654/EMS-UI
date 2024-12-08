import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  createCsvContent(headers: string[], data: any[]): string {
    const headerRow = headers.join(',');
    const rows = data
      .map((row) => headers.map((header) => row[header] || '').join(','))
      .join('\n');
    return `${headerRow}\n${rows}`;
  }

  downloadFile(content: Blob, fileName: string) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(content);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  createExcelContent(headers: string[], data: any[][]): XLSX.WorkSheet {
    const sheetData = [headers, ...data];
    return XLSX.utils.aoa_to_sheet(sheetData);
  }

  adjustColumnWidths(headers: string[], data: any[][]): { wch: number }[] {
    return headers.map((header, index) => {
      const maxContentLength = Math.max(
        header.length,
        ...data.map((row) => String(row[index] || '').length)
      );
      return { wch: maxContentLength + 2 };
    });
  }

  exportToExcel(
    headers: string[],
    data: any[][],
    fileName: string,
    sheetName = 'Sheet1'
  ) {
    const worksheet = this.createExcelContent(headers, data);
    worksheet['!cols'] = this.adjustColumnWidths(headers, data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
  }
}
