import { z } from "zod";

// 見積りデータの型定義
export interface EstimateOption {
  label: string;
  price: number;
}

export interface EstimateQuestion {
  id: string;
  question: string;
  options: EstimateOption[];
  help: {
    reason: string;
    guide: string;
  };
}

export interface EstimateSection {
  id: string;
  title: string;
  questions: EstimateQuestion[];
}

// 見積り回答の型
export const estimateAnswerSchema = z.object({
  questionId: z.string(),
  selectedOption: z.number(), // optionのindex
  customValue: z.number().optional(), // 延長料金などの場合
});

export const estimateFormSchema = z.object({
  answers: z.array(estimateAnswerSchema),
  totalPrice: z.number(),
});

export type EstimateAnswer = z.infer<typeof estimateAnswerSchema>;
export type EstimateForm = z.infer<typeof estimateFormSchema>;

// 見積りデータ定義
export const estimateData: EstimateSection[] = [
  {
    id: "section1",
    title: "設置環境の基本",
    questions: [
      {
        id: "1-1",
        question: "住まいの種類は？",
        options: [
          { label: "賃貸アパート", price: 0 },
          { label: "賃貸マンション", price: 0 },
          { label: "持ち家 戸建て", price: 0 },
          { label: "持ち家 マンション", price: 0 }
        ],
        help: {
          reason: "建物の構造で工事方法が変わります。",
          guide: "賃貸か持ち家かでご判断ください。"
        }
      },
      {
        id: "1-2",
        question: "取付ける部屋は何階ですか？",
        options: [
          { label: "1階", price: 0 },
          { label: "2階", price: 0 },
          { label: "3階以上", price: 0 }
        ],
        help: {
          reason: "配管の長さ・作業時間が階数で変わります。",
          guide: "リビングが2階なら「2階」など実際の居室階を入力。"
        }
      },
      {
        id: "1-3",
        question: "室外機をどこに置きますか？",
        options: [
          { label: "同じ階・ベランダなど", price: 0 },
          { label: "1階に降ろして置く", price: 11000 },
          { label: "屋根の上に置く", price: 15400 },
          { label: "壁に金具で固定", price: 16500 }
        ],
        help: {
          reason: "置き方により金具・追加作業が異なります。",
          guide: "スペースや外観に合う置き場所を選択。"
        }
      },
      {
        id: "1-4",
        question: "室外機の台は？",
        options: [
          { label: "今ある台・ブロックを使う", price: 0 },
          { label: "新しいプラ台を用意", price: 3300 }
        ],
        help: {
          reason: "転倒防止・振動吸収に台が必要です。",
          guide: "既存ブロック有→「今ある台」。無い場合→「新しいプラ台」。"
        }
      }
    ]
  },
  {
    id: "section2",
    title: "既存エアコンの有無",
    questions: [
      {
        id: "2-1",
        question: "古いエアコンの取り外しは？",
        options: [
          { label: "古い機種なし", price: 0 },
          { label: "取り外すだけ", price: 5500 },
          { label: "取り外し＋回収処分", price: 9900 }
        ],
        help: {
          reason: "外し・運搬有無で作業が変わります。",
          guide: "現在のエアコンの有無と処分要否で選択。"
        }
      },
      {
        id: "2-2",
        question: "リサイクル券",
        options: [
          { label: "すでに持っている", price: 0 },
          { label: "当日こちらで用意", price: 2200 }
        ],
        help: {
          reason: "家電リサイクル法で処分時必須。",
          guide: "量販店で事前購入済→「持っている」。当日依頼→「当日こちらで用意」。"
        }
      }
    ]
  },
  {
    id: "section3",
    title: "配管・カバー関連",
    questions: [
      {
        id: "3-1",
        question: "配管の長さは？",
        options: [
          { label: "5m以内", price: 0 },
          { label: "5〜7m", price: 7000 },
          { label: "7m超", price: 3500 } // 1mごとの単価
        ],
        help: {
          reason: "長さ分の配管材料・施工が追加。",
          guide: "室内機下から室外機予定位置までざっくり測定。"
        }
      },
      {
        id: "3-2",
        question: "室内の配管カバー",
        options: [
          { label: "いらない", price: 0 },
          { label: "1mまで", price: 10800 },
          { label: "2mまで", price: 16800 }
        ],
        help: {
          reason: "配管を隠して見た目を整えるため。",
          guide: "目立たない場所→「いらない」。リビング等見える→長さに合わせ選択。"
        }
      },
      {
        id: "3-3",
        question: "室外の配管カバー",
        options: [
          { label: "いらない", price: 0 },
          { label: "2mまで", price: 5800 },
          { label: "延長2mごと", price: 5800 }
        ],
        help: {
          reason: "外壁の美観・紫外線劣化防止。",
          guide: "外観をスッキリさせたい／直射日光が強い場合は取付推奨。"
        }
      },
      {
        id: "3-4",
        question: "壁内配管の再利用？",
        options: [
          { label: "再利用しない・なし", price: 0 },
          { label: "再利用する", price: 18000 }
        ],
        help: {
          reason: "隠ぺい配管は再接続に追加作業が必要。",
          guide: "マンション等で最初から壁内配管→「再利用する」。"
        }
      }
    ]
  },
  {
    id: "section4",
    title: "壁穴・貫通工事",
    questions: [
      {
        id: "4-1",
        question: "配管を通す壁の穴は？",
        options: [
          { label: "既に穴がある", price: 0 },
          { label: "木造・モルタルに新穴", price: 4500 },
          { label: "ALC壁に新穴", price: 5500 },
          { label: "コンクリート壁に新穴", price: 20000 }
        ],
        help: {
          reason: "材質で穴あけ難易度が変わります。",
          guide: "キャップ付き穴があれば既存、外壁材質で該当を選択。"
        }
      },
      {
        id: "4-2",
        question: "追加穴",
        options: [
          { label: "不要", price: 0 },
          { label: "1箇所追加", price: 3000 }
        ],
        help: {
          reason: "複数穴が必要か確認。",
          guide: "1台設置なら多くは「不要」です。"
        }
      }
    ]
  },
  {
    id: "section5",
    title: "電源まわり",
    questions: [
      {
        id: "5-1",
        question: "専用コンセントは？",
        options: [
          { label: "既にある", price: 0 },
          { label: "新設10m以内", price: 12000 },
          { label: "延長1mごと", price: 1000 }
        ],
        help: {
          reason: "安全基準で専用回路が必要。",
          guide: "分電盤に「エアコン」ブレーカーがあれば「既にある」。"
        }
      },
      {
        id: "5-2",
        question: "電圧切替（100V→200V）",
        options: [
          { label: "不要", price: 0 },
          { label: "必要", price: 6600 }
        ],
        help: {
          reason: "機種により電圧が異なります。",
          guide: "購入予定機種ラベルに「単相200V」とあれば切替が必要。"
        }
      },
      {
        id: "5-3",
        question: "コンセント形状変更",
        options: [
          { label: "不要", price: 0 },
          { label: "必要", price: 3300 }
        ],
        help: {
          reason: "差込口の形状が合わないと使用不可。",
          guide: "壁コンセント穴を確認し、合わなければ「必要」。"
        }
      }
    ]
  },
  {
    id: "section6",
    title: "排水・特殊作業",
    questions: [
      {
        id: "6-1",
        question: "排水をくみ上げるポンプ",
        options: [
          { label: "不要", price: 0 },
          { label: "必要", price: 15000 }
        ],
        help: {
          reason: "室外機より室内機が低い場合に必須。",
          guide: "外の排水口が高い位置なら「必要」を選択。"
        }
      },
      {
        id: "6-2",
        question: "高い位置での取付け",
        options: [
          { label: "床から2.5m未満", price: 0 },
          { label: "2.5〜3.5m", price: 5500 },
          { label: "3.5m超", price: 0 } // 現地見積
        ],
        help: {
          reason: "高所作業の有無で料金が変わります。",
          guide: "床〜室内機上端までをざっくり測ってください。"
        }
      },
      {
        id: "6-3",
        question: "駐車スペース",
        options: [
          { label: "敷地内に停められる", price: 0 },
          { label: "近くのコインP実費", price: 0 }
        ],
        help: {
          reason: "作業車の駐車料金が発生するか確認。",
          guide: "敷地内・来客用Pがあれば0円、無い場合はコインP。"
        }
      }
    ]
  }
];

// ベース料金
export const BASE_INSTALLATION_PRICE = 19000; // キャンペーン価格
export const ORIGINAL_PRICE = 22000; // 通常価格