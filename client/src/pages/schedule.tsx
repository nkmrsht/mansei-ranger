import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentEstimateData, updateReservationData, markEmailSent } from "@/lib/estimate-storage";
import { sendEmailWithRetry } from "@/lib/email-service";
import { useToast } from "@/hooks/use-toast";

export default function Schedule() {
  const { toast } = useToast();
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent' | 'failed'>('pending');
  const [estimateData, setEstimateData] = useState<any>(null);
  const [jicooUrl, setJicooUrl] = useState<string>('');

  useEffect(() => {
    // 見積りデータを取得
    const data = getCurrentEstimateData();
    setEstimateData(data);

    // 見積りIDを含むJicoo URLを生成
    const baseJicooUrl = 'https://www.jicoo.com/event_types/o-P4XTBDZeLW/widget';
    const estimateId = data?.id;
    const webhookUrl = 'https://mansei-ranger.replit.dev/api/webhook/jicoo';
    
    let dynamicUrl = baseJicooUrl;
    if (estimateId) {
      // 見積りIDとWebhook URLをクエリパラメータとして追加
      dynamicUrl = `${baseJicooUrl}?estimate_id=${estimateId}&webhook_url=${encodeURIComponent(webhookUrl)}`;
      console.log('動的Jicoo URL生成:', dynamicUrl);
    }
    setJicooUrl(dynamicUrl);

    // Jicooウィジェットのスクリプトを動的に読み込み
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.jicoo.com/widget/event_type.js';
    script.async = true;
    document.head.appendChild(script);

    // Jicooからの予約完了イベントを監視
    const handleJicooMessage = async (event: MessageEvent) => {
      // Jicooからのメッセージかチェック
      if (event.origin !== 'https://www.jicoo.com') return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        console.log('🔔 Jicooからのメッセージ受信:', data);
        
        // 予約完了イベントを検知
        if (data.type === 'booking_completed' || data.event === 'booking_success' || data.type === 'booking_created') {
          console.log('✅ Jicoo予約完了を検知:', data);
          
          // 予約データを更新
          const reservationData = {
            date: data.date || data.scheduledDate || new Date().toISOString().split('T')[0],
            time: data.time || data.scheduledTime || '調整中',
            customerInfo: data.customer || data.user || {},
            jicooEventId: data.eventId || data.bookingId || '',
            completedAt: new Date().toISOString()
          };

          const updateSuccess = updateReservationData(reservationData);
          
          if (updateSuccess) {
            toast({
              title: "予約完了！",
              description: "工事日程の予約が完了しました。統合メールを送信中...",
            });

            // 統合メール送信
            await sendIntegratedEmail(reservationData);
          }
        }
      } catch (error) {
        console.error('Jicooメッセージ処理エラー:', error);
      }
    };

    // 統合メール送信処理
    const sendIntegratedEmail = async (reservationData: any) => {
      try {
        setEmailStatus('sending');
        
        const currentData = getCurrentEstimateData();
        if (!currentData) {
          throw new Error('見積りデータが見つかりません');
        }

        const emailData = {
          estimateData: currentData.estimateData,
          reservationData: reservationData,
          customerEmail: reservationData.customerInfo?.email || '',
          customerName: reservationData.customerInfo?.name || ''
        };

        const emailSuccess = await sendEmailWithRetry(emailData, 3);
        
        if (emailSuccess) {
          markEmailSent();
          setEmailStatus('sent');
          toast({
            title: "メール送信完了！",
            description: "見積り・予約完了のお知らせをお送りしました。",
          });
        } else {
          setEmailStatus('failed');
          toast({
            title: "メール送信失敗",
            description: "メール送信に失敗しました。お問い合わせください。",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('統合メール送信エラー:', error);
        setEmailStatus('failed');
        toast({
          title: "送信エラー",
          description: "システムエラーが発生しました。",
          variant: "destructive"
        });
      }
    };

    window.addEventListener('message', handleJicooMessage);

    return () => {
      // クリーンアップ
      window.removeEventListener('message', handleJicooMessage);
      const existingScript = document.querySelector('script[src="https://www.jicoo.com/widget/event_type.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [toast]);
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/review">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              見積り確認に戻る
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            工事日程の予約
          </h1>
        </div>

        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-apple-text mb-4">
                ご希望の工事日程をお選びください
              </h2>
              <p className="text-gray-600 mb-6">
                下記のカレンダーからご都合の良い日時をお選びいただけます。お急ぎの場合はお気軽にお問い合わせください。
              </p>
              
              {/* メール送信ステータス表示 */}
              {emailStatus !== 'pending' && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${
                  emailStatus === 'sent' ? 'bg-green-50 text-green-700' :
                  emailStatus === 'sending' ? 'bg-blue-50 text-blue-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {emailStatus === 'sent' && <CheckCircle className="w-5 h-5" />}
                  {emailStatus === 'sending' && <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />}
                  {emailStatus === 'failed' && <AlertCircle className="w-5 h-5" />}
                  <span className="font-medium">
                    {emailStatus === 'sent' && '予約完了メールを送信しました'}
                    {emailStatus === 'sending' && 'メールを送信中...'}
                    {emailStatus === 'failed' && 'メール送信に失敗しました'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Jicoo Widget */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {jicooUrl ? (
                <div 
                  className="jicoo-widget" 
                  data-url={jicooUrl}
                  style={{minWidth: '320px', height: '720px', border: '1px solid #e4e4e4', boxSizing: 'content-box'}}
                ></div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">予約システムを読み込み中...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
