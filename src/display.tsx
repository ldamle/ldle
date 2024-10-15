import {Element} from './display/element';
import {MainFrame} from './display/mainframe';
import {useState} from 'react';

type displayPropsType = {
    scale: number;
    setScale: React.Dispatch<React.SetStateAction<number>>;
};
let displayProps : displayPropsType;

function useHook() {
    const [scale, setScale] = useState<number>(1);

    displayProps = {
        scale: scale,
        setScale: setScale
    };
}

export type {displayPropsType};
export {Element, MainFrame, displayProps, useHook};
