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

// Jicoo公式仕様に基づくWebhookデータ型定義
export interface JicooWebhookData {
  event_type: string; // 公式仕様では event_type
  booking: {
    id: string;
    event_type_id: string;
    start_at: string; // 公式仕様では start_at
    end_at: string;   // 公式仕様では end_at
    timezone: string;
    location?: string;
    description?: string;
    attendee: {
      name: string;
      email: string;
      phone?: string;
    };
    host: {
      name: string;
      email: string;
    };
    created_at: string;
    updated_at: string;
    canceled_at?: string;
  };
  // 旧形式との互換性のため
  event?: string;
  data?: any;
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

// Web3Forms両方向送信用関数（緊急修正版）
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
    const emailContent = generateEmailTemplate(jicooData, estimateData);
    
    let customerSuccess = false;
    let adminSuccess = false;
    
    // 1. お客様向けメール送信
    console.log('お客様向け送信中...', {
      customerEmail: customer?.email,
      hasAccessKey: Boolean(accessKey)
    });
    
    try {
      const customerResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: customer?.name || 'お客様',
          email: customer?.email,
          subject: 'エアコン取付工事 予約完了のお知らせ',
          message: emailContent,
          from_name: '電化のマンセイ',
          replyto: 'info@d-mansei.co.jp',
        }),
      });

      if (customerResponse.ok) {
        console.log('お客様向け送信完了');
        customerSuccess = true;
      } else {
        const errorText = await customerResponse.text();
        console.error('お客様向け送信失敗:', {
          status: customerResponse.status,
          error: errorText
        });
      }
    } catch (error) {
      console.error('お客様向け送信エラー:', error);
    }

    // 2. 管理者向けメール送信
    console.log('管理者向け送信中...', {
      adminEmail: 'manseijaaa@gmail.com',
      hasAccessKey: Boolean(accessKey)
    });
    
    try {
      const adminResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: '電化のマンセイ 管理者',
          email: 'manseijaaa@gmail.com',
          subject: '【管理者通知】エアコン取付工事 新規予約',
          message: emailContent,
          from_name: '電化のマンセイ',
          replyto: 'info@d-mansei.co.jp',
        }),
      });

      if (adminResponse.ok) {
        console.log('管理者向け送信完了');
        adminSuccess = true;
      } else {
        const errorText = await adminResponse.text();
        console.error('管理者向け送信失敗:', {
          status: adminResponse.status,
          error: errorText
        });
      }
    } catch (error) {
      console.error('管理者向け送信エラー:', error);
    }

    // 結果の返却
    const overallSuccess = customerSuccess || adminSuccess; // 少なくとも1つ成功すればOK
    console.log('両方向送信結果:', {
      customer: customerSuccess ? '成功' : '失敗',
      admin: adminSuccess ? '成功' : '失敗',
      overall: overallSuccess ? '成功' : '失敗'
    });
    
    return overallSuccess;
    
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

