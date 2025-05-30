import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { handleJicooWebhook } from "./webhook-handlers";
import { v4 as uuidv4 } from "uuid";

// 予約データの一時保存用（本番環境ではRedisやDBを使用）
const bookingDataStore = new Map<string, any>();

// 見積りデータの一時保存用（本番環境ではDB等を推奨）
const estimateDataStore = new Map<string, any>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Jicoo Webhook エンドポイント（APIルートとして）
  app.post('/api/webhook/jicoo', async (req, res) => {
    console.log('🔔 Jicoo Webhook受信:', JSON.stringify(req.body, null, 2));
    
    try {
      // Webhookハンドラーを呼び出し
      await handleJicooWebhook(req, res);

      // 予約データを一時保存
      let bookingData;
      let uniqueKey = "";

      // Jicoo公式仕様の形式
      if (req.body.event_type && req.body.booking) {
        const b = req.body.booking;
        bookingData = {
          id: b.uid || b.id,
          start_at: b.startedAt || b.start_at,
          end_at: b.endedAt || b.end_at,
          timezone: b.timeZone || b.timezone,
          attendee: b.contact || {},
          host: b.host || {},
          created_at: b.createdAt || b.created_at,
          updated_at: b.updatedAt || b.updated_at
        };
        uniqueKey = b.uid || b.id || (b.startedAt || b.start_at) || Date.now().toString();
      }
      // 新しい形式（guest_booked + object）
      else if (req.body.event === 'guest_booked' && req.body.object) {
        const obj = req.body.object;
        bookingData = {
          id: obj.uid,
          start_at: obj.startedAt,
          end_at: obj.endedAt,
          timezone: obj.timeZone,
          attendee: obj.contact,
          host: {
            name: '電化のマンセイ',
            email: 'info@d-mansei.co.jp'
          },
          created_at: obj.createdAt,
          updated_at: obj.updatedAt
        };
        uniqueKey = obj.uid || obj.startedAt || Date.now().toString();
      }
      // テスト用の旧形式
      else if (req.body.event && req.body.data) {
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
        uniqueKey = req.body.data.id || req.body.data.start_time || Date.now().toString();
      }
      else {
        console.error('❌ 不明なWebhook形式:', req.body);
        if (!res.headersSent) {
          return res.status(400).json({ 
            success: false, 
            error: 'Invalid webhook format' 
          });
        }
        return;
      }

      // 見積りIDの取得と検証
      const estimateId = req.query?.estimate_id as string || 
                        req.body?.estimate_id as string || 
                        req.body?.booking?.estimate_id as string || 
                        uniqueKey;

      if (!estimateId) {
        console.error('❌ 見積りIDが見つかりません');
        if (!res.headersSent) {
          return res.status(400).json({
            success: false,
            error: 'No estimate ID provided'
          });
        }
        return;
      }

      // 予約データの保存
      if (bookingData) {
        try {
          bookingDataStore.set(estimateId, {
            bookingData,
            timestamp: new Date().toISOString()
          });
          console.log(`📝 予約データを保存: ${estimateId}`, bookingData);
        } catch (error) {
          console.error('予約データ保存エラー:', error);
          if (!res.headersSent) {
            return res.status(500).json({
              success: false,
              error: 'Failed to save booking data',
              message: error instanceof Error ? error.message : 'Unknown error'
            });
          }
          return;
        }
      }

    } catch (error) {
      console.error('Webhook処理エラー:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Webhook processing failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  });

  // 予約データ取得API（フロントエンドから呼び出し）
  app.get('/api/booking-status/:estimateId', (req, res) => {
    const estimateId = req.params.estimateId;
    const storedData = bookingDataStore.get(estimateId);
    
    if (storedData) {
      console.log(`📤 予約データを返却: ${estimateId}`);
      res.json({
        success: true,
        bookingData: storedData.bookingData,
        timestamp: storedData.timestamp
      });
      
      // データを返却後、一定時間後に削除（メモリリーク防止）
      setTimeout(() => {
        bookingDataStore.delete(estimateId);
        console.log(`🗑️ 予約データを削除: ${estimateId}`);
      }, 600000); // 10分後に削除
      
    } else {
      res.json({
        success: false,
        message: 'No booking data found for this estimate ID'
      });
    }
  });

  // Jicoo Webhookテスト用エンドポイント（実際のJicooデータ形式でテスト）
  app.post('/api/webhook/test', async (req, res) => {
    console.log('Jicoo Webhookテスト受信:', JSON.stringify(req.body, null, 2));
    
    // テスト用のJicooデータがない場合はサンプルデータを使用
    const testJicooData = req.body.event ? req.body : {
      event: 'booking.created',
      data: {
        id: 'test-reservation-' + Date.now(),
        title: 'エアコン取付工事',
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        timezone: 'Asia/Tokyo',
        attendees: [
          {
            name: 'テスト太郎',
            email: 'test@example.com',
            status: 'confirmed'
          }
        ],
        host: {
          name: '電化のマンセイ',
          email: 'info@d-mansei.co.jp'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
    
    // 実際のJicooハンドラーを呼び出してテスト
    try {
      await handleJicooWebhook({ ...req, body: testJicooData } as any, res);
    } catch (error) {
      console.error('テストWebhook処理エラー:', error);
      res.status(500).json({
        success: false,
        error: 'Test webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Webhookテスト用エンドポイント（見積りIDを指定してテスト）
  app.post('/api/webhook/test/:estimateId', async (req, res) => {
    const estimateId = req.params.estimateId;
    console.log(`🧪 見積りID指定Webhookテスト: ${estimateId}`);
    
    const testJicooData = {
      event_type: 'booking.created',
      booking: {
        id: `test-booking-${Date.now()}`,
        event_type_id: 'o-P4XTBDZeLW',
        start_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        timezone: 'Asia/Tokyo',
        location: 'お客様宅',
        description: 'エアコン取付工事',
        attendee: {
          name: 'テスト花子',
          email: 'test.hanako@example.com',
          phone: '090-1234-5678'
        },
        host: {
          name: '電化のマンセイ',
          email: 'info@d-mansei.co.jp'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      estimate_id: estimateId
    };
    
    try {
      // テストデータを直接保存
      bookingDataStore.set(estimateId, {
        bookingData: testJicooData.booking,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ テスト予約データを保存: ${estimateId}`);
      
      res.json({
        success: true,
        message: 'Test booking data created',
        estimateId: estimateId,
        bookingData: testJicooData.booking
      });
      
    } catch (error) {
      console.error('テスト予約データ作成エラー:', error);
      res.status(500).json({
        success: false,
        error: 'Test booking data creation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // 見積りデータ取得API（オプション）
  app.get('/api/estimate/:id', (req, res) => {
    const estimateId = req.params.id;
    // 実際の実装では、ストレージから見積りデータを取得
    console.log('見積りデータ取得要求:', estimateId);
    res.json({
      success: true,
      message: 'Estimate endpoint ready',
      estimateId
    });
  });

  // 保存されている予約データ一覧取得（デバッグ用）
  app.get('/api/booking-data/list', (req, res) => {
    const allData = Array.from(bookingDataStore.entries()).map(([estimateId, data]) => ({
      estimateId,
      timestamp: data.timestamp,
      customerName: data.bookingData?.attendee?.name,
      customerEmail: data.bookingData?.attendee?.email,
      startAt: data.bookingData?.start_at
    }));
    
    res.json({
      success: true,
      count: allData.length,
      bookings: allData
    });
  });

  // 見積り内容を一時保存するAPI
  app.post('/api/estimate', (req, res) => {
    const data = req.body; // フォームの内容
    const id = uuidv4();   // 一意のIDを発行
    estimateDataStore.set(id, { ...data, createdAt: new Date().toISOString() });
    res.json({ id });      // IDを返す
  });

  const httpServer = createServer(app);

  return httpServer;
}
