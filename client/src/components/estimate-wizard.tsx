import { useState, useRef } from "react";
import { Calculator, ArrowRight, ArrowLeft, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { estimateData, BASE_INSTALLATION_PRICE, ORIGINAL_PRICE, type EstimateAnswer, AIRCON_MODELS } from "@shared/estimate-schema";
import { saveEstimateData } from "@/lib/estimate-storage";
import { useToast } from "@/hooks/use-toast";

// 設問の型定義
type Question = {
  id: string;
  question: string;
  options: Array<{
    label: string;
    price: number;
  }>;
  help: {
    reason: string;
    guide: string;
  };
};

type QuestionWithSection = Question & {
  sectionTitle: string;
};

// 詳細な回答の型定義
type DetailedAnswer = {
  questionId: string;
  selectedOption: number;
  optionLabel: string;
  price: number;
};

// 見積りデータの型定義
type EstimateResult = {
  answers: DetailedAnswer[];
  totalPrice: number;
  basePrice: number;
  createdAt: string;
};

export default function EstimateWizard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<EstimateAnswer[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [helpContent, setHelpContent] = useState({ reason: "", guide: "" });
  const questionCardRef = useRef<HTMLDivElement>(null);

  // 選択されたプランを取得（先に定義）
  const getSelectedPlan = () => {
    const planAnswer = answers.find(a => a.questionId === "plan-selection");
    return planAnswer ? planAnswer.selectedOption : -1;
  };

  // 進行中の設問IDリストをanswersから都度生成
  const getAllQuestionIds = () => {
    const ids = ["plan-selection"];
    const plan = answers.find(a => a.questionId === "plan-selection")?.selectedOption;
    if (plan === undefined) return ids;

    if (plan === 1) ids.push("model-size-selection-ac22tfc");
    if (plan === 2) ids.push("model-size-selection-csf225dw");
    if (plan === 3) ids.push("model-size-selection-csex225dw");
    // 工事のみ（plan === 0）は畳数設問をスキップ

    // 共通設問IDをcommon.questionsから取得して追加
    const commonSection = estimateData.find(s => s.id === "common");
    if (commonSection) {
      ids.push(...commonSection.questions.map(q => q.id));
    }
    return ids;
  };

  const questionIds = getAllQuestionIds();
  const currentQuestionId = questionIds[currentStep];
  const totalQuestions = questionIds.length;

  // 現在の設問データ
  const currentQuestionData = (() => {
    if (!currentQuestionId) return null;
    for (const section of estimateData) {
      const question = section.questions.find(q => q.id === currentQuestionId);
      if (question) {
        return { ...question, sectionTitle: section.title } as QuestionWithSection;
      }
    }
    return null;
  })();

  const isLastQuestion = currentStep === totalQuestions - 1;

  // 料金計算
  const calculateTotal = () => {
    let total = BASE_INSTALLATION_PRICE;
    answers.forEach(answer => {
      const question = estimateData.find(s => s.questions.some(q => q.id === answer.questionId));
      if (question) {
        const option = question.questions.find(q => q.id === answer.questionId)?.options[answer.selectedOption];
        if (option) {
          total += option.price;
          // カスタム値がある場合（延長料金など）
          if (answer.customValue) {
            total += answer.customValue;
          }
        }
      }
    });
    return total;
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!currentQuestionData) return;

    const newAnswer: EstimateAnswer = {
      questionId: currentQuestionData.id,
      selectedOption: optionIndex
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestionData.id);
      return [...filtered, newAnswer];
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // 見積り完了 - データを保存して確認画面へ
      try {
        const total = calculateTotal();
        
        // 詳細な回答データを作成
        const detailedAnswers: DetailedAnswer[] = answers.map(answer => {
          const question = estimateData.find(s => s.questions.some(q => q.id === answer.questionId));
          const option = question?.questions.find(q => q.id === answer.questionId)?.options[answer.selectedOption];
          return {
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            optionLabel: option?.label || '',
            price: option?.price || 0
          };
        });

        // 見積りデータを保存
        const estimateResult: EstimateResult = {
          answers: detailedAnswers,
          totalPrice: total,
          basePrice: BASE_INSTALLATION_PRICE,
          createdAt: new Date().toISOString()
        };

        const estimateId = saveEstimateData(estimateResult);
        
        // 既存のlocalStorageも維持（既存機能との互換性のため）
        localStorage.setItem('estimateResult', JSON.stringify({
          answers,
          totalPrice: total,
          basePrice: BASE_INSTALLATION_PRICE
        }));

        toast({
          title: "見積り完了！",
          description: "見積り内容を保存しました。確認画面に移動します。",
        });

        setLocation('/review');
      } catch (error) {
        console.error('見積りデータの保存に失敗:', error);
        toast({
          title: "保存エラー",
          description: "データの保存に失敗しました。もう一度お試しください。",
          variant: "destructive"
        });
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleHelp = (reason: string, guide: string) => {
    setHelpContent({ reason, guide });
    setShowHelp(true);
  };

  const getCurrentAnswer = () => {
    if (!currentQuestionData) return undefined;
    return answers.find(a => a.questionId === currentQuestionData.id);
  };

  const canProceed = () => {
    return getCurrentAnswer() !== undefined;
  };

  if (!isStarted) {
    return (
      <section id="estimate-wizard" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
              かんたん見積りシミュレーター
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              お部屋の情報を入力するだけで、取付工賃を自動計算いたします
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-apple-border p-4 md:p-8">
            <div className="text-center py-8 md:py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Calculator className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-apple-text mb-4">
                エアコン取付工事の見積り
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                約3分で完了します。設置条件に応じた正確な工事費用をご確認いただけます。
              </p>
              <div className="flex flex-col items-center space-y-8">
                <div className="w-full max-w-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <p className="text-sm font-medium text-gray-700">
                      標準取付工事費用
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="bg-white rounded-xl p-4 border border-white/50 shadow-sm">
                      <p className="text-red-600 font-bold text-lg mb-2 flex items-center justify-center">
                        キャンペーン特価
                      </p>
                      <div className="flex items-center justify-center space-x-3">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">通常価格</span>
                          <span className="text-lg text-gray-500 line-through">¥{ORIGINAL_PRICE.toLocaleString()}</span>
                        </div>
                        <span className="text-3xl font-bold text-primary">¥{BASE_INSTALLATION_PRICE.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <span>※設置条件により追加料金が発生する場合があります</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    setIsStarted(true);
                    setTimeout(() => {
                      if (window.innerWidth < 768 && questionCardRef.current) {
                        const y = questionCardRef.current.getBoundingClientRect().top + window.pageYOffset - 20;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      } else {
                        const estimateSection = document.getElementById('estimate-wizard');
                        if (estimateSection) {
                          const y = estimateSection.getBoundingClientRect().top + window.pageYOffset - 20;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-primary to-blue-600 text-white px-16 py-6 rounded-3xl hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl w-full max-w-sm pt-[30px] pb-[30px] text-[21px] font-bold"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>見積り開始</span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              質問 {currentStep + 1} / {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">
              {currentQuestionData?.sectionTitle}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* 質問カード直前にアンカー */}
        <div ref={questionCardRef}></div>

        {/* 質問カード */}
        {currentQuestionData && (
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-primary">質問 {currentStep + 1}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-apple-text leading-relaxed">
                    {currentQuestionData.question}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelp(currentQuestionData.help.reason, currentQuestionData.help.guide)}
                  className="text-sky-500 hover:text-sky-600 flex items-center space-x-2 bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 rounded-full px-4 py-2 border border-sky-200/50 shadow-sm"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">ヘルプ</span>
                </Button>
              </div>

              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = getCurrentAnswer()?.selectedOption === index;
                  // 「※」で分割
                  const [mainLabel, subText] = option.label.split('※');
                  return (
                    <div key={index}>
                      <button
                        onClick={() => handleOptionSelect(index)}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 transform hover:scale-[1.02] ${
                          isSelected 
                            ? 'border-primary bg-gradient-to-r from-primary/5 to-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                              isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium text-gray-800">{mainLabel}
                              {currentQuestionData.id === 'outlet-exists' && index === 1 && (
                                <span className="block text-xs text-blue-600 mt-1">
                                  ※別途費用がかかります。現地調査時にご相談となります。
                                </span>
                              )}
                            </span>
                          </div>
                          {option.price > 0 && (
                            <div className="bg-primary/10 px-3 py-1 rounded-full">
                              <span className="font-bold text-primary text-sm">
                                +¥{option.price.toLocaleString()}（税込）
                              </span>
                            </div>
                          )}
                        </div>
                        {/* サブテキストがあれば下に青字で表示 */}
                        {subText && (
                          <span className="block text-xs text-blue-600 mt-1">※{subText}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* プラン選択のときだけ商品リンクを表示 */}
              {currentQuestionData.id === 'plan-selection' && (
                <div className="mt-6 text-center">
                  <a
                    href="#product-showcase"
                    className="text-blue-600 underline hover:text-blue-800 text-sm font-medium"
                    onClick={e => {
                      e.preventDefault();
                      const el = document.getElementById('product-showcase');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    商品の詳細についてはこちら
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ナビゲーション */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 rounded-xl border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>戻る</span>
          </Button>

          <div className="text-center bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">現在の見積り金額</p>
            <p className="text-2xl font-bold text-primary">
              ¥{calculateTotal().toLocaleString()}<span className="text-sm">（税込）</span>
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-primary to-blue-600 text-white flex items-center space-x-2 rounded-xl hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>{isLastQuestion ? '見積り確認' : '次へ'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* ヘルプダイアログ */}
        <Dialog open={showHelp} onOpenChange={setShowHelp}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>この質問について</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">お伺いする理由</h4>
                <p className="text-gray-600">{helpContent.reason}</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">選び方の目安</h4>
                <p className="text-gray-600">{helpContent.guide}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
