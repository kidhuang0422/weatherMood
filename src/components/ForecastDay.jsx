import React from 'react';
import PropTypes from 'prop-types';
import {getForecast} from 'api/open-weather-map.js';

export default class ForecastDay extends React.Component{
    static propTypes = {
        masking: PropTypes.bool,
        group: PropTypes.string,
        description: PropTypes.string,
        tempMax: PropTypes.number,
        tempMin: PropTypes.number,
        unit: PropTypes.string,
        day: PropTypes.string
    };

    static getInitForecastState() {
        return {
            code: -1,
            group: 'na',
            description: 'N/A',
            tempMax: NaN,
            tempMin: NaN,
            day: 'N/A'
        };
    }

    constructor(props){
        super(props);

        this.state = {
            ...ForecastDay.getInitForecastState(),
            loading: false,
            masking: false
        };
    }

    componentDidMount() {
        this.getForecast(this.props.city, this.props.unit, this.props.offset);
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelWeather();
        }
    }

    render(){
        return(
            <tr>
                <td>{this.state.day}</td>
                <td>
                    <span>{this.state.tempMin.toFixed(0)}-{this.state.tempMax.toFixed(0)}&ordm;</span>
                    &nbsp;{(this.props.unit === 'metric')
                    ? 'C'
                    : 'F'}
                </td>
                <td><img src={`images/w-${this.state.group}.png`}/></td>
                <td>{this.state.description}</td>
            </tr>
        );
    }

    getForecast(city, unit, offset){
        this.setState({
            loading: true,
            masking: true,
            // city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getForecast(city, unit, offset).then(weather => {
                this.setState({
                    ...weather,
                    loading: false
                });
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitForecastState(unit),
                    loading: false
                });
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }
}