// 統合メール送信サービス
import { SavedEstimateData } from './estimate-storage';

export interface EmailData {
  estimateData: SavedEstimateData['estimateData'];
  reservationData: SavedEstimateData['reservationData'];
  customerEmail?: string;
  customerName?: string;
}

// メール送信（Web3Forms使用）
export async function sendIntegratedEmail(data: EmailData): Promise<boolean> {
  try {
    const emailContent = generateEmailTemplate(data);
    
    // Web3Formsのエンドポイント（アクセスキーが必要）
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, // 環境変数から取得
        name: data.customerName || 'お客様',
        email: data.customerEmail || 'info@d-mansei.co.jp',
        subject: 'エアコン取付工事 見積り・予約完了のお知らせ',
        message: emailContent,
        from_name: '電化のマンセイ',
        replyto: 'info@d-mansei.co.jp',
      }),
    });

    if (response.ok) {
      console.log('メール送信成功');
      return true;
    } else {
      console.error('メール送信失敗:', response.status);
      return false;
    }
  } catch (error) {
    console.error('メール送信エラー:', error);
    return false;
  }
}

// EmailJS使用の代替関数
export async function sendEmailWithEmailJS(data: EmailData): Promise<boolean> {
  try {
    // EmailJSの動的インポート
    const emailjs = await import('@emailjs/browser');
    
    const templateParams = {
      customer_name: data.customerName || 'お客様',
      customer_email: data.customerEmail || 'info@d-mansei.co.jp',
      estimate_total: data.estimateData.totalPrice.toLocaleString(),
      estimate_details: generateEstimateDetails(data.estimateData),
      reservation_date: data.reservationData?.date || '未設定',
      reservation_time: data.reservationData?.time || '未設定',
      created_at: new Date(data.estimateData.createdAt).toLocaleString('ja-JP'),
    };

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log('EmailJS送信成功:', result);
    return true;
  } catch (error) {
    console.error('EmailJS送信エラー:', error);
    return false;
  }
}

// メールテンプレートの生成
function generateEmailTemplate(data: EmailData): string {
  const estimateDetails = generateEstimateDetails(data.estimateData);
  
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
　エアコン取付工事　見積り・予約完了のお知らせ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.customerName || 'お客様'}

この度は電化のマンセイにお見積り・ご予約をいただき、
誠にありがとうございます。

■ 見積り内容
─────────────────────────────────
作成日時：${new Date(data.estimateData.createdAt).toLocaleString('ja-JP')}

${estimateDetails}

合計金額：￥${data.estimateData.totalPrice.toLocaleString()} (税込)
─────────────────────────────────

■ 予約情報
─────────────────────────────────
工事予定日：${data.reservationData?.date || '調整中'}
工事時間：${data.reservationData?.time || '調整中'}
予約完了日：${data.reservationData?.completedAt ? new Date(data.reservationData.completedAt).toLocaleString('ja-JP') : '処理中'}
─────────────────────────────────

■ 今後の流れ
1. 工事日前日に担当者よりお電話でご連絡いたします
2. 当日は時間通りにお伺いいたします
3. 現地確認後、最終金額をご提示いたします

■ ご注意事項
・現地の状況により追加工事が必要な場合があります
・悪天候の場合は日程を調整させていただく場合があります

■ お問い合わせ
電化のマンセイ
〒270-2241 千葉県松戸市松戸新田24
営業時間：9:00〜18:00（土日祝休み）
LINE：https://lin.ee/0OsWYCs
メール：https://d-mansei.co.jp/contact

ご不明な点がございましたら、お気軽にお問い合わせください。
当日お会いできることを楽しみにしております。

電化のマンセイ スタッフ一同
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

// 見積り詳細の生成
function generateEstimateDetails(estimateData: SavedEstimateData['estimateData']): string {
  let details = `基本取付工事費：￥${estimateData.basePrice.toLocaleString()} (税込)\n\n`;
  
  const additionalItems = estimateData.answers.filter(answer => answer.price > 0);
  
  if (additionalItems.length > 0) {
    details += '追加工事・オプション：\n';
    additionalItems.forEach(item => {
      details += `・${item.optionLabel}：￥${item.price.toLocaleString()} (税込)\n`;
    });
  } else {
    details += '追加工事：なし\n';
  }
  
  return details;
}

// リトライ機能付きメール送信
export async function sendEmailWithRetry(
  data: EmailData, 
  maxRetries: number = 3,
  useEmailJS: boolean = false
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`メール送信試行 ${attempt}/${maxRetries}`);
      
      const success = useEmailJS 
        ? await sendEmailWithEmailJS(data)
        : await sendIntegratedEmail(data);
      
      if (success) {
        console.log(`メール送信成功 (試行${attempt})`);
        return true;
      }
    } catch (error) {
      console.error(`メール送信失敗 (試行${attempt}):`, error);
    }
    
    // 最後の試行でなければ待機
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  console.error(`メール送信失敗 (${maxRetries}回試行)`);
  return false;
}