'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container, Card, Button, Row, Col, Badge } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import questions from '@/data/questions.json';

interface CategoryScore {
    category: string;
    leftScore: number;
    rightScore: number;
    total: number;
    leftPercentage: number;
}

export default function ResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<{
        left: number;
        right: number;
        total: number;
        categories?: CategoryScore[];
    } | null>(null);
    const [nickname, setNickname] = useState('');
    const resultCardRef = useRef<HTMLDivElement>(null);
    const [showShareMessage, setShowShareMessage] = useState(false);

    useEffect(() => {
        // 결과 로드
        const storedResults = localStorage.getItem('survey_results');
        if (!storedResults) {
            router.push('/');
            return;
        }

        setResults(JSON.parse(storedResults));
    }, [router]);

    const handleSaveImage = async () => {
        if (resultCardRef.current) {
            setShowShareMessage(true);
            const canvas = await html2canvas(resultCardRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
            });
            const image = canvas.toDataURL('image/png');

            // 이미지 다운로드
            const link = document.createElement('a');
            link.href = image;
            link.download = `좌중우돌_${nickname || '나의'}정치성향.png`;
            link.click();

            setTimeout(() => {
                setShowShareMessage(false);
            }, 3000);
        }
    };

    const handleReset = () => {
        localStorage.removeItem('survey_results');
        localStorage.removeItem('survey_completed');
        localStorage.removeItem('survey_answers');
        router.push('/');
    };

    // 정치성향 결정 함수
    const getPoliticalTendency = () => {
        if (!results) return '';

        const leftPercentage = (results.left / results.total) * 100;

        if (leftPercentage >= 70) return '강한 진보 성향';
        else if (leftPercentage >= 55) return '진보 성향';
        else if (leftPercentage >= 45) return '중도';
        else if (leftPercentage >= 30) return '보수 성향';
        else return '강한 보수 성향';
    };

    // 카테고리 스타일 매핑
    const getCategoryClass = (category: string) => {
        const mapping: Record<string, string> = {
            경제: 'category-economic',
            세금: 'category-economic',
            복지: 'category-economic',
            노동: 'category-economic',
            젠더: 'category-gender',
            교육: 'category-education',
            이주: 'category-immigration',
            안보: 'category-security',
            에너지: 'category-energy',
            외교: 'category-foreign',
            통일: 'category-foreign',
            사법: 'category-security',
            치안: 'category-security',
            정치: 'category-economic',
            언론: 'category-foreign',
            역사: 'category-education',
        };

        return mapping[category] || '';
    };

    if (!results) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="political-card text-center">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <Image
                                        src="/jjwdTitle.svg"
                                        alt="좌중우돌"
                                        width={200}
                                        height={80}
                                        priority
                                        className="mx-auto"
                                    />
                                </div>
                                <h2 className="page-title">
                                    결과를 불러오는 중...
                                </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    const leftPercentage = Math.round((results.left / results.total) * 100);
    const rightPercentage = 100 - leftPercentage;

    // 카테고리별 결과 계산
    const categoryResults = results.categories || getCategoryResults();

    // 가장 진보/보수적인 카테고리 찾기
    const mostProgressiveCategory = [...categoryResults].sort(
        (a, b) => b.leftPercentage - a.leftPercentage
    )[0];
    const mostConservativeCategory = [...categoryResults].sort(
        (a, b) => a.leftPercentage - b.leftPercentage
    )[0];

    function getCategoryResults(): CategoryScore[] {
        // 답변 데이터 불러오기
        const answers = JSON.parse(
            localStorage.getItem('survey_answers') || '{}'
        );

        // 카테고리별로 데이터 그룹화
        const categories: Record<
            string,
            { left: number; right: number; total: number }
        > = {};

        // 카테고리별 점수 계산
        questions.forEach((question) => {
            const category = question.category || '기타';

            if (!categories[category]) {
                categories[category] = { left: 0, right: 0, total: 0 };
            }

            const agreed = answers[question.id] === true;
            categories[category].total++;

            if (
                (agreed && question.scoreDirection === 'left') ||
                (!agreed && question.scoreDirection === 'right')
            ) {
                categories[category].left++;
            } else {
                categories[category].right++;
            }
        });

        // 결과 배열로 변환
        return Object.entries(categories).map(([category, scores]) => ({
            category,
            leftScore: scores.left,
            rightScore: scores.right,
            total: scores.total,
            leftPercentage: Math.round((scores.left / scores.total) * 100),
        }));
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div ref={resultCardRef}>
                        <Card className="political-card result-card">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <Image
                                        src="/jjwdTitle.svg"
                                        alt="좌중우돌"
                                        width={200}
                                        height={80}
                                        priority
                                        className="mx-auto mb-3"
                                    />
                                    <h2 className="title-gradient mb-4">
                                        {nickname || '나의'} 정치성향
                                    </h2>
                                    <h3 className="mb-4">
                                        "{getPoliticalTendency()}"
                                    </h3>
                                </div>

                                <div className="mb-4 text-center">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-bold text-primary">
                                            진보 ({leftPercentage}%)
                                        </span>
                                        <span className="fw-bold text-danger">
                                            보수 ({rightPercentage}%)
                                        </span>
                                    </div>
                                    <div className="progress-left-right">
                                        <div
                                            className="progress-left"
                                            style={{
                                                width: `${leftPercentage}%`,
                                                height: '100%',
                                                borderRadius:
                                                    leftPercentage === 100
                                                        ? '50px'
                                                        : '50px 0 0 50px',
                                            }}
                                        ></div>
                                        <div
                                            className="progress-right"
                                            style={{
                                                width: `${rightPercentage}%`,
                                                height: '100%',
                                                borderRadius:
                                                    rightPercentage === 100
                                                        ? '50px'
                                                        : '0 50px 50px 0',
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="result-summary mb-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <h4 className="mb-0">
                                            카테고리별 분석
                                        </h4>
                                    </div>

                                    {categoryResults
                                        .sort(
                                            (a, b) =>
                                                b.leftPercentage -
                                                a.leftPercentage
                                        )
                                        .map((cat) => (
                                            <div
                                                key={cat.category}
                                                className="mb-3"
                                            >
                                                <div className="d-flex justify-content-between mb-1 align-items-center">
                                                    <span
                                                        className={`category-label ${getCategoryClass(
                                                            cat.category
                                                        )}`}
                                                    >
                                                        {cat.category}
                                                    </span>
                                                    <span className="small">
                                                        <span className="text-primary">
                                                            {cat.leftPercentage}
                                                            %
                                                        </span>{' '}
                                                        /{' '}
                                                        <span className="text-danger">
                                                            {100 -
                                                                cat.leftPercentage}
                                                            %
                                                        </span>
                                                    </span>
                                                </div>
                                                <div
                                                    className="progress-left-right"
                                                    style={{ height: '10px' }}
                                                >
                                                    <div
                                                        className="progress-left"
                                                        style={{
                                                            width: `${cat.leftPercentage}%`,
                                                            height: '100%',
                                                            borderRadius:
                                                                cat.leftPercentage ===
                                                                100
                                                                    ? '50px'
                                                                    : '50px 0 0 50px',
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="progress-right"
                                                        style={{
                                                            width: `${
                                                                100 -
                                                                cat.leftPercentage
                                                            }%`,
                                                            height: '100%',
                                                            borderRadius:
                                                                cat.leftPercentage ===
                                                                0
                                                                    ? '50px'
                                                                    : '0 50px 50px 0',
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* 결과 요약 */}
                                <div className="result-summary mb-4">
                                    <h5 className="mb-3">특징적인 성향</h5>
                                    <p>
                                        <strong>가장 진보적인 분야:</strong>{' '}
                                        {mostProgressiveCategory.category} (
                                        {mostProgressiveCategory.leftPercentage}
                                        %)
                                    </p>
                                    <p className="mb-0">
                                        <strong>가장 보수적인 분야:</strong>{' '}
                                        {mostConservativeCategory.category} (
                                        {100 -
                                            mostConservativeCategory.leftPercentage}
                                        %)
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="nickname-input form-control"
                                        placeholder="닉네임 입력 (선택)"
                                        value={nickname}
                                        onChange={(e) =>
                                            setNickname(e.target.value)
                                        }
                                    />
                                </div>

                                <p className="mb-0 text-muted text-center small fst-italic">
                                    본 테스트는 100% 프론트엔드에서 처리되며,
                                    어떠한 데이터도 저장하지 않습니다.
                                </p>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            className="btn-political-left"
                            onClick={handleSaveImage}
                        >
                            결과 이미지 저장
                        </Button>
                        <Button
                            className="btn-political-center"
                            onClick={() => router.push('/')}
                        >
                            홈으로 돌아가기
                        </Button>
                        <Button
                            className="btn-political-right"
                            onClick={handleReset}
                        >
                            테스트 다시하기
                        </Button>
                    </div>

                    {showShareMessage && (
                        <div className="alert alert-success mt-3 text-center animate__animated animate__fadeIn">
                            이미지가 다운로드되었습니다! SNS에 공유해보세요.
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
