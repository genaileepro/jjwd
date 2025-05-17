'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const router = useRouter();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // 페이지 로드 시 애니메이션 효과
        setAnimate(true);
    }, []);

    const handleStart = () => {
        router.push('/survey');
    };

    const handleShowResults = () => {
        router.push('/results');
    };

    return (
        <Container
            className="py-5 d-flex flex-column justify-content-center"
            style={{ minHeight: '100vh' }}
        >
            <Row
                className={`justify-content-center ${
                    animate ? 'animate__animated animate__fadeIn' : ''
                }`}
            >
                <Col md={8} lg={6}>
                    <Card className="political-card p-4 text-center">
                        <Card.Body className="py-5">
                            <div className="logo-container mb-5 text-center">
                                <div className="d-flex justify-content-center">
                                    <Image
                                        src="/jjwdTitle.svg"
                                        alt="좌중우돌"
                                        width={300}
                                        height={120}
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </div>

                            <h1 className="title-gradient mb-4">
                                정치성향 테스트
                            </h1>
                            <p className="lead mb-4">
                                당신은 어떤 정치적 스펙트럼에 속해 있을까요?
                                <br />
                                60개의 질문으로 알아보는 정치성향 테스트입니다.
                            </p>

                            <div className="alert alert-warning mb-4 text-start">
                                <h5 className="alert-heading fw-bold">
                                    🛑 본 설문은 다음과 같습니다
                                </h5>
                                <ul className="mb-0 ps-3">
                                    <li>총 60문항입니다.</li>
                                    <li>
                                        모든 문항은 노골적이고 직접적인 현실을
                                        다룹니다.
                                    </li>
                                    <li>
                                        일부 문항은 심리적·감정적으로 불편하거나
                                        <br />
                                        무의식적 방어기제를 유발할 수 있습니다.
                                    </li>
                                    <li>
                                        본 설문의 목적은 참여자의 솔직한
                                        <br />
                                        사상·가치관·심리 반응을 진단하기
                                        위함입니다.
                                    </li>
                                    <li>
                                        중립 없이, 반드시
                                        찬성/반대(동의/비동의)로 선택하셔야
                                        합니다.
                                    </li>
                                    <li>
                                        모든 답변은 익명이며, 개인정보는
                                        저장되지 않습니다.
                                    </li>
                                    <li>
                                        답변을 시작하시면, 본 안내문과 조건에
                                        동의한 것으로 간주합니다.
                                    </li>
                                </ul>
                            </div>

                            <div className="d-flex flex-column align-items-center mb-5">
                                <div
                                    className="position-relative mb-2"
                                    style={{
                                        width: '100%',
                                        height: '10px',
                                        maxWidth: '380px',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            width: '40%',
                                            height: '100%',
                                            background: 'var(--left-color)',
                                            borderRadius: '5px 0 0 5px',
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '40%',
                                            width: '20%',
                                            height: '100%',
                                            background: 'var(--center-color)',
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '60%',
                                            width: '40%',
                                            height: '100%',
                                            background: 'var(--right-color)',
                                            borderRadius: '0 5px 5px 0',
                                        }}
                                    />
                                </div>

                                <div
                                    className="d-flex justify-content-between"
                                    style={{ width: '100%', maxWidth: '380px' }}
                                >
                                    <span className="fw-bold text-primary">
                                        진보
                                    </span>
                                    <span
                                        className="fw-bold"
                                        style={{ color: 'var(--center-color)' }}
                                    >
                                        중도
                                    </span>
                                    <span className="fw-bold text-danger">
                                        보수
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center">
                                <Button
                                    className="btn-political-left me-3 px-4 py-2"
                                    size="lg"
                                    onClick={handleStart}
                                >
                                    테스트 시작하기
                                </Button>
                                <Button
                                    className="btn-political-outline px-4 py-2"
                                    size="lg"
                                    onClick={handleShowResults}
                                >
                                    결과 확인하기
                                </Button>
                            </div>

                            <div className="mt-5 text-muted">
                                <p className="small">
                                    이 테스트는 100% 프론트엔드에서 처리되며,
                                    어떠한 데이터도 서버에 저장하지 않습니다.
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
