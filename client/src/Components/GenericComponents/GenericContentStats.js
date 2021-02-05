import React, { Fragment } from 'react';
import { Stats } from '../Styled Components/content';
import { SubTitulo } from '../Styled Components/text';

const GenericContentStats = ({
    type,
    array
}) => {
    return (
        <Fragment>
            <SubTitulo style={{textAlign: 'center'}}>Progress Distribution</SubTitulo>
            <Stats>
                <div>
                    <div className='planning'>Planning</div>
                    <p><span className='planning'>{type === 'anime' ? array.plan_to_watch : array.plan_to_read}</span> Users</p>
                </div>
                <div>
                    <div className='current'>{type === 'anime' ? 'Watching' : 'Reading'}</div>
                    <p><span className='current'>{type === 'anime' ? array.watching : array.reading}</span> Users</p>
                </div>
                <div>
                    <div className='dropped'>Dropped</div>
                    <p><span className='dropped'>{array.dropped}</span> Users</p>
                </div>
                <div>
                    <div className='completed'>Completed</div>
                    <p><span className='completed'>{array.completed}</span> Users</p>
                </div>
            </Stats>
            <br/>
        </Fragment>
    );
}

export default GenericContentStats;