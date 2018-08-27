import React, { Component } from 'react';

class ComboMes extends Component {

    constructor(props){
        super(props);
        this.state = {
            mes : props.mes
        }
    }

    render(){
        return(
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text label-titulo" htmlFor="select-periodo">Mes</label>
                </div>
                <select className="custom-select" id="select-periodo" value={this.props.mes} onChange={this.props.onChange}>
                    <option key={0} value="" disabled>Seleccione mes</option>
                    <option key={1} value="01">Enero</option>
                    <option key={2} value="02">Febrero</option>
                    <option key={3} value="03">Marzo</option>
                    <option key={4} value="04">Abril</option>
                    <option key={5} value="05">Mayo</option>
                    <option key={6} value="06">Junio</option>
                    <option key={7} value="07">Julio</option>
                    <option key={8} value="08">Agosto</option>
                    <option key={9} value="09">Septiembre</option>
                    <option key={10} value="10">Octubre</option>
                    <option key={11} value="11">Noviembre</option>
                    <option key={12} value="12">Diciembre</option>
                </select>
            </div>
        )
    }
}

export default ComboMes;
