import React from 'react';
import PropTypes from 'prop-types';
import {getForecast} from 'api/open-weather-map.js';
import ForecastDisplay from 'components/ForecastDisplay.jsx';
import WeatherTable from 'components/WeatherTable.jsx';

import './weather.css';

export default class Forecast extends React.Component {
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
            // city: 'na',
            code: -1,
            group: 'na',
            description: 'N/A',
            tempMax: NaN,
            tempMin: NaN,
            day: 'N/A'
        };
    }
    
    constructor(props) {
        super(props);

        this.state = {
            ...Forecast.getInitForecastState(),
            loading: false,
            masking: false
        };

        // TODO
    }

    componentDidMount() {
        this.getForecast(this.props.city, this.props.unit, 0);
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelWeather();
        }
    }

    render() {
        return (
            <div className={`forecast weather-bg ${this.state.group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <ForecastDisplay {...this.state}/>
                    <WeatherTable city={this.props.city} unit={this.props.unit}/>
                </div>
            </div>
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
