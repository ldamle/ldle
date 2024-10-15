import React, { useRef, useEffect, ReactNode } from 'react';
import { Layout, Menu, Slider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faHandPointer, faCircle } from '@fortawesome/free-solid-svg-icons';
import { displayProps } from '../display';

const { Sider, Content } = Layout;

// Define props interface for MainFrame
interface MainFrameProps {
    children: ReactNode; // Accepts any JSX elements passed as children
}

const MainFrame: React.FC<MainFrameProps> = ({ children }) => {
    // State for zoom level
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the DOM content container

    const handleMenuClick = (key: string) => {
        // Placeholder for potential future menu actions
    };

    const handleZoomChange = (value: number) => {
        displayProps.setScale(value);
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.transform = `scale(${displayProps.scale})`;
            contentRef.current.style.transformOrigin = 'top left'; // Ensure scaling is relative to the top-left corner
        }
    }, [displayProps.scale]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={100}
                style={{
                    background: '#ffffff',
                    padding: '20px'
                }}>
                <Menu
                    defaultSelectedKeys={['1']}
                    style={{ background: 'transparent' }}
                    onClick={(e) => handleMenuClick(e.key)}
                    mode="vertical" // Указываем вертикальный режим
                    selectable={false} // Отключаем выделение
                >
                    <Menu.Item key="1" icon={<FontAwesomeIcon icon={faArrowPointer} />} title="" />
                    <Menu.Item key="2" icon={<FontAwesomeIcon icon={faHandPointer} />} title="" />
                    <Menu.Item key="3" icon={<FontAwesomeIcon icon={faCircle} />} title="" />
                </Menu>
                <div style={{ marginTop: '30px', height: '200px' }}>
                    <p>Zoom:</p>
                    <Slider
                        vertical
                        min={0.1}
                        max={2.5}
                        step={0.1}
                        value={displayProps.scale}
                        onChange={handleZoomChange}
                        style={{ height: '100%' }} // Для задания размера вертикального слайдера
                    />
                </div>
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: '20px',
                        padding: '0px',
                        overflow: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        position: 'relative'
                    }}>
                    <div
                        style={{
                            position: 'absolute',
                            width: '1000vw', // Set a fixed canvas width
                            height: '1000vh', // Set a fixed canvas height
                            overflow: 'auto'
                        }}
                        ref={contentRef}>
                        {children} {/* Render children here */}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export { MainFrame };
