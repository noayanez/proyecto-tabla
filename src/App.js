import React, { Component } from 'react';
import ComboEps from './componentes/comboEps.js';
import ComboLocal from './componentes/comboLocal.js';
import ComboPeriodo from './componentes/comboPeriodo.js';
import ComboMes from './componentes/comboMes.js';
import ComboTipo from './componentes/comboTipo.js';
import './App.css';

class App extends Component {

    constructor(){
        super();
        this.state = {
            hostname : "18.204.225.30:8443",
            isEpsLoaded : false,
            isLocalLoaded : false,
            isPeriodoLoaded : false,
            isTableLoaded : false,
            eps : "",
            local : "",
            periodo : "",
            mes : "",
            tipo : "",
            dataSaldo : [],
            alerta : ""
        };
        this.handleChangeEps = this.handleChangeEps.bind(this);
        this.handleChangeLocal = this.handleChangeLocal.bind(this);
        this.handleChangePeriodo = this.handleChangePeriodo.bind(this);
        this.handleChangeMes = this.handleChangeMes.bind(this);
        this.handleChangeTipo = this.handleChangeTipo.bind(this);
        this.handleChangeDataSaldo = this.handleChangeDataSaldo.bind(this);
        this.botonEnviar = this.botonEnviar.bind(this);
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
            this.setState({
                dataSaldo : result
            })
        });
        this.setState({
            isTableLoaded : true
        });
    }

    botonEnviar(eps,local,periodo,mes){
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

    render() {
        const listado = this.state.dataSaldo;
        return (
            <div className="App">
                <div className="card">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8 formulario">
                            <br/>
                            <div className="row celda-otass">
                                <div className="col-3"></div>
                                <div className="col-6">
                                    <a href="http://www.otass.gob.pe/">
                                        <img className="logo-otass" src={require("./LOGO_VECTOR.png")}/>
                                    </a>
                                </div>
                                <div className="col-3">
                                    <div>
    	                               <a className="fa fa-facebook" target="_blank" href="https://www.facebook.com/Organismo-T%C3%A9cnico-de-la-Administraci%C3%B3n-de-los-Servicios-de-Saneamiento-1169264316420107/?pnref=lhc"></a>
                                       <a className="fa fa-twitter" target="_blank" href="https://twitter.com/OtassPeru"></a>
                                       <a className="fa fa-flickr" target="_blank" href="https://www.flickr.com/people/140076448@N02/"></a>
                                       <a className="fa fa-linkedin" target="_blank" href="https://www.linkedin.com/in/otassperu"></a>
                                       <a className="fa fa-youtube" target="_blank" href="https://www.youtube.com/channel/UC7F8rA9vw-kTrSi3orChJRQ"></a>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-4">
                                    <ComboEps eps={this.state.eps}
                                    onChange={this.handleChangeEps} hostname={this.state.hostname}/>
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
                            <div className="row">
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
                                <div className="col-12">
                                    <button className="btn-enviar" onClick={this.botonEnviar}>Enviar</button>
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

                {this.state.isTableLoaded?
                    (<div className="contenido-tabla">
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-8">
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Cuenta</th>
                                            <th>Descripcion de cuenta</th>
                                            <th>Ingresos</th>
                                            <th>Egresos</th>
                                            <th>Saldo anterior</th>
                                            <th>Saldo final</th>
                                        </tr>
                                    </thead>
                                    <tbody>{listado.map((dynamicData, i) =>
                                        <tr key={i}>
                                            <td>{dynamicData.cuenta}</td>
                                            <td align="left">{dynamicData.desc_cuenta}</td>
                                            <td>{dynamicData.ingresos}</td>
                                            <td>{dynamicData.egresos}</td>
                                            <td>{dynamicData.saldo_anterior}</td>
                                            <td>{dynamicData.saldo_final}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-2"></div>
                        </div>
                    </div>):(null)}
            </div>
        );
    }
}

export default App;
