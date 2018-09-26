import React, { Component } from 'react';

class ComboPeriodo extends Component {

    constructor(props){
        super(props);
        this.state = {
            eps : props.eps,
            local : props.local,
            periodo : props.periodo,
            tipo : props.tipo
        }
    }

    componentDidUpdate(){
        if(this.state.periodo !== this.props.periodo){
            this.setState({
                local : this.props.periodo
            });
        }
        if(this.state.local !== this.props.local){
            this.setState({
                periodo : this.props.periodo,
                local : this.props.local
            });
        }
        if(this.state.eps !== this.props.eps){
            this.setState({
                periodo : this.props.periodo,
                local : this.props.local,
                eps : this.props.eps
            });
        }
    }

    render(){
        return(
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text label-titulo" htmlFor="select-periodo">Tipo</label>
                </div>
                <select className="custom-select" id="select-periodo" value={this.props.tipo} onChange={this.props.onChange}>
                    <option key={0} value="" disabled>Seleccione tipo</option>
                    <option value="1">Saldo de banco</option>
                    <option value="2">Flujo de caja</option>
                    <option value="3">Variables</option>
                </select>
            </div>
        )
    }
}

export default ComboPeriodo;
