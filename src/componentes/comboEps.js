import React, { Component } from 'react';

class ComboEps extends Component {

    constructor(props){
        super(props);
        this.state = {
            dataEps : []
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

    fetchDataEps(){
        fetch("https://"+this.props.hostname+"/otass-rest/MainController/getEps", {
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
        for(var i in this.state.dataEps){
            objs.push(<option key={i+1} value={this.state.dataEps[i].codigo}>{this.state.dataEps[i].nombre}</option>)
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
