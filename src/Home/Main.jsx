import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from './Images/img1.png';
import img2 from './Images/img2.png';
import img3 from './Images/img3.png';
const Main = () => {
    return (
        <div>
            <div className='w-full'>
                <Carousel
                    interval={15000}
                    className="flex h-full items-center"
                    indicators={false}
                    prevIcon={<span className="carousel-control-prev-icon !bg-black !important" />}
                    nextIcon={<span className="carousel-control-next-icon !bg-black !important" />}
                >
                    <Carousel.Item interval={5000}>
                        <img
                            className="d-block w-screen h-screen"
                            src={img1}
                            alt="First slide"
                        />
                        <Carousel.Caption className='Carousel'>
                            <p className='p_1_main'>مصنع لصهر الكانزات وتحويلها لمادة خام يركز على إعادة تدوير علب الكانز الفارغة لتحويلها إلى مواد خام يمكن استخدامها في الصناعة.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <img
                            className="d-block w-screen h-screen"
                            src={img2}
                            alt="Second slide"
                        />
                        <Carousel.Caption className='Carousel'>
                            <p className='p_1_main'>يعتبر مصنع لصهر الكانزات وتحويلها لمادة خام مشروعًا ذا قيمة كبيرة من حيث الاستدامة الاقتصادية والبيئية، مع وجود فرص لتطويره وتحسين أدائه في المستقبل.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <img
                            className="d-block w-screen h-screen"
                            src={img3}
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