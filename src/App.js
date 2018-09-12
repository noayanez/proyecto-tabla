import React, { Component } from 'react';
import ComboEps from './componentes/comboEps.js';
import ComboLocal from './componentes/comboLocal.js';
import ComboPeriodo from './componentes/comboPeriodo.js';
import ComboMes from './componentes/comboMes.js';
import ComboTipo from './componentes/comboTipo.js';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import './App.css';

class App extends Component {

    constructor(){
        super();
        this.state = {
            hostname : "18.212.80.64:8443",
            isEpsLoaded : false,
            isLocalLoaded : false,
            isPeriodoLoaded : false,
            isTableLoaded : false,
            eps : "",
            epsNombre : "",
            local : "",
            periodo : "",
            mes : "",
            tipo : "",
            dataSaldo : [],
            alerta : "",
            fechaActual : "",
            fechaActualGuion : ""
        };
        this.handleChangeEps = this.handleChangeEps.bind(this);
        this.handleChangeEpsNombre = this.handleChangeEpsNombre.bind(this);
        this.handleChangeLocal = this.handleChangeLocal.bind(this);
        this.handleChangePeriodo = this.handleChangePeriodo.bind(this);
        this.handleChangeMes = this.handleChangeMes.bind(this);
        this.handleChangeTipo = this.handleChangeTipo.bind(this);
        this.handleChangeDataSaldo = this.handleChangeDataSaldo.bind(this);
        this.botonEnviar = this.botonEnviar.bind(this);
        this.formatNumber = this.formatNumber.bind(this);
        this.roundNumber = this.roundNumber.bind(this);
        this.limpiarAlerta = this.limpiarAlerta.bind(this);
    }

    limpiarAlerta(){
        this.setState({
            alerta : ""
        })
    }

