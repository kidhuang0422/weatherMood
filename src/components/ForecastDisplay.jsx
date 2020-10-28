import React from 'react';
import PropTypes from 'prop-types';

import './ForecastDisplay.css';

export default class ForecastDisplay extends React.Component {
    static propTypes = {
        masking: PropTypes.bool,
        group: PropTypes.string,
        description: PropTypes.string,
        tempMax: PropTypes.number,
        tempMin: PropTypes.number,
        unit: PropTypes.string,
        day: PropTypes.string
    };

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className={`weather-display ${this.props.masking
                ? 'masking'
                : ''}`}>
                <img src={`images/w-${this.props.group}.png`}/>
                <p className='description'>{this.props.description}</p>&nbsp;
                <h1 className='temp'>
                    <span className='display-4'>{this.props.tempMin.toFixed(0)}-{this.props.tempMax.toFixed(0)}&ordm;</span>
                    &nbsp;{(this.props.unit === 'metric')
                        ? 'C'
                        : 'F'}
                </h1>
                <p className="day display-5">{this.props.day}</p>
            </div>
        );
    }
}