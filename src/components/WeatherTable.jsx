import React from 'react';
import './WeatherTable.css';
import ForecastDay from 'components/ForecastDay.jsx';

export default class WeatherTable extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        let w_arr = [];

        for(let i = 1; i < 5; i++){
            w_arr.push(<ForecastDay city={this.props.city} unit={this.props.unit} offset={i} key={i}/>);
        }

        return (
            <table className='w-table mx-auto mt-2rem'>
                <tbody>
                    {w_arr}
                </tbody>
            </table>
        );
    }
}