    fetchDataSaldo(eps,local,periodo,mes){
        this.setState({
            isTableLoaded : false
        });
        const data = {
            id_eps : parseInt(eps,10),
            id_local : parseInt(local,10),
            periodo : periodo+mes
        }
        fetch("https://"+this.state.hostname+"/otass-rest/MainController/getSaldos", {
            method : 'POST',
            headers : {
                accept : '*/*',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        .then((response) =>{
            return response.json()
        })
        .then((result) => {
            console.log(result);
            if(result.length === 0){
                this.setState({
                    alerta : "No hay datos de la consulta."
                })
            }
            this.setState({
                dataSaldo : result
            })
        });
        this.setState({
            isTableLoaded : true
        });
    }

    botonEnviar(eps,local,periodo,mes){
        var f = new Date();
        if((f.getMonth() +1) < 10){
            if(f.getDate() < 10){
                this.setState({
                    fechaActual : "0" + f.getDate() + "/0" + (f.getMonth() +1) + "/" + f.getFullYear(),
                    fechaActualGuion : "0" + f.getDate() + "-0" + (f.getMonth() +1) + "-" + f.getFullYear()
                });
            }else{
                this.setState({
                    fechaActual : f.getDate() + "/0" + (f.getMonth() +1) + "/" + f.getFullYear(),
                    fechaActualGuion : f.getDate() + "-0" + (f.getMonth() +1) + "-" + f.getFullYear()
                });
            }
        }else{
            if(f.getDate() < 10){
                this.setState({
                    fechaActual : "0" + f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear(),
                    fechaActualGuion : "0" + f.getDate() + "-" + (f.getMonth() +1) + "-" + f.getFullYear()
                });
            }else{
                this.setState({
                    fechaActual : f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear(),
                    fechaActualGuion : f.getDate() + "-" + (f.getMonth() +1) + "-" + f.getFullYear()
                });
            }
        }
        if(this.state.eps !== "" && this.state.local !== "" && this.state.periodo !== "" && this.state.mes !== "" && this.state.tipo !== ""){
            if(this.state.tipo === "1"){
                this.fetchDataSaldo(this.state.eps,this.state.local,this.state.periodo,this.state.mes);
            }else{
                console.log("Aun no hay getFlujo");
            }
        }else{
            this.setState({
                alerta : "Faltan campos por seleccionar.",
                isTableLoaded : false
            });
        }
    }

    handleChangeEps(event){
        this.setState({
            isLocalLoaded : false,
            isPeriodoLoaded : false,
            eps : event.target.value,
            local : "",
            periodo : "",
            alerta : ""
        });
    }

    handleChangeLocal(event){
        this.setState({
            local : event.target.value,
            periodo : "",
            alerta : ""
        });
    }

    handleChangePeriodo(event){
        this.setState({
            periodo : event.target.value,
            alerta : ""
        });
    }

    handleChangeMes(event){
        this.setState({
            mes : event.target.value,
            alerta : ""
        });
    }

    handleChangeTipo(event){
        this.setState({
            tipo : event.target.value,
            alerta : ""
        });
    }

    handleChangeDataSaldo(data){
        this.setState({
            dataSaldo : data
        });
    }

    handleChangeEpsNombre(nombre){
        this.setState({
            epsNombre : nombre
        })
    }

    roundNumber(num, scale = 2) {
        if(!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale)  + "e-" + scale);
        } else {
            var arr = ("" + num).split("e");
            var sig = ""
            if(+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    }

    formatNumber(num,simbol=""){
        var separador= ",";
        var sepDecimal= '.';
        num = this.roundNumber(num,2);
        num +='';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? (
            splitStr[1].length === 1? (sepDecimal + splitStr[1] + "0") : (sepDecimal + splitStr[1])
        ) : ('');
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + separador + '$2');
        }
        if(splitRight===""){
            splitRight = ".00";
        }
        return simbol + splitLeft + splitRight;
    }

    render() {
        const listado = this.state.dataSaldo;
        var sumSaldoIncial = 0;
        var sumIngresos = 0;
        var sumEgresos = 0;
        var sumSaldoFinal = 0;
        if(listado.length !== 0 ){
            for(var i in listado){
                sumSaldoIncial = sumSaldoIncial + listado[i].saldo_anterior;
                sumIngresos = sumIngresos + listado[i].ingresos;
                sumEgresos = sumEgresos + listado[i].egresos;
                sumSaldoFinal = sumSaldoFinal + listado[i].saldo_final;
            }
            console.log(this.formatNumber(sumSaldoIncial));
            console.log(this.formatNumber(sumIngresos));
            console.log(this.formatNumber(sumEgresos));
            console.log(this.formatNumber(sumSaldoFinal));
        }

        return (
            <div className="App">
                <div className="card">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8 formulario">
                            <br/>
                            <div className="row celda-otass  centrado">
                                <div className="col-3"></div>
                                <div className="col-6">
                                    <a href="http://www.otass.gob.pe/">
                                        <img className="logo-otass" alt="Enlace página OTASS"src={require("./LOGO_VECTOR.png")}/>
                                    </a>
                                </div>
                                <div className="col-3">
                                    <div>
    	                               <a className="fa fa-facebook" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/Organismo-T%C3%A9cnico-de-la-Administraci%C3%B3n-de-los-Servicios-de-Saneamiento-1169264316420107/?pnref=lhc">{null}</a>
                                       <a className="fa fa-twitter" target="_blank" rel="noopener noreferrer" href="https://twitter.com/OtassPeru">{null}</a>
                                       <a className="fa fa-flickr" target="_blank" rel="noopener noreferrer" href="https://www.flickr.com/people/140076448@N02/">{null}</a>
                                       <a className="fa fa-linkedin" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/otassperu">{null}</a>
                                       <a className="fa fa-youtube" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/channel/UC7F8rA9vw-kTrSi3orChJRQ">{null}</a>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="row  centrado">
                                <div className="col-4">
                                    <ComboEps eps={this.state.eps}
                                    onChange={this.handleChangeEps} onChange2={this.handleChangeEpsNombre} hostname={this.state.hostname}/>
                                </div>
                                <div className="col-4">
                                    <ComboLocal eps={this.state.eps} local={this.state.local}
                                    onChange={this.handleChangeLocal} hostname={this.state.hostname}/>
                                </div>
                                <div className="col-4">
                                    <ComboPeriodo eps={this.state.eps} local={this.state.local} periodo={this.state.periodo}
                                    onChange={this.handleChangePeriodo} hostname={this.state.hostname}/>
                                </div>
                            </div>
                            <div className="row centrado">
                                <div className="col-4">
                                    <ComboMes mes={this.state.mes}
                                    onChange={this.handleChangeMes}/>
                                </div>
                                <div className="col-4">
                                    <ComboTipo eps={this.state.eps} local={this.state.local} periodo={this.state.periodo} tipo={this.state.tipo}
                                    onChange={this.handleChangeTipo} handleChangeDataSaldo={this.handleChangeDataSaldo}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3"></div>
                                <div className="col-6 centrado">
                                    <button className="btn-enviar" onClick={this.botonEnviar}>Consultar</button>
                                </div>
                                <div className="col-3 derecha">
                                    {(this.state.isTableLoaded===true && listado.length!==0)?(
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <ReactHTMLTableToExcel
                                                id="table-xls-button"
                                                className="btn btn-success"
                                                table="tabla-export"
                                                filename={"Consulta " + this.state.fechaActualGuion}
                                                sheet="Tabla 1"
                                                buttonText="Excel"/>
                                            <button className="btn btn-warning" disabled>PDF</button>
                                        </div>):(
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button className="btn btn-success" disabled>Excel</button>
                                            <button className="btn btn-warning" disabled>PDF</button>
                                        </div>)
                                    }
                                </div>
                            </div>
                            <br/>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
                {this.state.alerta!==""?
                    (<div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <div className="alert alert-primary alert-dismissible fade show" role="alert">
                                {this.state.alerta}
                                <button onClick={this.limpiarAlerta} type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-2"></div>
                    </div>):(null)
                }

                {(this.state.isTableLoaded && listado.length !==0)?
                    (<div className="contenido-tabla">
                        <div className="row centrado">
                            <div className="col-12">
                                <p><b>Moneda : PEN Soles</b></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-8">
                                <table className="table" id="tabla-principal">
                                    <thead className="thead-light">
                                        <tr>
                                            <th style={{"textAlign":"center"}}>Cuenta</th>
                                            <th style={{"textAlign":"left"}}>Descripcion de cuenta</th>
                                            <th style={{"textAlign":"right"}}>Saldo Inicial</th>
                                            <th style={{"textAlign":"right"}}>Ingresos</th>
                                            <th style={{"textAlign":"right"}}>Egresos</th>
                                            <th style={{"textAlign":"right"}}>Saldo Final</th>
                                        </tr>
                                    </thead>
                                    <tbody>{listado.map((dynamicData, i) =>
                                        <tr key={i}>
                                            <td>{dynamicData.cuenta}</td>
                                            <td align="left">{dynamicData.desc_cuenta}</td>
                                            <td align="right">{this.formatNumber(dynamicData.saldo_anterior)}</td>
                                            <td align="right">{this.formatNumber(dynamicData.ingresos)}</td>
                                            <td align="right">{this.formatNumber(dynamicData.egresos)}</td>
                                            <td align="right">{this.formatNumber(dynamicData.saldo_final)}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-2"></div>
                        </div>
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-8">
                                <table id="tabla-export" style={{"visibility":"hidden"}}>
                                    <tbody>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td style={{"fontFamily": "Courier New","fontSize": "12px"}} colSpan="3"><b>{this.state.epsNombre}</b></td>
                                            <td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <th style={{"fontFamily": "Arial","fontSize": "16px"}} colSpan="7"><b>SALDOS - CAJA BANCOS AL {this.state.fechaActual}</b></th>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td>
                                            <td style={{"fontFamily": "Courier New","fontSize": "14px"}} colSpan="2"><b>M O V I M I E N T O S </b></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <th></th><th></th><th></th>
                                            <th style={{"fontFamily": "Courier New","fontSize": "13px"}}><b>SALDO INICIAL</b></th>
                                            <th style={{"fontFamily": "Courier New","fontSize": "13px"}}><b>INGRESO</b></th>
                                            <th style={{"fontFamily": "Courier New","fontSize": "13px"}}><b>EGRESO</b></th>
                                            <th style={{"fontFamily": "Courier New","fontSize": "13px"}}><b>SALDO FINAL</b></th>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        {listado.map((dynamicData, i) =>
                                            <tr key={i}>
                                                <td style={{"fontFamily": "Courier New","fontSize": "12px"}}>{dynamicData.cuenta}</td>
                                                <td colSpan="2" align="left" style={{"fontFamily": "Courier New","fontSize": "12px"}}>{dynamicData.desc_cuenta}</td>
                                                <td align="right" style={{"fontFamily": "Courier New","fontSize": "12px"}}>{this.formatNumber(dynamicData.saldo_anterior)}</td>
                                                <td align="right" style={{"fontFamily": "Courier New","fontSize": "12px"}}>{this.formatNumber(dynamicData.ingresos)}</td>
                                                <td align="right" style={{"fontFamily": "Courier New","fontSize": "12px"}}>{this.formatNumber(dynamicData.egresos)}</td>
                                                <td align="right" style={{"fontFamily": "Courier New","fontSize": "12px"}}>{this.formatNumber(dynamicData.saldo_final)}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td></td><td></td>
                                            <td style={{"fontFamily": "Courier New","fontSize": "12px"}}><b>TOTAL GENERAL:</b></td>
                                            <td style={{"fontFamily": "Courier New","fontSize": "12px"}}><b>{this.formatNumber(sumSaldoIncial)}</b></td>
                                            <td style={{"fontFamily": "Courier New","fontSize": "12px"}}><b>{this.formatNumber(sumIngresos)}</b></td>
                                            <td style={{"fontFamily": "Courier New","fontSize": "12px"}}><b>{this.formatNumber(sumEgresos)}</b></td>
                                            <td style={{"fontFamily": "Courier New","fontSize": "12px"}}><b>{this.formatNumber(sumSaldoFinal)}</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-2"></div>
                        </div>
                    </div>
                    ):(null)}
            </div>
        );
    }
}

export default App;
