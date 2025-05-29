// Jicoo Webhook処理用のハンドラー
import type { Request, Response } from 'express';

// EmailJSの設定情報（Replitの環境変数から取得）
const emailJSConfig = {
  serviceId: process.env.EMAILJS_SERVICE_ID || "your_service_id",
  templateId: process.env.EMAILJS_TEMPLATE_ID || "your_template_id", 
  publicKey: process.env.EMAILJS_PUBLIC_KEY || "your_public_key"
};
console.log('ENV:', process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, process.env.EMAILJS_PUBLIC_KEY);

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
  // 新しい公式仕様（推奨）
  event_type?: 'booking.created' | 'booking.updated' | 'guest_cancelled' | 'host_cancelled';
  event?: 'guest_booked' | 'guest_cancelled' | 'host_cancelled';  // 新しいイベントタイプ
  booking?: {
    uid: string;
    eventTypeUid: string;
    startedAt: string; // ISO 8601形式
    endedAt: string;   // ISO 8601形式
    timeZone: string;
    location?: string;
    status: 'confirmed' | 'cancel' | 'open';  // 'open'ステータスを追加
    contact: {
      name: string;
      email: string;
      phone?: string;  // 電話番号フィールドを追加
    };
    answers?: Array<{
      question: string;
      content: string[];
    }>;
    tracking?: {
      utm_campaign?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_content?: string;
      utm_term?: string;
    };
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
    cancelledBy?: 'guest' | 'host';
    cancelReason?: string;
  };
  
  // 旧形式との互換性（テスト用）
  data?: {
    id: string;
    title?: string;
    start_time: string;
    end_time: string;
    timezone: string;
    attendees: Array<{
      name: string;
      email: string;
      status?: string;
      phone?: string;  // 電話番号フィールドを追加
    }>;
    host: {
      name: string;
      email: string;
    };
    created_at: string;
    updated_at: string;
  };
  
  createdAt?: string; // Webhook送信時刻
  object?: {  // 新しいオブジェクト形式
    uid: string;
    eventTypeUid: string;
    startedAt: string;
    endedAt: string;
    status: string;
    timeZone: string;
    cancelReason: string | null;
    cancelledAt: string | null;
    cancelledBy: string | null;
    contact: {
      name: string;
      email: string;
    };
    answers: Array<{
      question: string;
      content: string[];
    }>;
    tracking: {
      utm_campaign: string | null;
      utm_source: string | null;
      utm_medium: string | null;
      utm_content: string | null;
      utm_term: string | null;
    };
    updatedAt: string;
    createdAt: string;
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

// Webhookデータから統一された予約情報を抽出
function extractBookingInfo(webhookData: JicooWebhookData) {
  // 新しいオブジェクト形式の場合
  if (webhookData.event === 'guest_booked' && webhookData.object) {
    return {
      id: webhookData.object.uid,
      eventType: webhookData.event,
      startTime: webhookData.object.startedAt,
      endTime: webhookData.object.endedAt,
      timezone: webhookData.object.timeZone,
      location: undefined,
      status: webhookData.object.status,
      customer: {
        name: webhookData.object.contact.name,
        email: webhookData.object.contact.email,
        phone: undefined
      },
      answers: webhookData.object.answers || [],
      tracking: webhookData.object.tracking,
      createdAt: webhookData.object.createdAt,
      updatedAt: webhookData.object.updatedAt,
      cancelledAt: webhookData.object.cancelledAt,
      cancelledBy: webhookData.object.cancelledBy,
      cancelReason: webhookData.object.cancelReason
    };
  }

  // 新しい公式仕様の場合
  if (webhookData.event_type && webhookData.booking) {
    return {
      id: webhookData.booking.uid,
      eventType: webhookData.event_type,
      startTime: webhookData.booking.startedAt,
      endTime: webhookData.booking.endedAt,
      timezone: webhookData.booking.timeZone,
      location: webhookData.booking.location,
      status: webhookData.booking.status,
      customer: {
        name: webhookData.booking.contact.name,
        email: webhookData.booking.contact.email,
        phone: webhookData.booking.contact.phone
      },
      answers: webhookData.booking.answers || [],
      tracking: webhookData.booking.tracking,
      createdAt: webhookData.booking.createdAt,
      updatedAt: webhookData.booking.updatedAt,
      cancelledAt: webhookData.booking.cancelledAt,
      cancelledBy: webhookData.booking.cancelledBy,
      cancelReason: webhookData.booking.cancelReason
    };
  }
  
  // 旧形式の場合（テスト用）
  if (webhookData.event && webhookData.data) {
    const customer = webhookData.data.attendees?.[0];
    return {
      id: webhookData.data.id,
      eventType: webhookData.event,
      startTime: webhookData.data.start_time,
      endTime: webhookData.data.end_time,
      timezone: webhookData.data.timezone,
      location: undefined,
      status: 'confirmed' as const,
      customer: {
        name: customer?.name || 'お客様',
        email: customer?.email || '',
        phone: customer?.phone
      },
      answers: [],
      tracking: undefined,
      createdAt: webhookData.data.created_at,
      updatedAt: webhookData.data.updated_at,
      cancelledAt: undefined,
      cancelledBy: undefined,
      cancelReason: undefined
    };
  }
  
  throw new Error('Invalid webhook data format');
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
    
    const bookingInfo = extractBookingInfo(jicooData);
    const reservationDate = new Date(bookingInfo.startTime);
    
    // 顧客向けメール送信
    const customerEmailData = {
      service_id: emailJSConfig.serviceId,
      template_id: emailJSConfig.templateId,
      user_id: emailJSConfig.publicKey,
      template_params: {
        to_email: bookingInfo.customer.email,
        customer_name: bookingInfo.customer.name,
        reservation_id: bookingInfo.id,
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

    // ホスト向けメール送信
    const hostEmailData = {
      ...customerEmailData,
      template_params: {
        ...customerEmailData.template_params,
        to_email: 'info@d-mansei.co.jp',
        customer_name: '電化のマンセイ スタッフ',
        additional_info: `
■ 予約者情報
名前：${bookingInfo.customer.name}
メール：${bookingInfo.customer.email}
電話：${bookingInfo.customer.phone || '未設定'}

■ 工事内容
${estimateData ? generateEstimateDetails(estimateData) : '見積もりデータなし'}
        `
      }
    };

    console.log('EmailJS送信中...', {
      serviceId: emailJSConfig.serviceId,
      templateId: emailJSConfig.templateId,
      customerEmail: bookingInfo.customer.email,
      hostEmail: 'info@d-mansei.co.jp',
      eventType: bookingInfo.eventType
    });

    // 顧客向けメール送信
    const customerResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerEmailData)
    });

    // ホスト向けメール送信
    const hostResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hostEmailData)
    });

    if (customerResponse.ok && hostResponse.ok) {
      console.log('EmailJS送信成功（顧客・ホスト両方）');
      return true;
    } else {
      const customerError = await customerResponse.text();
      const hostError = await hostResponse.text();
      console.error('EmailJS送信失敗:', {
        customerStatus: customerResponse.status,
        customerError: customerError,
        hostStatus: hostResponse.status,
        hostError: hostError
      });
      return false;
    }
  } catch (error) {
    console.error('EmailJS送信エラー:', error);
    return false;
  }
}

