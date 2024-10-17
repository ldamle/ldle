import React, {useEffect, useRef, useState} from 'react';
import * as lle from 'ldamle.lle';
import * as d3 from 'd3';
import * as Display from '../display';

const Elements: React.FC<{
    elements: lle.Types.Interface.Element[];
}> = ({elements}) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    for (let i = 0; i < elements.length; i++) {
        [elements[i].props['x'], elements[i].props['SetX']] = useState<string>(String(0));
        [elements[i].props['y'], elements[i].props['SetY']] = useState<string>(String(0));
    }
    /* eslint-enable react-hooks/rules-of-hooks */
    const connections = elements.flatMap((cin) => [...cin.out_connections]);
    return (
        <div className="elementsGroup">
            {elements.map((element, index) => (
                <Display.Element element={element} />
            ))}
            {connections.map((element, index) => (
                <Display.Connection connection={element} />
            ))}
        </div>
    );
};

export {Elements};
