import { useState } from "react";
import { Calculator, ArrowRight, ArrowLeft, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { estimateData, BASE_INSTALLATION_PRICE, ORIGINAL_PRICE, type EstimateAnswer } from "@shared/estimate-schema";

export default function EstimateWizard() {
  const [, setLocation] = useLocation();
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<EstimateAnswer[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [helpContent, setHelpContent] = useState({ reason: "", guide: "" });

  // 全質問を平坦化
  const allQuestions = estimateData.flatMap(section => 
    section.questions.map(q => ({ ...q, sectionTitle: section.title }))
  );

  const currentQuestionData = allQuestions[currentStep];
  const isLastQuestion = currentStep === allQuestions.length - 1;

  // 料金計算
  const calculateTotal = () => {
    let total = BASE_INSTALLATION_PRICE;
    answers.forEach(answer => {
      const question = allQuestions.find(q => q.id === answer.questionId);
      if (question) {
        const option = question.options[answer.selectedOption];
        total += option.price;
        // カスタム値がある場合（延長料金など）
        if (answer.customValue) {
          total += answer.customValue;
        }
      }
    });
    return total;
  };

  const handleOptionSelect = (optionIndex: number) => {
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
      // 見積り完了 - 確認画面へ
      const total = calculateTotal();
      // ここで見積り結果をstateやlocalStorageに保存
      localStorage.setItem('estimateResult', JSON.stringify({
        answers,
        totalPrice: total,
        basePrice: BASE_INSTALLATION_PRICE
      }));
      setLocation('/review');
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

          <div className="bg-white rounded-3xl shadow-lg border border-apple-border p-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Calculator className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-apple-text mb-4">
                エアコン取付工事の見積り
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                約3分で完了します。設置条件に応じた正確な工事費用をご確認いただけます。
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-apple-border">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>標準取付工事費用</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>キャンペーン特価：</strong> <span className="text-lg font-bold text-primary">¥{BASE_INSTALLATION_PRICE.toLocaleString()}</span> 
                    <span className="text-gray-500 line-through ml-2">¥{ORIGINAL_PRICE.toLocaleString()}</span><br />
                    <small>※設置条件により追加料金が発生する場合があります</small>
                  </p>
                </div>
                <Button 
                  onClick={() => setIsStarted(true)}
                  className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  見積り開始
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
              質問 {currentStep + 1} / {allQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {currentQuestionData.sectionTitle}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / allQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-apple-text">
                {currentQuestionData.question}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleHelp(currentQuestionData.help.reason, currentQuestionData.help.guide)}
                className="text-sky-400 hover:text-sky-600 flex items-center space-x-1 bg-sky-50 hover:bg-sky-100 rounded-full px-3 py-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-medium">ヘルプ</span>
              </Button>
            </div>

            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => {
                const isSelected = getCurrentAnswer()?.selectedOption === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{option.label}</span>
                      {option.price > 0 && (
                        <span className="font-bold text-primary">
                          +¥{option.price.toLocaleString()}（税込）
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>戻る</span>
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">現在の見積り金額</p>
            <p className="text-2xl font-bold text-primary">
              ¥{calculateTotal().toLocaleString()}
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-primary text-white flex items-center space-x-2"
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