// Jicoo公式仕様準拠 Webhookハンドラー
export async function handleJicooWebhook(req: Request, res: Response) {
  try {
    const timestamp = new Date().toISOString();
    console.log(`🔔 [${timestamp}] Jicoo Webhook受信 START =================`);
    console.log('📝 リクエストヘッダー:', JSON.stringify(req.headers, null, 2));
    console.log('📝 クエリパラメータ:', JSON.stringify(req.query, null, 2));
    console.log('📝 リクエストボディ:', JSON.stringify(req.body, null, 2));
    console.log('🔔 Webhook受信詳細情報 END ===================');
    
    // Jicoo公式仕様とテスト用の両方に対応
    let jicooData: JicooWebhookData;
    let eventType: string;
    let bookingData: any;
    
    // 公式仕様の形式をチェック
    if (req.body.event_type && req.body.booking) {
      console.log('✅ Jicoo公式仕様形式を検出');
      eventType = req.body.event_type;
      bookingData = req.body.booking;
      console.log('公式仕様 eventType:', eventType);
    } 
    // テスト用の旧形式にも対応
    else if (req.body.event && req.body.data) {
      console.log('✅ テスト用旧形式を検出');
      eventType = req.body.event;
      bookingData = {
        id: req.body.data.id,
        start_at: req.body.data.start_time,
        end_at: req.body.data.end_time,
        timezone: req.body.data.timezone,
        attendee: req.body.data.attendees?.[0] || {},
        host: req.body.data.host || {},
        created_at: req.body.data.created_at,
        updated_at: req.body.data.updated_at
      };
    } else {
      console.error('❌ 不明なWebhook形式:', req.body);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid webhook format' 
      });
    }
    
    // 対応するイベントタイプをチェック
    console.log('受信イベントタイプ:', eventType);
    if (eventType !== 'booking.created' && eventType !== 'booking_created' && eventType !== 'appointment.booked' && eventType !== 'booking.created') {
      console.log('処理対象外のイベント:', eventType);
      return res.status(200).json({ 
        success: true, 
        message: 'Event received but not processed',
        event_type: eventType 
      });
    }

    // 見積りデータの取得（クエリパラメータまたはリクエストボディから）
    let estimateData: EstimateWebhookData | undefined;
    const estimateId = req.query?.estimate_id as string || req.body?.estimate_id as string;
    
    if (estimateId) {
      console.log('見積りID受信:', estimateId);
      // 実際の実装では、ここで見積りデータを取得
      // 今回はテスト用の見積りデータを生成
      estimateData = {
        estimateId: estimateId,
        customerEmail: bookingData.attendee?.email,
        answers: [
          {
            questionId: "location",
            selectedOption: 0,
            optionLabel: "リビング・ダイニング",
            price: 0
          },
          {
            questionId: "piping",
            selectedOption: 1,
            optionLabel: "穴あけ工事が必要",
            price: 5000
          },
          {
            questionId: "electrical",
            selectedOption: 1,
            optionLabel: "専用回路なし（新設が必要）",
            price: 8000
          }
        ],
        totalPrice: 32000,
        basePrice: 19000,
        createdAt: new Date().toISOString()
      };
      console.log('見積りデータを生成しました:', estimateData);
    } else {
      console.log('見積りIDが提供されていません。基本料金のみで処理します。');
    }

    // お客様情報のバリデーション（公式仕様対応）
    if (!bookingData.attendee || !bookingData.attendee.email) {
      console.error('お客様情報がありません');
      return res.status(400).json({ 
        success: false, 
        error: 'No customer information found' 
      });
    }

    const customer = bookingData.attendee;
    console.log('お客様情報:', {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      reservationDate: bookingData.start_at
    });

    // 確認メール送信（EmailJSまたはWeb3Formsを使用）
    let emailSuccess = false;
    
    const hasWeb3Forms = Boolean(process.env.WEB3FORMS_ACCESS_KEY && process.env.WEB3FORMS_ACCESS_KEY !== "your_access_key");
    const hasEmailJS = isEmailJSConfigured();
    
    console.log('メール送信設定確認:', {
      emailJSConfigured: hasEmailJS,
      web3FormsConfigured: hasWeb3Forms,
      emailJSServiceId: emailJSConfig.serviceId === "your_service_id" ? '未設定' : '設定済み',
      web3FormsKey: process.env.WEB3FORMS_ACCESS_KEY ? '設定済み' : '未設定',
      selectedService: hasWeb3Forms ? 'Web3Forms' : hasEmailJS ? 'EmailJS' : 'なし'
    });
    
    // Web3Formsを使用（サーバーサイド対応のため優先）
    if (hasWeb3Forms) {
      console.log('Web3Formsで両方向メール送信を実行します...');
      // 公式仕様に合わせてbookingDataを渡す
      const adaptedJicooData = {
        event: eventType,
        data: {
          id: bookingData.id,
          start_time: bookingData.start_at,
          end_time: bookingData.end_at,
          timezone: bookingData.timezone,
          attendees: [bookingData.attendee],
          host: bookingData.host,
          created_at: bookingData.created_at,
          updated_at: bookingData.updated_at
        }
      };
      emailSuccess = await sendConfirmationEmailWeb3Forms(adaptedJicooData as any, estimateData);
      
      if (!emailSuccess) {
        console.log('Web3Forms送信失敗のため、EmailJSを試行します...');
        if (hasEmailJS) {
          emailSuccess = await sendConfirmationEmail(adaptedJicooData as any, estimateData);
        }
      }
    } 
    // Web3Formsが設定されていない場合のみEmailJSを試行
    else if (hasEmailJS) {
      console.log('EmailJSでメール送信中...');
      const adaptedJicooData = {
        event: eventType,
        data: {
          id: bookingData.id,
          start_time: bookingData.start_at,
          end_time: bookingData.end_at,
          timezone: bookingData.timezone,
          attendees: [bookingData.attendee],
          host: bookingData.host,
          created_at: bookingData.created_at,
          updated_at: bookingData.updated_at
        }
      };
      emailSuccess = await sendConfirmationEmail(adaptedJicooData as any, estimateData);
    } 
    // どちらも設定されていない場合
    else {
      console.warn('メール送信設定がありません。Web3FormsまたはEmailJSのAPIキーが必要です。');
    }

    // レスポンス返却（公式仕様対応）
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        reservationId: bookingData.id,
        customerName: customer.name,
        customerEmail: customer.email,
        reservationDate: bookingData.start_at,
        emailSent: emailSuccess,
        estimateId: estimateId || null,
        eventType: eventType
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