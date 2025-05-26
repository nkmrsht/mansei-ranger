// Jicoo Webhook処理用のハンドラー
import type { Request, Response } from 'express';

// EmailJSの設定情報（Replitの環境変数から取得）
const emailJSConfig = {
  serviceId: process.env.EMAILJS_SERVICE_ID || "your_service_id",
  templateId: process.env.EMAILJS_TEMPLATE_ID || "your_template_id", 
  publicKey: process.env.EMAILJS_PUBLIC_KEY || "your_public_key"
};

// 設定チェック関数
function isEmailJSConfigured(): boolean {
  return emailJSConfig.serviceId !== "your_service_id" &&
         emailJSConfig.templateId !== "your_template_id" &&
         emailJSConfig.publicKey !== "your_public_key" &&
         Boolean(emailJSConfig.serviceId) &&
         Boolean(emailJSConfig.templateId) &&
         Boolean(emailJSConfig.publicKey);
}

export interface JicooWebhookData {
  event: string;
  data: {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    timezone: string;
    location?: string;
    description?: string;
    attendees: Array<{
      name: string;
      email: string;
      status: string;
    }>;
    host: {
      name: string;
      email: string;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface EstimateWebhookData {
  estimateId?: string;
  customerEmail?: string;
  answers: Array<{
    questionId: string;
    selectedOption: number;
    optionLabel: string;
    price: number;
  }>;
  totalPrice: number;
  basePrice: number;
  createdAt: string;
}

// EmailJS送信用の関数
async function sendConfirmationEmail(jicooData: JicooWebhookData, estimateData?: EstimateWebhookData): Promise<boolean> {
  try {
    // EmailJS設定チェック
    if (!isEmailJSConfigured()) {
      console.warn('EmailJS設定が不完全です:', {
        serviceId: emailJSConfig.serviceId === "your_service_id" ? '未設定' : '設定済み',
        templateId: emailJSConfig.templateId === "your_template_id" ? '未設定' : '設定済み',
        publicKey: emailJSConfig.publicKey === "your_public_key" ? '未設定' : '設定済み'
      });
      return false;
    }
    
    const customer = jicooData.data.attendees[0]; // 最初の参加者をお客様とする
    const reservationDate = new Date(jicooData.data.start_time);
    
    const emailData = {
      service_id: emailJSConfig.serviceId,
      template_id: emailJSConfig.templateId,
      user_id: emailJSConfig.publicKey,
      template_params: {
        to_email: customer?.email || 'info@d-mansei.co.jp',
        customer_name: customer?.name || 'お客様',
        reservation_id: jicooData.data.id,
        reservation_date: reservationDate.toLocaleDateString('ja-JP'),
        reservation_time: reservationDate.toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        estimate_total: estimateData ? `¥${estimateData.totalPrice.toLocaleString()}` : '未設定',
        estimate_details: estimateData ? generateEstimateDetails(estimateData) : '見積もりデータなし',
        created_at: new Date().toLocaleString('ja-JP'),
        company_name: '電化のマンセイ',
        company_address: '〒270-2241 千葉県松戸市松戸新田24',
        company_phone: '047-364-8112',
        company_hours: '9:00〜18:00（土日祝休み）',
        line_url: 'https://lin.ee/0OsWYCs',
        contact_url: 'https://d-mansei.co.jp/contact'
      }
    };

    console.log('EmailJS送信中...', {
      serviceId: emailJSConfig.serviceId,
      templateId: emailJSConfig.templateId,
      customerEmail: customer?.email
    });

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      console.log('EmailJS送信成功');
      return true;
    } else {
      const errorText = await response.text();
      console.error('EmailJS送信失敗:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return false;
    }
  } catch (error) {
    console.error('EmailJS送信エラー:', error);
    return false;
  }
}

// Web3Forms送信用の代替関数
async function sendConfirmationEmailWeb3Forms(jicooData: JicooWebhookData, estimateData?: EstimateWebhookData): Promise<boolean> {
  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey || accessKey === "your_access_key") {
      console.warn('Web3Forms設定が不完全です:', {
        accessKey: accessKey ? '設定済み' : '未設定'
      });
      return false;
    }
    
    const customer = jicooData.data.attendees[0];
    const reservationDate = new Date(jicooData.data.start_time);
    
    const emailContent = generateEmailTemplate(jicooData, estimateData);
    
    console.log('Web3Forms送信中...', {
      customerEmail: customer?.email,
      hasAccessKey: Boolean(accessKey)
    });
    
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: customer?.name || 'お客様',
        email: customer?.email || 'info@d-mansei.co.jp',
        subject: 'エアコン取付工事 見積り・予約完了のお知らせ',
        message: emailContent,
        from_name: '電化のマンセイ',
        replyto: 'info@d-mansei.co.jp',
      }),
    });

    if (response.ok) {
      console.log('Web3Forms送信成功');
      return true;
    } else {
      const errorText = await response.text();
      console.error('Web3Forms送信失敗:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return false;
    }
  } catch (error) {
    console.error('Web3Forms送信エラー:', error);
    return false;
  }
}

