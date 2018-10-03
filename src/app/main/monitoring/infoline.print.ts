import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

export class InfolinePrint {

    getCurrentTime() {
        const d = new Date();
        const printTime = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
            + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return printTime;
    }

    createOnlinePDF(devices: any[], show: number, excelService: any) {
        if (show === 0) {
            this.downloadExcel(devices, excelService);
            return;
        }
        const doc = this.getHistoryDoc(devices);
        if (show === 1) {
            doc.save('onlineinfo.pdf');
        }
        if (show === 2) {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    getHistoryDoc(devices: any[]): jsPDF {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('ICSSE Seguridad', 15, 20);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Informacion de dispositivos en linea', 15, 27);
        doc.text('Hora de impresión: ' + this.getCurrentTime(), 15, 34);
        const body = [];
        if (devices.length) {
            for (let i = 0; i < devices.length; i++) {
                let status = '';
                if (devices[i].group_name === 'Tablet Guardia') {
                    status = devices[i].message === 'FINISHED_WATCH' ? 'Desconectado' : 'En Linea';
                } else {
                    status = devices[i].device_status === 'ONLINE' ? 'En Linea' : 'Desconectado';
                }
                body.push([
                    devices[i].imei,
                    devices[i].generated_time,
                    devices[i].message_time,
                    Number(devices[i].latitude).toFixed(5),
                    Number(devices[i].longitude).toFixed(5),
                    devices[i].group_name,
                    status
                ]);
            }
        }
        doc.autoTable({
            head: [['Imei', 'Última transmisión', 'Última posición válida', 'Latitud', 'Longitud', 'Grupo', 'Estado']],
            body: body,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 'auto'},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'},
                5: {cellWidth: 'auto'},
                6: {cellWidth: 'auto'},
            }
        });
        return doc;
    }

    downloadExcel(devices: any[], excelService: any) {
        const body = [];
        if (devices.length) {
            for (let i = 0; i < devices.length; i++) {
                if (devices[i].group_name === 'Tablet Guardia') {
                    body.push({
                        'Secuencia': i + 1,
                        'Tipo Dispositivo': 'Tablet',
                        'Grupo':  devices[i].group_name,
                        'Alias': devices[i].alias,
                        'Imei': devices[i].imei,
                        'Latitud': devices[i].latitude,
                        'Longitud': devices[i].longitude,
                        'Hora de última transmisión': devices[i].generated_time,
                        'Hora de última posición válida': devices[i].message_time,
                        'Estado de transmisión': devices[i].message === 'FINISHED_WATCH' ? 'Desconectado' : 'En Linea',
                        'Guardia': devices[i].guard_name.trim() + ' ' + devices[i].guard_lastname.trim(),
                    });
                } else {
                    body.push({
                        'Secuencia': i + 1,
                        'Tipo Dispositivo':  devices[i].device_type_name,
                        'Grupo':  devices[i].group_name,
                        'Modelo Equipo':  devices[i].model_name,
                        'Placa': devices[i].automotor_plate,
                        'Alias': devices[i].alias,
                        'Imei': devices[i].imei,
                        'Latitud': devices[i].latitude,
                        'Longitud': devices[i].longitude,
                        'Hora de última transmisión': devices[i].generated_time,
                        'Hora de última posición válida': devices[i].message_time,
                        'Estado de transmisión': devices[i].device_status === 'ONLINE' ? 'En Linea' : 'Desconectado',
                        'Estado de ignición': devices[i].ignition_state == 2 ? 'Apagado' : 'Encendido',
                        'Estado de movimiento': devices[i].movement_state == 0 ? 'Detenido' : 'En Movimiento',
                        '% Batería': devices[i].battery_level,
                        'Odómetro (Km)': devices[i].odometer
                    });
                }
            }
        }
        excelService.exportAsExcelFile(body, 'infoline');
    }
}