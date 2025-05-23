'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container, Card, Button, Row, Col, Badge } from 'react-bootstrap';
import questions from '@/data/questions.json';

export default function SurveyPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showWarning, setShowWarning] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const questionsPerPage = 5;
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
    const currentQuestions = questions.slice(startIndex, endIndex);

    const progress = Math.floor(
        (Object.keys(answers).length / questions.length) * 100
    );

    useEffect(() => {
        // 이미 설문을 완료했는지 확인
        const completedSurvey = localStorage.getItem('survey_completed');
        if (completedSurvey) {
            setShowWarning(true);
        }

        // 페이지 전환 애니메이션
        setFadeIn(true);
    }, []);

    // 페이지 전환 애니메이션
    useEffect(() => {
        setFadeIn(false);
        const timer = setTimeout(() => {
            setFadeIn(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [currentPage]);

    const handleAnswer = (id: number, value: number) => {
        setAnswers((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else {
            // 결과 계산
            calculateResults();
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const calculateResults = () => {
        // 5단계 척도에서 진보-보수 점수 계산
        // 0: 매우 찬성(진보) - 4: 매우 반대(보수)
        const totalPossibleScore = questions.length * 2; // 각 문항당 최대 점수 차이는 2 (-2 ~ 2)
        let progressiveScore = 0;

        questions.forEach((question, index) => {
            const answer = answers[question.id];
            if (answer !== undefined) {
                // 0: 매우 찬성, 1: 찬성, 2: 보통, 3: 반대, 4: 매우 반대
                // 점수 변환: 매우 찬성=2, 찬성=1, 보통=0, 반대=-1, 매우 반대=-2
                const normalizedScore = 2 - answer;
                progressiveScore += normalizedScore;
            }
        });

        // 진보 성향 비율 계산 (50%가 중도)
        const leftPercentage = Math.round(
            ((progressiveScore + totalPossibleScore / 2) / totalPossibleScore) *
                100
        );

        // 보수 성향 비율
        const rightPercentage = 100 - leftPercentage;

        // 카테고리별 점수 계산
        const categories: Record<
            string,
            { left: number; right: number; total: number }
        > = {};

        questions.forEach((question) => {
            const category = question.category || '기타';

            if (!categories[category]) {
                categories[category] = { left: 0, right: 0, total: 0 };
            }

            const answer = answers[question.id];
            if (answer !== undefined) {
                const normalizedScore = 2 - answer; // -2 ~ 2 범위
                categories[category].total += 2; // 각 문항당 최대 편차는 2*2

                if (normalizedScore > 0) {
                    categories[category].left += normalizedScore;
                } else {
                    categories[category].right += Math.abs(normalizedScore);
                }
            }
        });

        // 카테고리 결과 변환
        const categoryResults = Object.entries(categories).map(
            ([category, scores]) => ({
                category,
                leftScore: scores.left,
                rightScore: scores.right,
                total: scores.total,
                leftPercentage:
                    Math.round(
                        (scores.left / (scores.left + scores.right)) * 100
                    ) || 50,
            })
        );

        // 응답 데이터 저장
        localStorage.setItem('survey_answers', JSON.stringify(answers));

        // 결과 저장
        localStorage.setItem(
            'survey_results',
            JSON.stringify({
                left: leftPercentage,
                right: rightPercentage,
                total: 100,
                categories: categoryResults,
            })
        );

        localStorage.setItem('survey_completed', 'true');

        // 결과 페이지로 이동
        router.push('/results');
    };

    const resetWarning = () => {
        setShowWarning(false);
    };

    const areAllCurrentQuestionsAnswered = currentQuestions.every(
        (question) => answers[question.id] !== undefined
    );

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
        };

        return mapping[category] || '';
    };

    if (showWarning) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="political-card">
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
                                    <h2 className="page-title">주의</h2>
                                </div>
                                <div className="result-summary">
                                    <p className="text-center mb-0">
                                        이미 설문을 완료했습니다. 다시
                                        진행하시겠습니까?
                                    </p>
                                </div>
                                <div className="d-flex justify-content-center gap-3 mt-4">
                                    <Button
                                        className="btn-political-right"
                                        onClick={() => router.push('/results')}
                                    >
                                        결과 보기
                                    </Button>
                                    <Button
                                        className="btn-political-outline"
                                        onClick={resetWarning}
                                    >
                                        다시 진행하기
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="political-card">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <Image
                                    src="/jjwdTitle.svg"
                                    alt="좌중우돌"
                                    width={150}
                                    height={60}
                                    priority
                                    className="mx-auto mb-2"
                                />
                                <div className="d-flex justify-content-center align-items-center mb-2">
                                    <span className="fs-4 fw-bold me-2">
                                        정치성향 테스트
                                    </span>
                                    <Badge
                                        bg="secondary"
                                        className="py-2 px-3 rounded-pill"
                                    >
                                        {currentPage} / {totalPages}
                                    </Badge>
                                </div>
                            </div>

                            <div className="progress-left-right mb-4">
                                <div
                                    className="progress-left"
                                    style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                    }}
                                ></div>
                                <div
                                    className="progress-right"
                                    style={{
                                        width: `${100 - progress}%`,
                                        height: '100%',
                                    }}
                                ></div>
                            </div>

                            <div
                                className={`questions-container ${
                                    fadeIn
                                        ? 'animate__animated animate__fadeIn'
                                        : ''
                                }`}
                            >
                                {currentQuestions.map((question) => (
                                    <Card
                                        key={question.id}
                                        className="question-card mb-3"
                                        style={{
                                            borderLeft:
                                                answers[question.id] !==
                                                undefined
                                                    ? '4px solid #6c757d'
                                                    : '4px solid transparent',
                                        }}
                                    >
                                        <Card.Body>
                                            <div className="mb-3">
                                                <span
                                                    className={`category-label ${getCategoryClass(
                                                        question.category
                                                    )}`}
                                                >
                                                    {question.category}
                                                </span>
                                            </div>
                                            <p className="fs-5 mb-3">
                                                {question.question}
                                            </p>
                                            <div
                                                className="d-flex flex-column"
                                                style={{ gap: '10px' }}
                                            >
                                                {question.answerScale &&
                                                    question.answerScale.map(
                                                        (label, index) => (
                                                            <Button
                                                                key={index}
                                                                className={
                                                                    answers[
                                                                        question
                                                                            .id
                                                                    ] === index
                                                                        ? 'btn-dark'
                                                                        : 'btn-outline-secondary'
                                                                }
                                                                onClick={() =>
                                                                    handleAnswer(
                                                                        question.id,
                                                                        index
                                                                    )
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                    padding:
                                                                        '10px',
                                                                    fontSize:
                                                                        '0.9rem',
                                                                    textAlign:
                                                                        'left',
                                                                }}
                                                            >
                                                                {label}
                                                            </Button>
                                                        )
                                                    )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <Button
                                    className="btn-outline-secondary"
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                >
                                    이전
                                </Button>
                                <Button
                                    className="btn-dark"
                                    onClick={handleNext}
                                    disabled={!areAllCurrentQuestionsAnswered}
                                >
                                    {currentPage === totalPages
                                        ? '결과 보기'
                                        : '다음'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