// メールテンプレート生成
function generateEmailTemplate(jicooData: JicooWebhookData, estimateData?: EstimateWebhookData): string {
  const bookingInfo = extractBookingInfo(jicooData);
  const reservationDate = new Date(bookingInfo.startTime);
  
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

${bookingInfo.customer.name || 'お客様'}

この度は電化のマンセイにご予約をいただき、
誠にありがとうございます。

${estimateDetails}

■ 予約情報
─────────────────────────────────
予約ID：${bookingInfo.id}
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
    console.log('🔔 Jicoo Webhook受信:', JSON.stringify(req.body, null, 2));
    
    // リクエストの詳細をログ出力
    console.log('🔔 [' + new Date().toISOString() + '] Jicoo Webhook受信 START =================');
    console.log('📝 リクエストヘッダー:', req.headers);
    console.log('📝 クエリパラメータ:', req.query);
    console.log('📝 リクエストボディ:', JSON.stringify(req.body, null, 2));
    console.log('🔔 Webhook受信詳細情報 END ===================');

    const webhookData = req.body as JicooWebhookData;
    
    // 新しいWebhook形式の検証
    if (webhookData.event === 'guest_booked' && webhookData.object) {
      const bookingInfo = extractBookingInfo(webhookData);
      
      // 予約データを保存
      const reservationData = {
        id: bookingInfo.id,
        start_at: bookingInfo.startTime,
        end_at: bookingInfo.endTime,
        timezone: bookingInfo.timezone,
        attendee: {
          name: bookingInfo.customer.name,
          email: bookingInfo.customer.email
        },
        host: {
          name: '電化のマンセイ',
          email: 'info@d-mansei.co.jp'
        },
        created_at: bookingInfo.createdAt,
        updated_at: bookingInfo.updatedAt
      };
      
      console.log('📝 予約データを保存:', bookingInfo.id, reservationData);
      
      // メール送信
      const emailSent = await sendConfirmationEmail(webhookData);
      if (emailSent) {
        console.log('📧 確認メール送信成功:', bookingInfo.id);
      } else {
        console.warn('⚠️ 確認メール送信失敗:', bookingInfo.id);
      }
      
      return res.json({ success: true });
    }
    
    // 旧形式のWebhook処理
    if (webhookData.event_type === 'booking.created' && webhookData.booking) {
      const bookingInfo = extractBookingInfo(webhookData);
      
      // 予約データを保存
      const reservationData = {
        id: bookingInfo.id,
        start_at: bookingInfo.startTime,
        end_at: bookingInfo.endTime,
        timezone: bookingInfo.timezone,
        attendee: {
          name: bookingInfo.customer.name,
          email: bookingInfo.customer.email
        },
        host: {
          name: '電化のマンセイ',
          email: 'info@d-mansei.co.jp'
        },
        created_at: bookingInfo.createdAt,
        updated_at: bookingInfo.updatedAt
      };
      
      console.log('📝 予約データを保存:', bookingInfo.id, reservationData);
      
      // メール送信
      const emailSent = await sendConfirmationEmail(webhookData);
      if (emailSent) {
        console.log('📧 確認メール送信成功:', bookingInfo.id);
      } else {
        console.warn('⚠️ 確認メール送信失敗:', bookingInfo.id);
      }
      
      return res.json({ success: true });
    }
    
    // 不明なWebhook形式
    console.error('❌ 不明なWebhook形式:', webhookData);
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid webhook format' 
    });
    
  } catch (error) {
    console.error('❌ Webhook処理エラー:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}