import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Edit3 } from "lucide-react";
import { estimateData, BASE_INSTALLATION_PRICE, type EstimateAnswer } from "@shared/estimate-schema";

interface EstimateResult {
  answers: EstimateAnswer[];
  totalPrice: number;
  basePrice: number;
}

export default function Review() {
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('estimateResult');
    if (stored) {
      setEstimateResult(JSON.parse(stored));
    }
  }, []);

  if (!estimateResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-apple-text mb-6">
              見積りデータが見つかりません
            </h1>
            <p className="text-gray-600 mb-8">
              先に見積りシミュレーターをご利用ください。
            </p>
            <Link href="/">
              <Button className="bg-primary text-white">
                ホームに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 全質問を平坦化
  const allQuestions = estimateData.flatMap(section => 
    section.questions.map(q => ({ ...q, sectionTitle: section.title }))
  );

  // 回答詳細を取得
  const getAnswerDetails = () => {
    return estimateResult.answers.map(answer => {
      const question = allQuestions.find(q => q.id === answer.questionId);
      if (!question) return null;
      
      const selectedOption = question.options[answer.selectedOption];
      return {
        sectionTitle: question.sectionTitle,
        question: question.question,
        selectedOption: selectedOption.label,
        price: selectedOption.price,
        questionId: answer.questionId
      };
    }).filter(Boolean);
  };

  const answerDetails = getAnswerDetails();
  const additionalCosts = answerDetails.filter(item => item!.price > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            見積り内容の確認
          </h1>
        </div>

        {/* 見積り総額 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-apple-text mb-2">
                お見積り完了
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                エアコン取付工事の総額は以下の通りです
              </p>
              <div className="text-5xl font-bold text-primary mb-6">
                ¥{estimateResult.totalPrice.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                ※表示価格は税込みです。追加料金は一切ございません。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 料金内訳 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>料金内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 基本工事費 */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <span className="font-medium">標準取付工事費</span>
                  <p className="text-sm text-gray-600">室内機・室外機の取付、配管接続など</p>
                </div>
                <span className="font-bold">¥{BASE_INSTALLATION_PRICE.toLocaleString()}</span>
              </div>

              {/* 追加工事費 */}
              {additionalCosts.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <span className="font-medium">{item!.selectedOption}</span>
                    <p className="text-sm text-gray-600">{item!.question}</p>
                  </div>
                  <span className="font-bold text-primary">+¥{item!.price.toLocaleString()}</span>
                </div>
              ))}

              {additionalCosts.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  追加工事費はございません
                </div>
              )}

              {/* 合計 */}
              <div className="flex justify-between items-center py-4 border-t-2 border-gray-300 text-lg font-bold">
                <span>合計金額</span>
                <span className="text-primary">¥{estimateResult.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 選択内容の詳細 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ご選択いただいた内容</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {estimateData.map(section => {
                const sectionAnswers = answerDetails.filter(item => item!.sectionTitle === section.title);
                if (sectionAnswers.length === 0) return null;

                return (
                  <div key={section.id}>
                    <h4 className="font-bold text-lg mb-3 text-primary">{section.title}</h4>
                    <div className="space-y-2">
                      {sectionAnswers.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item!.question}</p>
                              <p className="text-primary">{item!.selectedOption}</p>
                            </div>
                            <span className="text-sm text-gray-600">
                              {item!.price > 0 ? `+¥${item!.price.toLocaleString()}` : '¥0'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto flex items-center space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>見積りを修正する</span>
            </Button>
          </Link>
          <Link href="/schedule">
            <Button className="bg-primary text-white w-full sm:w-auto px-8 py-3 hover:bg-primary/90">
              この内容で予約に進む
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
