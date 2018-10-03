import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

export class HistoryPrint {

    getCurrentTime() {
        const d = new Date();
        const printTime = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
            + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return printTime;
    }

    createHistoryPDF(records: any[], device: any, show: number, excelService: any) {
        if (show === 0) {
            this.downloadExcel(records, device, excelService);
            return;
        }
        const doc = this.getHistoryDoc(records, device);
        if (show === 1) {
            doc.save('history_' + device.imei + '.pdf');
        }
        if (show === 2) {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    getHistoryDoc(records: any[], device: any): jsPDF {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('ICSSE Seguridad', 15, 20);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Historial del dispositivo: IMEI ' + device.imei, 15, 27);
        doc.text('Hora de impresión: ' + this.getCurrentTime(), 15, 34);
        const body = [];
        if (records.length) {
            for (let i = 0; i < records.length; i++) {
                let date;
                let time;
                let cellBody;
                if (device.group_name !== 'Tablet Guardia') {
                    date = records[i].date;
                    time = records[i].time;
                    cellBody = records[i].address;
                } else {
                    date = records[i].generated_time.split(' ')[0];
                    time = records[i].generated_time.split(' ')[1];
                    cellBody = records[i].guard_name.trim() + ' ' + records[i].guard_lastname.trim();
                }
                body.push([
                    records[i].index,
                    cellBody,
                    date,
                    time,
                    records[i].alert_message,
                    records[i].latitude,
                    records[i].longitude,
                ]);
            }
        }
        let cellHead;
        if (device.group_name !== 'Tablet Guardia') {
            cellHead = 'Dirección';
        } else {
            cellHead = 'Guardia';
        }
        doc.autoTable({
            head: [['#', cellHead, 'Fecha', 'Hora', 'Mensaje', 'Latitud', 'Longitud']],
            body: body,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 10},
                1: {cellWidth: 40},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 40},
                5: {cellWidth: 'auto'},
                6: {cellWidth: 'auto'},
            }
        });
        return doc;
    }

    downloadExcel(records: any[], device: any, excelService: any) {
        const body = [];
        if (records.length) {
            for (let i = 0; i < records.length; i++) {
                if (device.group_name !== 'Tablet Guardia') {
                    body.push({
                        'Secuencia': records[i].index,
                        'Dirección': records[i].address,
                        'Fecha': records[i].date,
                        'Hora': records[i].time,
                        'Nivel de batería': records[i].internal_battery_level,
                        'Mensaje': records[i].alert_message,
                        'imei': records[i].imei
                    });
                } else {
                    body.push({
                        'Secuencia': records[i].index,
                        'Guardia': records[i].guard_name.trim() + ' ' + records[i].guard_lastname.trim(),
                        'Fecha': records[i].generated_time.split(' ')[0],
                        'Hora': records[i].generated_time.split(' ')[1],
                        'Mensaje': records[i].alert_message,
                        'imei': records[i].imei
                    });
                }
            }
        }
        excelService.exportAsExcelFile(body, 'historial_' + device.imei);
    }
}