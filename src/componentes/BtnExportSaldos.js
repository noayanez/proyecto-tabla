import React, { Component } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";

class BtnExport extends Component{

    constructor(props){
        super(props);
        this.state = {
            tableData: props.tableData,
            epsNombre: props.epsNombre,
            fechaActual: props.fechaActual
        };
        this.printDocument = this.printDocument.bind(this);
    }

    printDocument() {

        var epsNombre = this.state.epsNombre;
        var fechaActual = this.state.fechaActual;

        function Format() {
            var doc = new jsPDF({
                orientation: 'landscape'
            });
            return doc;
        }

        var pdf = function (columns, rows) {
            var docTabla= Format();
            /*var centeredText = function (text, y) {
                var textWidth = docTabla.getStringUnitWidth(text) * docTabla.internal.getFontSize() / docTabla.internal.scaleFactor;
                var textOffset = (docTabla.internal.pageSize.width - textWidth) / 2;
                docTabla.text(textOffset, y, text);
            }*/
            docTabla.setFontStyle("Calibri");
            docTabla.setFontSize(12);
            docTabla.text(13,15,epsNombre);
            docTabla.text(125,27,"SALDOS - CAJA BANCOS");
            docTabla.text(105,39,"Moneda : PEN Soles | Fecha de Registro: "+fechaActual);

            docTabla.autoTable(columns, rows, {
                margin: { top: 45 }
            });

            docTabla.output('save', 'ReporteSaldos.pdf');//guardar pdf
        }

        var data = this.state.tableData;
        var rows = [];
        var aux = [];
        var k = 0;
        for(var i in data){
            aux = [];
            k = 0;
            for(var j in data[i]){
                aux[k] = data[i][j];
                k++;
            }
            rows[i] = aux;
        }

        var columns = ["Cuenta", "Descripcion de cuenta", "Saldo Inicial", "Ingresos", "Egresos", "Saldo Final"];
        pdf(columns, rows);
    }

    render() {
        console.log("LLEGO!!");
        console.log(this.state.tableData);
        return (<div>
            <div className="mb5">
                <button className="btn btn-warning" onClick={this.printDocument}>PDF</button>
            </div>
        </div>);
    }
}

export default BtnExport;
