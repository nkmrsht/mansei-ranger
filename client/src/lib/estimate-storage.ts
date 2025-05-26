// 見積りデータの保存・管理機能

export interface SavedEstimateData {
  id: string;
  estimateData: {
    answers: Array<{
      questionId: string;
      selectedOption: number;
      optionLabel: string;
      price: number;
    }>;
    totalPrice: number;
    basePrice: number;
    createdAt: string;
  };
  reservationData?: {
    date?: string;
    time?: string;
    customerInfo?: any;
    jicooEventId?: string;
    completedAt?: string;
  };
  status: 'estimate_completed' | 'reservation_pending' | 'reservation_completed' | 'email_sent';
}

// ユニークIDを生成
export function generateEstimateId(): string {
  return 'est_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 見積りデータを保存
export function saveEstimateData(estimateData: SavedEstimateData['estimateData']): string {
  try {
    const id = generateEstimateId();
    const savedData: SavedEstimateData = {
      id,
      estimateData,
      status: 'estimate_completed'
    };
    
    sessionStorage.setItem(`estimate_${id}`, JSON.stringify(savedData));
    sessionStorage.setItem('current_estimate_id', id);
    
    console.log('見積りデータを保存しました:', id);
    return id;
  } catch (error) {
    console.error('見積りデータの保存に失敗しました:', error);
    throw new Error('データの保存に失敗しました');
  }
}

// 現在の見積りデータを取得
export function getCurrentEstimateData(): SavedEstimateData | null {
  try {
    const currentId = sessionStorage.getItem('current_estimate_id');
    if (!currentId) return null;
    
    const data = sessionStorage.getItem(`estimate_${currentId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('見積りデータの取得に失敗しました:', error);
    return null;
  }
}

// 予約データを更新
export function updateReservationData(reservationData: SavedEstimateData['reservationData']): boolean {
  try {
    const currentData = getCurrentEstimateData();
    if (!currentData) {
      throw new Error('見積りデータが見つかりません');
    }
    
    currentData.reservationData = reservationData;
    currentData.status = 'reservation_completed';
    
    sessionStorage.setItem(`estimate_${currentData.id}`, JSON.stringify(currentData));
    console.log('予約データを更新しました:', currentData.id);
    return true;
  } catch (error) {
    console.error('予約データの更新に失敗しました:', error);
    return false;
  }
}

// メール送信完了のステータス更新
export function markEmailSent(): boolean {
  try {
    const currentData = getCurrentEstimateData();
    if (!currentData) {
      throw new Error('見積りデータが見つかりません');
    }
    
    currentData.status = 'email_sent';
    sessionStorage.setItem(`estimate_${currentData.id}`, JSON.stringify(currentData));
    console.log('メール送信完了をマークしました:', currentData.id);
    return true;
  } catch (error) {
    console.error('ステータス更新に失敗しました:', error);
    return false;
  }
}

// 全ての見積りデータをクリア（デバッグ用）
export function clearAllEstimateData(): void {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('estimate_') || key === 'current_estimate_id') {
        sessionStorage.removeItem(key);
      }
    });
    console.log('全ての見積りデータをクリアしました');
  } catch (error) {
    console.error('データクリアに失敗しました:', error);
  }
}