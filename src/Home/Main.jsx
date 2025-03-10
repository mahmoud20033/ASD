import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Home.css';
import Missions from '../components/Missions';
import Sidebar from './Sidebar';

const Main = () => {
    return (
        <div className='Suppliers absolute top-0 left-0 w-10/12 '>
            <div className='h-screen flex-1'>
                <Carousel interval={15000} >
                    <Carousel.Item interval={5000}>
                        <img
                            className="d-block w-screen h-screen"
                            src='src\Home\Images\1.png'
                            alt="First slide"
                        />
                        <Carousel.Caption className='Carousel'>
                            <p className='p_1_main'>مصنع لصهر الكانزات وتحويلها لمادة خام يركز على إعادة تدوير علب الكانز الفارغة لتحويلها إلى مواد خام يمكن استخدامها في الصناعة.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <img
                            className="d-block w-screen h-screen"
                            src="src\Home\Images\2.png"
                            alt="Second slide"
                        />
                        <Carousel.Caption className='Carousel'>
                            <p className='p_1_main'>يعتبر مصنع لصهر الكانزات وتحويلها لمادة خام مشروعًا ذا قيمة كبيرة من حيث الاستدامة الاقتصادية والبيئية، مع وجود فرص لتطويره وتحسين أدائه في المستقبل.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <img
                            className="d-block w-screen h-screen"
                            src="src\Home\Images\3.png"
                            alt="Third slide"
                        />
                        <Carousel.Caption className='Carousel'>
                            <p className='p_1_main'>
                                يساهم في تقليل التلوث البيئي عن طريق إعادة تدوير المواد بدلاً من استخراج المواد الخام من الطبيعة.
                            </p>
                            <p className='p_1_main'>
                                يمكن الحصول على علب الكانز بكميات كبيرة وبأسعار منخفضة، مما يقلل من التكاليف التشغيلية للمشروع
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
};

export default Main;