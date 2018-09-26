import React, { Component } from 'react';

class ComboEps extends Component {

    constructor(props){
        super(props);
        this.state = {
            dataEps : [],
            filtrar : props.filtrar
        }
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(event){
        this.props.onChange(event);
        for(var i in this.state.dataEps){
            if(parseInt(event.target.value,10) === this.state.dataEps[i].codigo){
                this.props.onChange2(this.state.dataEps[i].nombre);
            }
        }
    }

    componentDidMount(){
        this.fetchDataEps();
    }

    componentDidUpdate(){
        if(this.state.filtrar !== this.props.filtrar){
            this.props.vaciarTodo();
            this.setState({
                dataEps: [],
                filtrar: this.props.filtrar
            });
            this.fetchDataEps();
        }
    }

    fetchDataEps(){
        fetch(this.props.hostname+"/otass-rest/MainController/getEps", {
            method : 'POST',
            headers : {
                accept : '*/*'
            }
        })
        .then((response) =>{
            return response.json()
        })
        .then((result) => {
            console.log(result);
            this.setState({
                dataEps : result
            });
        })
    }

    crearOpcionesEps(){
        const objs = [];
        if(this.state.filtrar==="1"){
            for(var i in this.state.dataEps){
                if(this.state.dataEps[i].tipo === 1){
                    objs.push(<option key={i+1} value={this.state.dataEps[i].codigo}>{this.state.dataEps[i].nombre}</option>)
                }
            }
        }
        if(this.state.filtrar==="2"){
            for(var j in this.state.dataEps){
                if(this.state.dataEps[j].tipo === 0){
                    objs.push(<option key={j+1} value={this.state.dataEps[j].codigo}>{this.state.dataEps[j].nombre}</option>)
                }
            }
        }
        if(this.state.filtrar==="3"){
            for(var k in this.state.dataEps){
                objs.push(<option key={k+1} value={this.state.dataEps[k].codigo}>{this.state.dataEps[k].nombre}</option>)
            }
        }
        return objs;
    }

    render(){
        return(
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text label-titulo" htmlFor="select-eps">Eps</label>
                </div>
                <select className="custom-select" id="select-eps" value={this.props.eps} onChange={this.onSelect}>
                    <option key={0} value={""} disabled>Seleccione empresa</option>
                    {this.crearOpcionesEps()}
                </select>
            </div>
        )
    }
}

export default ComboEps;
