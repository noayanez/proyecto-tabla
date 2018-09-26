import React, { Component } from 'react';

class ComboPeriodo extends Component {

    constructor(props){
        super(props);
        this.state = {
            dataPeriodo : [],
            eps : props.eps,
            local: props.local,
            tipo: props.tipo
        }
    }

    componentDidUpdate(){
        if(this.state.tipo !== this.props.tipo && this.props.local !== ""){
            this.props.vaciarPeriodo();
            this.setState({
                dataPeriodo: [],
                tipo : this.props.tipo
            });
            this.fetchDataPeriodo(this.props.eps,this.props.local);
        }
        if(this.state.local !== this.props.local && this.props.tipo !== ""){
            this.props.vaciarPeriodo();
            this.setState({
                dataPeriodo: [],
                local : this.props.local
            });
            this.fetchDataPeriodo(this.props.eps,this.props.local);
        }
        if(this.state.eps !== this.props.eps){
            this.setState({
                eps : this.props.eps,
                local : this.props.local,
                dataPeriodo : []
            });
        }
    }

    fetchDataPeriodo(epsaux, localaux) {
        var tipoString = "";
        if (this.props.tipo === "1") {
            tipoString = "saldos";
        } else {
            if (this.props.tipo === "2") {
                tipoString = "flujos";
            } else {
                tipoString = "variables";
            }
        }
        const data = {
            id_eps : parseInt(epsaux,10),
            id_local : parseInt(localaux,10)
        }
        fetch(this.props.hostname+"/otass-rest/MainController/"+tipoString+"/getYears", {
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
                dataPeriodo : result
            });
        })
    }

    crearOpcionesPeriodo(){
        const objs = [];
        for(var i in this.state.dataPeriodo){
            objs.push(<option key={i+1} value={this.state.dataPeriodo[i]}>{this.state.dataPeriodo[i]}</option>)
        }
        return objs;
    }

    render(){
        return(
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text label-titulo" htmlFor="select-periodo">Periodo</label>
                </div>
                <select className="custom-select" id="select-periodo" value={this.props.periodo} onChange={this.props.onChange}>
                    <option key={0} value="" disabled>Seleccione periodo</option>
                    {this.crearOpcionesPeriodo()}
                </select>
            </div>
        )
    }
}

export default ComboPeriodo;