// メールテンプレート生成
function generateEmailTemplate(jicooData: JicooWebhookData, estimateData?: EstimateWebhookData): string {
  const customer = jicooData.data.attendees[0];
  const reservationDate = new Date(jicooData.data.start_time);
  
  let estimateDetails = '';
  if (estimateData) {
    estimateDetails = `
■ 見積り内容
─────────────────────────────────
作成日時：${new Date(estimateData.createdAt).toLocaleString('ja-JP')}

基本取付工事費：¥${estimateData.basePrice.toLocaleString()} (税込)

${generateEstimateDetails(estimateData)}

合計金額：¥${estimateData.totalPrice.toLocaleString()} (税込)
─────────────────────────────────`;
  } else {
    estimateDetails = `
■ 見積り内容
─────────────────────────────────
事前に見積りデータが作成されていません。
当日現地確認にて詳細をお見積りいたします。
─────────────────────────────────`;
  }

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
　エアコン取付工事　予約完了のお知らせ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${customer?.name || 'お客様'}

この度は電化のマンセイにご予約をいただき、
誠にありがとうございます。

${estimateDetails}

■ 予約情報
─────────────────────────────────
予約ID：${jicooData.data.id}
工事予定日：${reservationDate.toLocaleDateString('ja-JP')}
工事時間：${reservationDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
予約完了日：${new Date().toLocaleString('ja-JP')}
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
function generateEstimateDetails(estimateData: EstimateWebhookData): string {
  const additionalItems = estimateData.answers.filter(answer => answer.price > 0);
  
  if (additionalItems.length > 0) {
    let details = '追加工事・オプション：\n';
    additionalItems.forEach(item => {
      details += `・${item.optionLabel}：¥${item.price.toLocaleString()} (税込)\n`;
    });
    return details;
  } else {
    return '追加工事：なし\n';
  }
}

// Jicoo Webhookハンドラー
export async function handleJicooWebhook(req: Request, res: Response) {
  try {
    console.log('Jicoo Webhook受信:', JSON.stringify(req.body, null, 2));
    
    const jicooData: JicooWebhookData = req.body;
    
    // 予約完了イベントのみ処理
    if (jicooData.event !== 'booking.created' && jicooData.event !== 'appointment.booked') {
      console.log('処理対象外のイベント:', jicooData.event);
      return res.status(200).json({ 
        success: true, 
        message: 'Event received but not processed',
        event: jicooData.event 
      });
    }

    // 見積りデータの取得（クエリパラメータまたはヘッダーから）
    const estimateId = req.query.estimate_id as string || req.headers['x-estimate-id'] as string;
    let estimateData: EstimateWebhookData | undefined;

    if (estimateId) {
      // 実際の実装では、データベースやストレージから見積りデータを取得
      // ここでは簡単なログ出力のみ
      console.log('見積りID:', estimateId);
      // estimateData = await getEstimateData(estimateId);
    }

    // お客様情報のバリデーション
    if (!jicooData.data.attendees || jicooData.data.attendees.length === 0) {
      console.error('お客様情報がありません');
      return res.status(400).json({ 
        success: false, 
        error: 'No customer information found' 
      });
    }

    const customer = jicooData.data.attendees[0];
    console.log('お客様情報:', {
      name: customer.name,
      email: customer.email,
      reservationDate: jicooData.data.start_time
    });

    // 確認メール送信（EmailJSまたはWeb3Formsを使用）
    let emailSuccess = false;
    
    console.log('メール送信設定確認:', {
      emailJSConfigured: isEmailJSConfigured(),
      web3FormsConfigured: Boolean(process.env.WEB3FORMS_ACCESS_KEY && process.env.WEB3FORMS_ACCESS_KEY !== "your_access_key"),
      emailJSServiceId: emailJSConfig.serviceId === "your_service_id" ? '未設定' : '設定済み',
      web3FormsKey: process.env.WEB3FORMS_ACCESS_KEY ? '設定済み' : '未設定'
    });
    
    // EmailJSを優先して使用
    if (isEmailJSConfigured()) {
      console.log('EmailJSでメール送信中...');
      emailSuccess = await sendConfirmationEmail(jicooData, estimateData);
    } 
    // EmailJSが設定されていない場合はWeb3Formsを試行
    else if (process.env.WEB3FORMS_ACCESS_KEY && process.env.WEB3FORMS_ACCESS_KEY !== "your_access_key") {
      console.log('Web3Formsでメール送信中...');
      emailSuccess = await sendConfirmationEmailWeb3Forms(jicooData, estimateData);
    } 
    // どちらも設定されていない場合
    else {
      console.warn('メール送信設定がありません。EmailJSまたはWeb3FormsのAPIキーが必要です。');
    }

    // レスポンス返却
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        reservationId: jicooData.data.id,
        customerName: customer.name,
        customerEmail: customer.email,
        reservationDate: jicooData.data.start_time,
        emailSent: emailSuccess,
        estimateId: estimateId || null
      }
    });

  } catch (error) {
    console.error('Webhook処理エラー:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}