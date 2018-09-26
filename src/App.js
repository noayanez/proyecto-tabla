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
            hostname : "http://181.177.234.57:81",
            eps : "",
            filtrar : "3",
            epsNombre : "",
            local : "",
            periodo : "",
            mes : "",
            tipo : "",
            tipoReal : "",
            dataSaldo: [],
            alerta : "",
            fechaActual : "",
            fechaActualGuion : "",
            isEpsLoaded : false,
            isLocalLoaded : false,
            isPeriodoLoaded : false,
            isTableLoaded : false
        };
        this.handleChangeEps = this.handleChangeEps.bind(this);
        this.vaciarTodo = this.vaciarTodo.bind(this);
        this.vaciarPeriodo = this.vaciarPeriodo.bind(this);
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
        this.handleChangeFiltrar = this.handleChangeFiltrar.bind(this);
    }

    handleChangeFiltrar(){
        if(this.state.filtrar === "1"){
            this.setState({
                filtrar : "2"
            });
		}else{
            if(this.state.filtrar === "2"){
                this.setState({
                    filtrar : "3"
                });
    		}else{
                this.setState({
                    filtrar : "1"
                });
            }
        }
    }

    limpiarAlerta(){
        this.setState({
            alerta : ""
        })
    }

    fetchData(eps,local,periodo,mes){
        var tipoString = "";
        if (this.state.tipo === "1") {
            tipoString = "saldos/getSaldos";
        } else {
            if (this.state.tipo === "2") {
                tipoString = "flujos/getFlujos";
            } else {
                tipoString = "variables/getVariables";
            }
        }
        this.setState({
            isTableLoaded : false
        });
        const data = {
            id_eps : parseInt(eps,10),
            id_local : parseInt(local,10),
            periodo : periodo+mes
        }
        fetch(this.state.hostname+"/otass-rest/MainController/"+tipoString, {
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
            tipoReal : this.state.tipo
        });
        this.setState({
            isTableLoaded : true
        });
    }

    botonEnviar(eps,local,periodo,mes){
        this.setState({
            tipoReal : "",
            dataSaldo : []
        });
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
            this.fetchData(this.state.eps,this.state.local,this.state.periodo,this.state.mes);
        }else{
            this.setState({
                alerta : "Faltan campos por seleccionar.",
                isTableLoaded : false
            });
        }
    }

    vaciarTodo(){
        this.setState({
            eps : "",
            epsNombre : "",
            local : "",
            periodo : "",
            mes : ""
        });
    }

    vaciarPeriodo(){
        this.setState({
            periodo : "",
            mes : ""
        });
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
        if(listado.length !== 0 && this.state.tipo === "1"){
            for(var i in listado){
                sumSaldoIncial = sumSaldoIncial + listado[i].saldo_anterior;
                sumIngresos = sumIngresos + listado[i].ingresos;
                sumEgresos = sumEgresos + listado[i].egresos;
                sumSaldoFinal = sumSaldoFinal + listado[i].saldo_final;
            }
        }

        return (
            <div className="App">
                <div className="container-fluid">
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
                                <div className="col-8">
                                    <div className="row">
                                        <div className="col-10">
                                            <ComboEps eps={this.state.eps}
                                            onChange={this.handleChangeEps} onChange2={this.handleChangeEpsNombre} vaciarTodo={this.vaciarTodo} hostname={this.state.hostname} filtrar={this.state.filtrar}/>
                                        </div>
                                        <div className="col-2">
                                            {this.state.filtrar==="3" ?
                                                (<button className="botonCheck-neutro" onClick={this.handleChangeFiltrar}><b>Todas</b></button>):(
                                                    this.state.filtrar==="1"?
                                                        (<button className="botonCheck-activo" onClick={this.handleChangeFiltrar}><b>✔ Si</b></button>):(<button className="botonCheck" onClick={this.handleChangeFiltrar}><b>✖ No</b></button>)
                                                    )
                                            }
                                        </div>
                                    </div>

                                </div>
                                <div className="col-4">
                                    <ComboLocal eps={this.state.eps} local={this.state.local}
                                    onChange={this.handleChangeLocal} hostname={this.state.hostname}/>
                                </div>
                            </div>
                            <div className="row centrado">
                                <div className="col-4">
                                    <ComboTipo eps={this.state.eps} local={this.state.local} periodo={this.state.periodo} tipo={this.state.tipo}
                                        onChange={this.handleChangeTipo} handleChangeDataSaldo={this.handleChangeDataSaldo} />
                                </div>
                                <div className="col-4">
                                    <ComboPeriodo eps={this.state.eps} local={this.state.local} periodo={this.state.periodo} tipo={this.state.tipo}
                                    onChange={this.handleChangePeriodo} vaciarPeriodo={this.vaciarPeriodo} hostname={this.state.hostname}/>
                                </div>
                                <div className="col-4">
                                    <ComboMes mes={this.state.mes}
                                    onChange={this.handleChangeMes}/>
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

                {(this.state.isTableLoaded && listado.length !==0 && this.state.tipoReal === "1")?
                    (<div className="contenido-tabla">
                        <div className="row centrado">
                            <div className="col-12">
                                <p><b>Moneda : PEN Soles | Fecha de Registro: {listado[0].fecha_registro}</b></p>
                            </div>
                        </div>
                        <div className="row centrado">
                            <div className="col-12">
                                <p><b></b></p>
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
                                <div style={{"height":"50px","overflow":"scroll","visibility":"hidden"}}>
                                    <table id="tabla-export" style={{"width":"100%"}}>
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
                            </div>
                            <div className="col-2"></div>
                        </div>
                    </div>
                    ):(null)
                }

                {(this.state.isTableLoaded && listado.length !==0 && this.state.tipoReal === "2")?
                    (<div className="contenido-tabla">
                        <div className="row centrado">
                            <div className="col-12">
                                <p><b>Moneda : PEN Soles</b></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-8" style={{"width":"100%","overflow": "scroll"}}>
                                <table className="table" id="tabla-principal">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>grupo</th>
                                            <th>ngrupo</th>
                                            <th>grupoa</th>
                                            <th>ngrupoa</th>
                                            <th>grupob</th>
                                            <th>ngrupob</th>
                                            <th><b>ENERO</b></th>
                                            <th><b>FEBRERO</b></th>
                                            <th><b>MARZO</b></th>
                                            <th><b>ABRIL</b></th>
                                            <th><b>MAYO</b></th>
                                            <th><b>JUNIO</b></th>
                                            <th><b>JULIO</b></th>
                                            <th><b>AGOSTO</b></th>
                                            <th><b>SEPTIEMBRE</b></th>
                                            <th><b>OCTUBRE</b></th>
                                            <th><b>NOVIEMBRE</b></th>
                                            <th><b>DICIEMBRE</b></th>
                                        </tr>
                                    </thead>
                                    <tbody>{listado.map((dynamicData, i) =>
                                        <tr key={i}>
                                            <td>{dynamicData.grupo}</td>
                                            <td>{dynamicData.ngrupo}</td>
                                            <td>{dynamicData.grupoa}</td>
                                            <td>{dynamicData.ngrupoa}</td>
                                            <td>{dynamicData.grupob}</td>
                                            <td>{dynamicData.ngrupob}</td>
                                            <td>{this.formatNumber(dynamicData.enero)}</td>
                                            <td>{this.formatNumber(dynamicData.febrero)}</td>
                                            <td>{this.formatNumber(dynamicData.marzo)}</td>
                                            <td>{this.formatNumber(dynamicData.abril)}</td>
                                            <td>{this.formatNumber(dynamicData.mayo)}</td>
                                            <td>{this.formatNumber(dynamicData.junio)}</td>
                                            <td>{this.formatNumber(dynamicData.julio)}</td>
                                            <td>{this.formatNumber(dynamicData.agosto)}</td>
                                            <td>{this.formatNumber(dynamicData.septiembre)}</td>
                                            <td>{this.formatNumber(dynamicData.octubre)}</td>
                                            <td>{this.formatNumber(dynamicData.noviembre)}</td>
                                            <td>{this.formatNumber(dynamicData.diciembre)}</td>
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
                                <div style={{"height":"50px","overflow":"scroll","visibility":"hidden"}}>
                                    <table id="tabla-export" style={{"width":"100%"}}>
                                        <tbody>
                                            <tr>
                                                <th>grupo</th>
                                                <th>ngrupo</th>
                                                <th>grupoa</th>
                                                <th>ngrupoa</th>
                                                <th>grupob</th>
                                                <th>ngrupob</th>
                                                <th><b>ENERO</b></th>
                                                <th><b>FEBRERO</b></th>
                                                <th><b>MARZO</b></th>
                                                <th><b>ABRIL</b></th>
                                                <th><b>MAYO</b></th>
                                                <th><b>JUNIO</b></th>
                                                <th><b>JULIO</b></th>
                                                <th><b>AGOSTO</b></th>
                                                <th><b>SEPTIEMBRE</b></th>
                                                <th><b>OCTUBRE</b></th>
                                                <th><b>NOVIEMBRE</b></th>
                                                <th><b>DICIEMBRE</b></th>
                                            </tr>
                                            {listado.map((dynamicData, i) =>
                                                <tr key={i}>
                                                    <td>{dynamicData.grupo}</td>
                                                    <td>{dynamicData.ngrupo}</td>
                                                    <td>{dynamicData.grupoa}</td>
                                                    <td>{dynamicData.ngrupoa}</td>
                                                    <td>{dynamicData.grupob}</td>
                                                    <td>{dynamicData.ngrupob}</td>
                                                    <td>{this.formatNumber(dynamicData.enero)}</td>
                                                    <td>{this.formatNumber(dynamicData.febrero)}</td>
                                                    <td>{this.formatNumber(dynamicData.marzo)}</td>
                                                    <td>{this.formatNumber(dynamicData.abril)}</td>
                                                    <td>{this.formatNumber(dynamicData.mayo)}</td>
                                                    <td>{this.formatNumber(dynamicData.junio)}</td>
                                                    <td>{this.formatNumber(dynamicData.julio)}</td>
                                                    <td>{this.formatNumber(dynamicData.agosto)}</td>
                                                    <td>{this.formatNumber(dynamicData.septiembre)}</td>
                                                    <td>{this.formatNumber(dynamicData.octubre)}</td>
                                                    <td>{this.formatNumber(dynamicData.noviembre)}</td>
                                                    <td>{this.formatNumber(dynamicData.diciembre)}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-2"></div>
                        </div>
                    </div>
                ):(null)}

                {(this.state.isTableLoaded && listado.length !==0 && this.state.tipoReal === "3")?
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
                                            <th>Fecha de registro</th>
                                            <th>Codigo</th>
                                            <th>Detalle</th>
                                            <th style={{"textAlign":"right"}}>Valor</th>
                                            <th style={{"textAlign":"center"}}>Unidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>{listado.map((dynamicData, i) =>
                                        <tr key={i}>
                                            <td>{dynamicData.fecha_registro}</td>
                                            <td>{dynamicData.codigo}</td>
                                            <td>{dynamicData.nombre}</td>
                                            <td align="right">{this.formatNumber(dynamicData.valor)}</td>
                                            <td align="center">{dynamicData.simbolo}</td>
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
                                <div style={{"height":"50px","overflow":"scroll","visibility":"hidden"}}>
                                    <table id="tabla-export" style={{"width":"100%"}}>
                                        <tbody>
                                            <tr>
                                                <th>Fecha_registro</th>
                                                <th>Codigo</th>
                                                <th>Detalle</th>
                                                <th>Valor</th>
                                                <th>Unidad</th>
                                            </tr>
                                            {listado.map((dynamicData, i) =>
                                                <tr key={i}>
                                                    <td style={{"textAlign":"center"}}>{dynamicData.fecha_registro}</td>
                                                    <td style={{"textAlign":"center"}}>{dynamicData.codigo}</td>
                                                    <td style={{"textAlign":"left"}}>{dynamicData.nombre}</td>
                                                    <td style={{"textAlign":"left"}}>{this.formatNumber(dynamicData.valor)}</td>
                                                    <td style={{"textAlign":"center"}}>{dynamicData.simbolo}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
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
