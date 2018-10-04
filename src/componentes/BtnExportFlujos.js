import React, { Component } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
class BtnExport extends Component{

    constructor(props){
        super(props);
        this.state = {
            tableData: props.tableData
        };
        this.printDocument = this.printDocument.bind(this);
    }

    printDocument() {

        function Format() {
            var doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [420 , 594]
            });
            return doc;
        }

        var pdf = function (columns, rows, titulo) {
            var docTabla= Format();
            /*var centeredText = function (text, y) {
                var textWidth = (docTabla.getStringUnitWidth(text) * docTabla.internal.getFontSize()) / docTabla.internal.scaleFactor;
                var textOffset = (docTabla.internal.pageSize.width - textWidth) / 2;
                docTabla.text(textOffset, y, text);
            }*/
            docTabla.setFontStyle("Calibri","bold");
            docTabla.setFontSize(12);
            docTabla.text(260,27,"CONSULTA DE FLUJO DE CAJA");
            docTabla.text(273,39,"Moneda : PEN Soles");

            docTabla.autoTable(columns, rows, {
                margin: { top: 45 }
            });

            docTabla.output('save', 'ReporteFlujos.pdf');//guardar pdf
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

        var columns = ["grupo","ngrupo","grupoa","ngrupoa","grupob","ngrupob","enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
        pdf(columns, rows, this.state.tableTitle);
    }

    render() {
        console.log(this.state.tableData);
        return (<div>
            <div className="mb5">
                <button className="btn btn-warning" onClick={this.printDocument}>PDF</button>
            </div>
        </div>);
    }
}

export default BtnExport;
