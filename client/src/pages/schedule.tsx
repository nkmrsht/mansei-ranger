import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentEstimateData, updateReservationData, markEmailSent } from "@/lib/estimate-storage";
import { useToast } from "@/hooks/use-toast";
// EmailJSはCDNから読み込み
declare global {
  interface Window {
    emailjs: any;
  }
}

export default function Schedule() {
  const { toast } = useToast();
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent' | 'failed'>('pending');
  const [estimateData, setEstimateData] = useState<any>(null);
  const [jicooUrl, setJicooUrl] = useState<string>('');
  const [lastBookingData, setLastBookingData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);

  // EmailJS設定
  const EMAILJS_CONFIG = {
    serviceId: 'service_4s1vpt5',
    templateId: 'template_7ub57zd',
    publicKey: 'J7015dA3yFurGOZbA'
  };

  useEffect(() => {
    // 見積りデータを取得
    const data = getCurrentEstimateData();
    setEstimateData(data);

    // Jicoo URLを生成（見積りIDをWebhookで使用）
    const baseJicooUrl = 'https://www.jicoo.com/event_types/o-P4XTBDZeLW/widget';
    const estimateId = data?.id;
    
    let dynamicUrl = baseJicooUrl;
    if (estimateId) {
      // 見積りIDをWebhookで識別できるようにパラメータ追加
      dynamicUrl = `${baseJicooUrl}?estimate_id=${estimateId}`;
      console.log('Jicoo URL生成（見積りID付き）:', dynamicUrl);
    }
    setJicooUrl(dynamicUrl);

    // EmailJS CDNスクリプトを読み込み
    const emailjsScript = document.createElement('script');
    emailjsScript.type = 'text/javascript';
    emailjsScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    emailjsScript.async = true;
    document.head.appendChild(emailjsScript);

    // Jicooウィジェットのスクリプトを動的に読み込み
    const jicooScript = document.createElement('script');
    jicooScript.type = 'text/javascript';
    jicooScript.src = 'https://www.jicoo.com/widget/event_type.js';
    jicooScript.async = true;
    document.head.appendChild(jicooScript);

    // オプションから質問を推測する関数
    const getQuestionForOption = (optionLabel: string) => {
      if (optionLabel.includes('階')) return 'エアコンの設置場所はどちらですか？';
      if (optionLabel.includes('台')) return '室外機の設置台について教えてください';
      if (optionLabel.includes('穴')) return '穴あけ工事について教えてください';
      if (optionLabel.includes('m')) return '配管の距離はどのくらいですか？';
      if (optionLabel.includes('回路')) return '電気工事について教えてください';
      if (optionLabel.includes('用意')) return '室外機の設置台について教えてください';
      return 'その他のオプションについて';
    };

    // 見積り詳細生成関数（質問+回答版）
    const generateEstimateDetails = (estimateData: any) => {
      if (!estimateData || !estimateData.answers) {
        return '事前に見積りデータが作成されていません。当日現地確認にて詳細をお見積りいたします。';
      }
      
      let details = `基本取付工事費：￥${estimateData.basePrice?.toLocaleString() || '15,000'} (税込)\n\n`;
      details += '■ ご選択いただいた内容\n';
      details += '─────────────────────────\n';
      
      // 0円を含む全てのオプションを表示
      const allItems = estimateData.answers.filter((answer: any) => answer.optionLabel && answer.optionLabel.trim() !== '');
      
      if (allItems.length > 0) {
        allItems.forEach((item: any, index: number) => {
          const price = item.price > 0 ? `（￥${item.price.toLocaleString()}）` : '（無料）';
          details += `Q${index + 1}. ${getQuestionForOption(item.optionLabel)}\n`;
          details += `A${index + 1}. ${item.optionLabel} ${price}\n\n`;
        });
      }
      
      details += '─────────────────────────\n';
      return details;
    };

    // Webhookからの予約データをポーリングで取得（改善版）
    const pollForBookingData = () => {
      if (!estimateId || isPolling) {
        console.log('ポーリング開始条件未満:', { estimateId, isPolling });
        return;
      }
      
      setIsPolling(true);
      console.log('🔄 予約データのポーリング開始:', estimateId);
      
      let pollCount = 0;
      const maxPolls = 60; // 最大60回（3分間）
      
      const pollInterval = setInterval(async () => {
        pollCount++;
        
        try {
          // Webhookで処理された予約データを取得
          const response = await fetch(`/api/booking-status/${estimateId}`);
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.bookingData) {
              console.log('✅ Webhook経由の予約データを取得:', result.bookingData);
              
              const bookingData = result.bookingData;
          const reservationData = {
                date: new Date(bookingData.start_at).toLocaleDateString('ja-JP'),
                time: new Date(bookingData.start_at).toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                customerInfo: {
                  name: bookingData.attendee?.name || '予約者様',
                  email: bookingData.attendee?.email || 'customer@example.com',
                  phone: bookingData.attendee?.phone || ''
                },
                jicooEventId: bookingData.id,
            completedAt: new Date().toISOString()
          };

          setLastBookingData(reservationData);
              updateReservationData(reservationData);
          
            toast({
              title: "予約完了！",
                description: `${reservationData.customerInfo.name}様の予約を確認しました。統合メールを送信中...`,
            });

            // 統合メール送信
            await sendIntegratedEmail(reservationData);
              
              // ポーリング停止
              clearInterval(pollInterval);
              setIsPolling(false);
              return;
            }
          }
          
          // 最大回数に達したらポーリング停止
          if (pollCount >= maxPolls) {
            console.log('⏰ ポーリング終了（最大回数到達）');
            clearInterval(pollInterval);
            setIsPolling(false);
          }
          
        } catch (error) {
          console.log(`ポーリングエラー (${pollCount}/${maxPolls}):`, error);
          
          // エラーが続く場合はポーリング停止
          if (pollCount >= 5) {
            console.log('❌ ポーリング停止（エラー多発）');
            clearInterval(pollInterval);
            setIsPolling(false);
          }
        }
      }, 3000); // 3秒ごとにチェック

      // 安全のため5分後に強制停止
      setTimeout(() => {
        if (isPolling) {
          clearInterval(pollInterval);
          setIsPolling(false);
          console.log('⏰ ポーリング強制終了（タイムアウト）');
        }
      }, 300000);
    };

    // EmailJS統合メール送信処理
    const sendIntegratedEmail = async (reservationData: any) => {
      try {
        setEmailStatus('sending');
        
        const currentData = getCurrentEstimateData();
        if (!currentData) {
          throw new Error('見積りデータが見つかりません');
        }

        console.log('📧 EmailJS統合メール送信開始:', {
          customerEmail: reservationData.customerInfo?.email,
          customerName: reservationData.customerInfo?.name,
          serviceId: EMAILJS_CONFIG.serviceId
        });

            // EmailJS初期化
        if (!window.emailjs) {
          throw new Error('EmailJS CDNが読み込まれていません');
        }
        window.emailjs.init(EMAILJS_CONFIG.publicKey);
            
        // メールテンプレート用データ準備
            const templateParams = {
          // 顧客情報
          customer_name: reservationData.customerInfo?.name || 'お客様',
          customer_email: reservationData.customerInfo?.email || 'customer@example.com',
          customer_phone: reservationData.customerInfo?.phone || '',
          
          // 予約情報
              booking_date: reservationData.date || '調整中',
              booking_time: reservationData.time || '調整中',
          booking_id: reservationData.jicooEventId || '',
          booking_completed_at: new Date().toLocaleString('ja-JP'),
          
          // 見積り情報
          estimate_created_at: new Date(currentData.estimateData.createdAt).toLocaleString('ja-JP'),
          base_price: currentData.estimateData.basePrice?.toLocaleString() || '15,000',
          total_price: currentData.estimateData.totalPrice?.toLocaleString() || '要見積',
          estimate_details: generateEstimateDetails(currentData.estimateData),
          
          // 管理者情報
          admin_email: 'manseijaaa@gmail.com',
          
          // 会社情報
          company_name: '電化のマンセイ',
          company_address: '〒270-2241 千葉県松戸市松戸新田24',
          company_hours: '9:00〜18:00（土日祝休み）',
          company_line: 'https://lin.ee/0OsWYCs',
          company_contact: 'https://d-mansei.co.jp/contact'
        };

        console.log('📤 EmailJSテンプレートパラメータ:', {
          customer_name: templateParams.customer_name,
          customer_email: templateParams.customer_email,
          booking_date: templateParams.booking_date,
          booking_time: templateParams.booking_time,
          total_price: templateParams.total_price
        });

        // EmailJSでメール送信（顧客と管理者の両方に送信）
        const response = await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          templateParams
        );

        console.log('✅ EmailJS送信成功:', response);

        markEmailSent();
        setEmailStatus('sent');
        
        toast({
          title: "メール送信完了！",
          description: "見積り・予約完了のお知らせを顧客・管理者の両方に送信しました。",
        });

      } catch (error) {
        console.error('🚨 EmailJS統合メール送信エラー:', error);
        setEmailStatus('failed');
        toast({
          title: "送信エラー",
          description: `メール送信に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
          variant: "destructive"
        });
      }
    };

    // ポーリングは手動開始のみ（自動開始を無効化）
    // setTimeout(() => {
    //   pollForBookingData();
    // }, 5000);

    return () => {
      // クリーンアップ
      setIsPolling(false);
      const existingScript = document.querySelector('script[src="https://www.jicoo.com/widget/event_type.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [toast, isPolling]);

  // オプションから質問を推測する関数
  const getQuestionForOption = (optionLabel: string) => {
    if (optionLabel.includes('階')) return 'エアコンの設置場所はどちらですか？';
    if (optionLabel.includes('台')) return '室外機の設置台について教えてください';
    if (optionLabel.includes('穴')) return '穴あけ工事について教えてください';
    if (optionLabel.includes('m')) return '配管の距離はどのくらいですか？';
    if (optionLabel.includes('回路')) return '電気工事について教えてください';
    if (optionLabel.includes('用意')) return '室外機の設置台について教えてください';
    return 'その他のオプションについて';
  };

  // 見積り詳細生成関数（質問+回答版）
  const generateEstimateDetails = (estimateData: any) => {
    if (!estimateData || !estimateData.answers) {
      return '事前に見積りデータが作成されていません。当日現地確認にて詳細をお見積りいたします。';
    }
    
    let details = `基本取付工事費：￥${estimateData.basePrice?.toLocaleString() || '15,000'} (税込)\n\n`;
    details += '■ ご選択いただいた内容\n';
    details += '─────────────────────────\n';
    
    // 0円を含む全てのオプションを表示
    const allItems = estimateData.answers.filter((answer: any) => answer.optionLabel && answer.optionLabel.trim() !== '');
    
    if (allItems.length > 0) {
      allItems.forEach((item: any, index: number) => {
        const price = item.price > 0 ? `（￥${item.price.toLocaleString()}）` : '（無料）';
        details += `Q${index + 1}. ${getQuestionForOption(item.optionLabel)}\n`;
        details += `A${index + 1}. ${item.optionLabel} ${price}\n\n`;
      });
    }
    
    details += '─────────────────────────\n';
    return details;
  };

  // EmailJS統合メール送信処理
  const sendIntegratedEmail = async (reservationData: any) => {
    try {
      setEmailStatus('sending');
      
      const currentData = getCurrentEstimateData();
      if (!currentData) {
        throw new Error('見積りデータが見つかりません');
      }

      console.log('📧 EmailJS統合メール送信開始:', {
        customerEmail: reservationData.customerInfo?.email,
        customerName: reservationData.customerInfo?.name,
        serviceId: EMAILJS_CONFIG.serviceId
      });

      // EmailJS初期化
      if (!window.emailjs) {
        throw new Error('EmailJS CDNが読み込まれていません');
      }
      window.emailjs.init(EMAILJS_CONFIG.publicKey);

      // メールテンプレート用データ準備
      const templateParams = {
        // 顧客情報
        customer_name: reservationData.customerInfo?.name || 'お客様',
        customer_email: reservationData.customerInfo?.email || 'customer@example.com',
        customer_phone: reservationData.customerInfo?.phone || '',
        
        // 予約情報
        booking_date: reservationData.date || '調整中',
        booking_time: reservationData.time || '調整中',
        booking_id: reservationData.jicooEventId || '',
        booking_completed_at: new Date().toLocaleString('ja-JP'),
        
        // 見積り情報
        estimate_created_at: new Date(currentData.estimateData.createdAt).toLocaleString('ja-JP'),
        base_price: currentData.estimateData.basePrice?.toLocaleString() || '15,000',
        total_price: currentData.estimateData.totalPrice?.toLocaleString() || '要見積',
        estimate_details: generateEstimateDetails(currentData.estimateData),
        
        // 管理者情報
        admin_email: 'manseijaaa@gmail.com',
        
        // 会社情報
        company_name: '電化のマンセイ',
        company_address: '〒270-2241 千葉県松戸市松戸新田24',
        company_hours: '9:00〜18:00（土日祝休み）',
        company_line: 'https://lin.ee/0OsWYCs',
        company_contact: 'https://d-mansei.co.jp/contact'
      };

      console.log('📤 EmailJSテンプレートパラメータ:', {
        customer_name: templateParams.customer_name,
        customer_email: templateParams.customer_email,
        booking_date: templateParams.booking_date,
        booking_time: templateParams.booking_time,
        total_price: templateParams.total_price
      });

      // EmailJSでメール送信（顧客と管理者の両方に送信）
      const response = await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('✅ EmailJS送信成功:', response);

      markEmailSent();
      setEmailStatus('sent');
      
      toast({
        title: "メール送信完了！",
        description: "見積り・予約完了のお知らせを顧客・管理者の両方に送信しました。",
      });

    } catch (error) {
      console.error('🚨 EmailJS統合メール送信エラー:', error);
      setEmailStatus('failed');
      toast({
        title: "送信エラー",
        description: `メール送信に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    }
  };

    // EmailJSテスト用関数
  const handleEmailJSTest = async () => {
    try {
      setEmailStatus('sending');
      
      console.log('🔑 EmailJS接続テスト開始:', {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        publicKey: EMAILJS_CONFIG.publicKey ? `${EMAILJS_CONFIG.publicKey.substring(0, 8)}...` : '未設定'
      });

      // EmailJS初期化
      if (!window.emailjs) {
        throw new Error('EmailJS CDNが読み込まれていません');
      }
      window.emailjs.init(EMAILJS_CONFIG.publicKey);

      // テスト用パラメータ
      const testParams = {
        customer_name: 'テスト太郎',
        customer_email: 'manseijaaa@gmail.com',
        customer_phone: '090-1234-5678',
        booking_date: new Date().toLocaleDateString('ja-JP'),
        booking_time: '14:00',
        booking_id: `test_${Date.now()}`,
        booking_completed_at: new Date().toLocaleString('ja-JP'),
        estimate_created_at: new Date().toLocaleString('ja-JP'),
        base_price: '15,000',
        total_price: '25,000',
        estimate_details: 'テスト見積り詳細',
        admin_email: 'manseijaaa@gmail.com',
        company_name: '電化のマンセイ',
        company_address: '〒270-2241 千葉県松戸市松戸新田24',
        company_hours: '9:00〜18:00（土日祝休み）',
        company_line: 'https://lin.ee/0OsWYCs',
        company_contact: 'https://d-mansei.co.jp/contact'
      };

      console.log('📤 EmailJSテストパラメータ:', {
        customer_name: testParams.customer_name,
        customer_email: testParams.customer_email,
        booking_date: testParams.booking_date,
        total_price: testParams.total_price
      });

      // EmailJSでテストメール送信
      const response = await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        testParams
      );

      console.log('✅ EmailJSテスト送信成功:', response);

      setEmailStatus('sent');
      toast({
        title: "EmailJSテスト成功！",
        description: "統合メールが正常に送信されました。メールを確認してください。",
      });

    } catch (error) {
      console.error('🚨 EmailJSテストエラー:', error);
      setEmailStatus('failed');
      toast({
        title: "EmailJSテスト失敗",
        description: `エラー: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    }
  };

  // Webhookテスト用関数
  const handleWebhookTest = async () => {
    const currentData = getCurrentEstimateData();
    if (!currentData?.id) {
      toast({
        title: "エラー",
        description: "見積りIDが見つかりません。先に見積りを作成してください。",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🔗 Webhookテスト開始 - 見積りID:', currentData.id);
      
      // テスト用の予約データを作成
      const response = await fetch(`/api/webhook/test/${currentData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      console.log('🔗 Webhookレスポンス:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Webhookテスト成功:', result);
        
        // テストデータを直接設定
        const testReservationData = {
          date: new Date(result.bookingData.start_at).toLocaleDateString('ja-JP'),
          time: new Date(result.bookingData.start_at).toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          customerInfo: {
            name: result.bookingData.attendee?.name || 'テスト花子',
            email: result.bookingData.attendee?.email || 'test.hanako@example.com',
            phone: result.bookingData.attendee?.phone || '090-1234-5678'
          },
          jicooEventId: result.bookingData.id,
          completedAt: new Date().toISOString()
        };
        
        setLastBookingData(testReservationData);
        updateReservationData(testReservationData);
        
        toast({
          title: "Webhookテスト成功！",
          description: `${testReservationData.customerInfo.name}様のテスト予約データを作成しました。`,
        });
        
      } else {
        const errorText = await response.text();
        console.error('❌ Webhookテスト失敗:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('🚨 Webhookテストエラー:', error);
      
      // ネットワークエラーの場合は、ローカルテストデータを作成
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🔄 ネットワークエラー - ローカルテストデータを作成');
        
        const fallbackReservationData = {
          date: new Date().toLocaleDateString('ja-JP'),
          time: '14:00',
          customerInfo: {
            name: 'テスト花子（ローカル）',
            email: 'test.hanako.local@example.com',
            phone: '090-1234-5678'
          },
          jicooEventId: `local_test_${Date.now()}`,
          completedAt: new Date().toISOString()
        };
        
        setLastBookingData(fallbackReservationData);
        updateReservationData(fallbackReservationData);
        
        toast({
          title: "Webhookテスト（ローカル）",
          description: "サーバー接続失敗のため、ローカルテストデータを作成しました。",
        });
      } else {
        toast({
          title: "Webhookテストエラー",
          description: `テストに失敗しました: ${error instanceof Error ? error.message : String(error)}`,
          variant: "destructive"
        });
      }
    }
  };

  // 手動メール送信テスト用関数（EmailJS使用）
  const handleManualEmailTest = async () => {
    // 常に新しいテスト用の予約データを作成
    const testReservationData = {
      date: new Date().toLocaleDateString('ja-JP'),
      time: '14:00',
      customerInfo: {
        name: 'テスト太郎',
        email: 'manseijaaa@gmail.com',
        phone: '090-1234-5678'
      },
      jicooEventId: `test_${Date.now()}`,
      completedAt: new Date().toISOString()
    };
    
    console.log('📧 統合メール送信テスト開始 - テストデータ作成:', testReservationData);
    
    setLastBookingData(testReservationData);
    updateReservationData(testReservationData);

    // EmailJS統合メール送信
    await sendIntegratedEmail(testReservationData);
  };

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
                下記のカレンダーからご都合の良い日時をお選びいただけます。予約完了後、Webhookを通じて実際の予約情報を取得し、見積り詳細と合わせて確認メールを自動送信いたします。
              </p>
              
              {/* ポーリング状況表示 */}
              {isPolling && (
                <div className="flex items-center space-x-2 p-3 rounded-lg mb-4 bg-blue-50 text-blue-700">
                  <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">
                    予約データを取得中...（最大3分間）
                  </span>
                </div>
              )}
              
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
            
            {/* テスト機能 */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🧪 EmailJS統合テスト</h3>
              <p className="text-sm text-gray-600 mb-3">
                EmailJSを使用した統合メール送信（見積り詳細+予約情報）をテストできます。
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleEmailJSTest}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  disabled={emailStatus === 'sending'}
                >
                  🔑 EmailJS接続テスト
                </Button>
                <Button 
                  onClick={handleManualEmailTest}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={emailStatus === 'sending'}
                >
                  {emailStatus === 'sending' ? '送信中...' : '📧 統合メール送信テスト'}
                </Button>
                <Button 
                  onClick={handleWebhookTest}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={isPolling}
                >
                  🔗 Webhookテスト
                </Button>
              </div>
            </div>

            {/* 予約完了検知表示 */}
            {lastBookingData && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-bold mb-2">✅ 予約完了を検知しました</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>お客様名:</strong> {lastBookingData.customerInfo?.name}</p>
                  <p><strong>メールアドレス:</strong> {lastBookingData.customerInfo?.email}</p>
                  <p><strong>予約日時:</strong> {lastBookingData.date} {lastBookingData.time}</p>
                  <p><strong>予約ID:</strong> {lastBookingData.jicooEventId}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  統合メールが自動送信されました。
                </p>
              </div>
            )}

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

