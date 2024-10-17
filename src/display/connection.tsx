import React, {useEffect, useRef} from 'react';
import * as lle from 'ldamle.lle';
import * as d3 from 'd3';

const drawLine2Points = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    xC: number,
    style: lle.Types.style.connection,
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) => {
    svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', xC)
        .attr('y2', y1)
        .attr('stroke', style.color)
        .attr('stroke-width', style.stroke);

    svg.append('line')
        .attr('x1', xC)
        .attr('y1', y1)
        .attr('x2', xC)
        .attr('y2', y2)
        .attr('stroke', style.color)
        .attr('stroke-width', style.stroke);

    svg.append('line')
        .attr('x1', xC)
        .attr('y1', y2)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', style.color)
        .attr('stroke-width', style.stroke);
};

const calcDrawLine2Points = (
    // marginConnV1: number,
    // fontConn1: number,
    // numberConn1: number,
    // x1: number,
    // y1: number,
    // width1: number,
    // marginConnV2: number,
    // fontConn2: number,
    // numberConn2: number,
    // x2: number,
    // y2: number,
    // xcIndent: number,
    // minIndent: number,
    // style: TODO
    connection: lle.Types.Interface.Connection,
    no_in: number,
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) => {
    // Вычисления для элемента исходного соединения
    let marginConnV1 = connection.out.element.style.sizes.MarginConn.v;
    let fontConn1 = connection.out.element.style.sizes.font.conn;
    let numberConn1 = connection.out.no_source;
    let x1 = parseFloat(connection.out.element.props.x);
    let y1 = parseFloat(connection.out.element.props.y);
    let width1 = parseFloat(connection.out.element.props.width);
    let xcIndent = connection.out.element.style.xcIndent;
    let minIndent = connection.out.element.style.minIndent;

    // Вычисления для элемента входного соединения
    let cin = (connection.in as lle.Types.source.array)[no_in];
    let marginConnV2 = cin.element.style.sizes.MarginConn.v;
    let fontConn2 = cin.element.style.sizes.font.conn;
    let numberConn2 = cin.no_source;
    let x2 = parseFloat(cin.element.props.x);
    let y2 = parseFloat(cin.element.props.y);
    // let width2 = parseFloat(cin.element.props.width);

    // Координаты
    x1 += width1;
    y1 += (marginConnV1 + fontConn1) * numberConn1 + marginConnV1 + fontConn1 / 2;
    y2 += (marginConnV2 + fontConn2) * numberConn2 + marginConnV1 + fontConn1 / 2;

    // Вычисление точки управления (контрольной точки) для кривой
    let xC = x1 + minIndent + xcIndent * (numberConn1 + 1);

    // Отрисовка линии
    drawLine2Points(x1, y1, x2, y2, xC, connection.style, svg);
};

const Connection: React.FC<{connection: lle.Types.Interface.Connection}> = ({connection}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(
        () => {
            if (svgRef.current) {
                d3.select(svgRef.current).selectAll('*').remove();

                const svg = d3.select(svgRef.current).attr('width', 10000).attr('height', 10000);
                if (
                    connection.out.element.props.width &&
                    connection.out.element.props.x &&
                    connection.out.element.props.y &&
                    (connection.in as lle.Types.source.array).length > 0
                ) {
                    let ins = connection.in as lle.Types.source.array;
                    for (let i = 0; i < ins.length; i++) {
                        if (
                            ins[i].element.props.width &&
                            ins[i].element.props.x &&
                            ins[i].element.props.y
                        ) {
                            calcDrawLine2Points(connection, i, svg);
                        }
                    }
                }
            }
        },
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            connection.out.element.props.x,
            connection.out.element.props.y,
            connection.out.element.props.width,
            ...(connection.in instanceof Array
                ? (connection.in as lle.Types.source.array).flatMap((cin) => [
                      cin.element.props.x,
                      cin.element.props.y,
                      cin.element.props.width
                  ])
                : [])
        ]
        /* eslint-disable react-hooks/exhaustive-deps */
    );

    return (
        <div className="Element" style={{zIndex: '-1'}}>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export {Connection};
