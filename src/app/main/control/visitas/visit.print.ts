import * as jsPDF from 'jspdf';

interface Margin {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}
export class VisitPrint {

    readonly leftL = 15;
    readonly leftR = 100;
    readonly leftRShort = 85;
    readonly top = 7;
    readonly separator1 = 20;
    readonly separator2 = 28;
    readonly separator3 = 23;
    readonly photoHeight = 35;
    readonly minTop = 5;
    readonly line: Margin = { left: 10, right: 200 };

    getPaddingTop(padding: Margin, extra: number) {
        padding.top = padding.top + extra;
        return padding.top;
    }

    getCurrentTime() {
        const d = new Date();
        const printTime = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
            + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return printTime;
    }

    /******************************************************************************************************************
     * Details PDF, for printList data showing in visit page, @show, 1: for save pdf, 2: for show printList.
     */
    async createVisitDetailsPDF(visit: any, show: number) {
        const doc = new jsPDF();
        const padding: Margin = {top : 20};

        await this.getPdfHeader(visit, doc, padding);
        await this.getPdfExit(visit, doc, padding);
        await this.getPdfEnter(visit, doc, padding);
        await this.getPdfMaterialPhotos(visit, doc, padding);
        await this.getPdfVehicleDetails(visit, doc, padding);
        await this.getPdfVisitorDetails(visit, doc, padding);
        await this.getPdfClerkDetails(visit, doc, padding);

        if (show === 1) {
            doc.save('visita_' + visit.id + '.pdf');
        }
        if (show === 2) {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    async getPdfHeader(visit: any, doc: jsPDF, padding: Margin) {
        doc.setFontSize(20);
        doc.text('ICSSE Seguridad', this.leftL, padding.top);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Visita: #' + visit.id, this.leftL, this.getPaddingTop(padding, this.top));
        doc.text('Hora de impresión: ' + this.getCurrentTime(), this.leftL, this.getPaddingTop(padding, this.top));
        if (visit.stand_name !== null) {
            doc.text('Puesto: ' + visit.stand_name, this.leftL, this.getPaddingTop(padding, this.top));
        }
        this.getPaddingTop(padding, this.top);
    }

    async getPdfExit(visit: any, doc: jsPDF, padding: Margin) {
        if (visit.finish_date !== '0000-00-00 00:00:00' && visit.finish_date !== null) {
            doc.setTextColor(0);
            doc.setFontType('bold');
            doc.text('Salida ', this.leftL, this.getPaddingTop(padding, this.top));
            doc.text('Hora: ', this.leftL, this.getPaddingTop(padding, this.top));
            doc.setFontType('normal');
            doc.text(visit.finish_date, this.leftL + this.separator1, padding.top);
            doc.setFontType('bold');
            if (visit.guard_out) {
                doc.text('Registrado: ', this.leftR, padding.top);
                doc.setFontType('normal');
                doc.text(visit.guard_out.name.trim() + ' ' + visit.guard_out.lastname.trim(),
                    this.leftR + this.separator2, padding.top);

                doc.setFontType('bold');
                doc.text('Latitud: ', this.leftL, this.getPaddingTop(padding, this.top));
                doc.setFontType('normal');
                doc.text(visit.f_latitude.toString(), this.leftL + this.separator1, padding.top);
                doc.setFontType('bold');
                doc.text('Longitud: ', this.leftR, padding.top);
                doc.setFontType('normal');
                doc.text(visit.f_longitude.toString(), this.leftR + this.separator2, padding.top);
            }

            if (visit.comment) {
                doc.setFontType('bold');
                doc.text('Observación: ', this.leftL, this.getPaddingTop(padding, this.top));
                doc.setFontType('normal');
                doc.text(visit.comment, this.leftL + this.separator2, padding.top);
            }

            this.getPaddingTop(padding, this.top);
            doc.line(this.line.left, padding.top, this.line.right, padding.top);
        }
    }

    async getPdfEnter(visit: any, doc: jsPDF, padding: Margin) {
        doc.setTextColor(0);
        doc.setFontType('bold');
        doc.text('Entrada ', this.leftL, this.getPaddingTop(padding, this.top));
        doc.text('Hora: ', this.leftL, this.getPaddingTop(padding, this.top));
        doc.setFontType('normal');
        doc.text(visit.create_date, this.leftL + this.separator1, padding.top);
        doc.setFontType('bold');
        doc.text('Registrado: ', this.leftR, padding.top);
        doc.setFontType('normal');
        doc.text(visit.guard.name.trim() + ' ' + visit.guard.lastname.trim(),
            this.leftR + this.separator2, padding.top);

        doc.setFontType('bold');
        doc.text('Latitud: ', this.leftL, this.getPaddingTop(padding, this.top));
        doc.setFontType('normal');
        doc.text(visit.latitude.toString(), this.leftL + this.separator1, padding.top);
        doc.setFontType('bold');
        doc.text('Longitud: ', this.leftR, padding.top);
        doc.setFontType('normal');
        doc.text(visit.longitude.toString(), this.leftR + this.separator2, padding.top);

        if (visit.observation.length !== 0) {
            doc.setFontType('bold');
            doc.text('Materiales: ', this.leftL, this.getPaddingTop(padding, this.top));
            doc.setFontType('normal');
            let matel = '';
            for (let i = 0; i < visit.observation.length; i++) {
                if (visit.observation.length - 1 === i) {
                    matel = matel + visit.observation[i] + '.';
                } else {
                    matel = matel + visit.observation[i] + ', ';
                }
            }
            const splitTitle = doc.splitTextToSize(matel, 120);
            doc.text(splitTitle, this.leftL + this.separator2, padding.top);
        } else {
            if (visit.image_1) {
                doc.text('Materiales: ', this.leftL, this.getPaddingTop(padding, this.top));
            } else {
                doc.text('Sin materiales', this.leftL, this.getPaddingTop(padding, this.top));
            }
        }
        doc.setFontType('bold');
    }

    async getPdfMaterialPhotos(visit: any, doc: jsPDF, padding: Margin) {
        const margin: Margin = {left: this.leftL};
        this.getPaddingTop(padding, this.top);
        await this.getMaterialPhoto(visit.image_1, margin, doc, padding);
        await this.getMaterialPhoto(visit.image_2, margin, doc, padding);
        await this.getMaterialPhoto(visit.image_3, margin, doc, padding);
        await this.getMaterialPhoto(visit.image_4, margin, doc, padding);
        await this.getMaterialPhoto(visit.image_5, margin, doc, padding);

        padding.top = visit.image_1 ? this.getPaddingTop(padding, this.photoHeight) : padding.top;
        doc.line(this.line.left, padding.top, this.line.right, padding.top);
    }

    async getMaterialPhoto(url: string, margin: Margin, doc: jsPDF, padding: Margin) {
        const paddingTop = padding.top - 3;
        const height = this.photoHeight;
        if (url) {
            let photo = null;
            await this.toDataURL(url).then(dataUrl => {
                photo = dataUrl;
            });
            const img1 = new Image();
            const promise = new Promise(function (resolve, reject) {
                img1.onload = () => {
                    const width = img1.width / (img1.height / height);
                    doc.addImage(photo, 'JPEG', margin.left, paddingTop, width, height);
                    resolve(photo);
                    margin.left =  margin.left + width + 2;
                };
            });
            img1.src = String(photo);
            await promise.then();
        }
    }

    async getPdfVehicleDetails(visit: any, doc: jsPDF, padding: Margin) {
        if (visit.vehicle) {
            let extraLeft = 0;
            const marginLeft = this.leftL;
            if (visit.vehicle.photo) {
                let photo = null;
                await this.toDataURL(visit.vehicle.photo).then((dataUrl: Blob) => {
                    photo = dataUrl;
                });
                const img1 = new Image();
                const promise = new Promise(function (resolve, reject) {
                    img1.onload = () => {
                        const height = 35;
                        const width = img1.width / (img1.height / height);
                        doc.addImage(photo, 'JPEG', marginLeft, padding.top + 3, width, height);
                        extraLeft = width + 8;
                        resolve(photo);
                    };
                });
                img1.src = String(photo);
                await promise.then();
            }

            doc.setFontType('bold');
            doc.text('Vehículo ', this.leftL + extraLeft, this.getPaddingTop(padding, this.top) + this.minTop);
            if (visit.vehicle.photo) { this.getPaddingTop(padding, this.top); }

            doc.setFontType('bold');
            doc.text('Vehiculo: ', this.leftL + extraLeft, this.getPaddingTop(padding, this.top) + this.minTop);
            doc.setFontType('normal');
            doc.text(visit.vehicle.vehicle, this.leftL + this.separator3 + extraLeft, padding.top + this.minTop);
            doc.setFontType('bold');
            doc.text('Placa: ', this.leftRShort + extraLeft, padding.top + this.minTop);
            doc.setFontType('normal');
            doc.text(visit.vehicle.plate, this.leftRShort + this.separator1 + extraLeft, padding.top + this.minTop);

            doc.setFontType('bold');
            doc.text('Marca: ', this.leftL + extraLeft, this.getPaddingTop(padding, this.top) + this.minTop);
            doc.setFontType('normal');
            doc.text(visit.vehicle.model, this.leftL + this.separator3 + extraLeft, padding.top + this.minTop);
            doc.setFontType('bold');
            doc.text('Color: ', this.leftRShort + extraLeft, padding.top + this.minTop);
            doc.setFontType('normal');
            doc.text(visit.vehicle.type, this.leftRShort + this.separator1 + extraLeft, padding.top + this.minTop);

            this.getPaddingTop(padding, this.top);
            if (visit.vehicle.photo) { this.getPaddingTop(padding, this.top); }
            doc.line(this.line.left, padding.top, this.line.right, padding.top);
        }
    }

    async getPdfVisitorDetails(visit: any, doc: jsPDF, padding: Margin) {
        let extraLeft = 0;
        const marginLeft = this.leftL;
        if (visit.visitor.photo) {
            let photo = null;
            await this.toDataURL(visit.visitor.photo).then((dataUrl: Blob) => {
                photo = dataUrl;
            });
            const img1 = new Image();
            const promise = new Promise(function (resolve, reject) {
                img1.onload = () => {
                    const height = 35;
                    const width = img1.width / (img1.height / height);
                    doc.addImage(photo, 'JPEG', marginLeft, padding.top + 3, width, height);
                    extraLeft = width + 8;
                    resolve(photo);
                };
            });
            img1.src = String(photo);
            await promise.then();
        }

        doc.setFontType('bold');
        doc.text('Visitante', this.leftL + extraLeft, this.getPaddingTop(padding, this.top) + this.minTop);
        if (visit.visitor.photo) { this.getPaddingTop(padding, this.top); }

        doc.text('Nombre: ', this.leftL + extraLeft, this.getPaddingTop(padding, this.top) + this.minTop);
        doc.setFontType('normal');
        doc.text(visit.visitor.name, this.leftL + this.separator3 + extraLeft, padding.top + this.minTop);
        doc.setFontType('bold');
        doc.text('Apellido: ', this.leftRShort + extraLeft, padding.top + this.minTop);
        doc.setFontType('normal');
        doc.text(visit.visitor.lastname, this.leftRShort + this.separator1 + extraLeft, padding.top + this.minTop);

        doc.setFontType('bold');
        doc.text('Compañia: ', this.leftL + extraLeft, this.getPaddingTop(padding, this.top) + this.minTop);
        doc.setFontType('normal');
        doc.text(visit.visitor.company, this.leftL + this.separator3 + extraLeft, padding.top + this.minTop);
        doc.setFontType('bold');
        doc.text('Cédula: ', this.leftRShort + extraLeft, padding.top + this.minTop);
        doc.setFontType('normal');
        doc.text(visit.visitor.dni, this.leftRShort + this.separator1 + extraLeft, padding.top + this.minTop);

        this.getPaddingTop(padding, this.top);
        if (visit.visitor.photo) { this.getPaddingTop(padding, this.top); }
        doc.line(this.line.left, padding.top, this.line.right, padding.top);
    }

    async getPdfClerkDetails(visit: any, doc: jsPDF, padding: Margin) {
        doc.setFontType('bold');
        doc.text('Funcionario Visitado', this.leftL, this.getPaddingTop(padding, this.top));
        this.getPaddingTop(padding, this.top)

        doc.text('Nombre: ', this.leftL, this.getPaddingTop(padding, this.top));
        doc.setFontType('normal');
        doc.text(visit.visited.name, this.leftL + this.separator3, padding.top);
        doc.setFontType('bold');
        doc.text('Apellido: ', this.leftR, padding.top);
        doc.setFontType('normal');
        doc.text(visit.visited.lastname, this.leftR + this.separator1, padding.top);

        doc.setFontType('bold');
        doc.text('Dirección: ', this.leftL, this.getPaddingTop(padding, this.top));
        doc.setFontType('normal');
        doc.text(visit.visited.address, this.leftL + this.separator3, padding.top);
        doc.setFontType('bold');
        doc.text('Cédula: ', this.leftR, padding.top);
        doc.setFontType('normal');
        doc.text(visit.visited.dni, this.leftR + this.separator1, padding.top);
    }

    toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }))

    downloadVisitDetailsExcel(visit: any, excelService: any) {
        let excel = [];
        excel = [
            {'Entrada': visit.create_date, 'Latitud': visit.latitude, 'Longitude': visit.longitude, '': ''},
            {'Entrada': 'Materiales'},
            {'Entrada': visit.observation[0]}
        ];
        if (visit.vehicle) {
            excel.push({'Entrada': 'Vehiculo'});
            excel.push({'Entrada': 'Tipo', 'Latitud': 'Placa', 'Longitude': 'Modelo', '': 'Color'});
            excel.push({'Entrada': visit.vehicle.vehicle, 'Latitud': visit.vehicle.plate, 'Longitude': visit.vehicle.model, '': visit.vehicle.type});
        }
        excel.push({'Entrada': 'Funcionario'});
        excel.push({'Entrada': 'Nombre', 'Latitud': 'Apellido', 'Longitude': 'Dirección', '': 'Cédula'});
        excel.push({'Entrada': visit.visited.name, 'Latitud': visit.visited.lastname, 'Longitude': visit.visited.address, '': visit.visited.dni});
        excel.push({'Entrada': 'Visitante'});
        excel.push({'Entrada': 'Nombre', 'Latitud': 'Apellido', 'Longitude': 'Correo', '': 'Cédula'});
        excel.push({'Entrada': visit.visitor.name, 'Latitud': visit.visitor.lastname, 'Longitude': visit.visitor.email, '': visit.visitor.dni});
        excel.push({'Entrada': 'Registrado por'});
        excel.push({'Entrada': 'Nombre', 'Latitud': 'Apellido', 'Longitude': 'Correo', '': 'Cédula'});
        excel.push({'Entrada': visit.guard.name, 'Latitud': visit.guard.lastname, 'Longitude': visit.guard.email, '': visit.guard.dni});
        excelService.exportAsExcelFile(excel, 'admindetail');
    }
    /******************************************************************************************************************
     * List PDF, for printList data showing in table, @show, 1: for save pdf, 2: for show printList.
     */
    async createVisitListPDF(visits: any[], show: number) {
        const doc = this.getListPdf(visits, 1);

        if (show === 1) {
            doc.save('visitas.pdf');
        }
        if (show === 2) {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    getListPdf(visits: any[], type: number): jsPDF {
        const doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        doc.text('Visitas', 15, 27)
        doc.text('Hora de impresión: ' + this.getCurrentTime(), 15, 34)
        doc.autoTable({
            head: [['Puesto', 'Placa', 'Cédula', 'Visitante', 'Entrada', 'Salida']],
            body: this.getPrintListBody(visits, type),
            startY: 41,
            columnStyles: {
                0: {cellWidth: 28},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 28},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'},
                5: {cellWidth: 'auto'},
            }
        });
        return doc;
    }

    getPrintListBody(visits: any[], type: number) { // 1: pdf, 2: excel
        const body = [];
        const excel = [];
        visits.forEach((visit: any) => {
            body.push([
                visit.stand_name,
                (visit.plate ? visit.plate : '-'),
                visit.visitor_dni,
                visit.visitor_name + ' ' + visit.visitor_lastname,
                visit.create_date,
                (visit.finish_date === '0000-00-00 00:00:00' || visit.finish_date === null ? '-' : visit.finish_date)
            ]);
            excel.push({
                'Puesto' : visit.stand_name,
                'Placa': (visit.plate ? visit.plate : '-'),
                'Cédula': visit.visitor_dni,
                'Visitante': visit.visitor_name + ' ' + visit.visitor_lastname,
                'Entrada': visit.create_date,
                'Salida': (visit.finish_date === '0000-00-00 00:00:00' || visit.finish_date === null ? '-' : visit.finish_date)
            });
        });
        if (type === 1) {
            return body;
        }
        if (type === 2) {
            return excel;
        }
    }

    downloadVisitListExcel(visits: any[], excelService: any) {
        excelService.exportAsExcelFile(this.getPrintListBody(visits, 2), 'visitas');
    }
}