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
        question: "住まいの種類を教えてください",
        options: [
          { label: "賃貸アパート", price: 0 },
          { label: "賃貸マンション", price: 0 },
          { label: "持ち家 戸建て", price: 0 },
          { label: "持ち家 マンション", price: 0 }
        ],
        help: {
          reason: "工事内容が住まいの種類で変わるため。",
          guide: "ご自宅を所有の場合は「持ち家」を選んでください。"
        }
      },
      {
        id: "1-2",
        question: "エアコンを取り付ける部屋は何階ですか？",
        options: [
          { label: "1階", price: 0 },
          { label: "2階", price: 0 },
          { label: "3階以上", price: 0 }
        ],
        help: {
          reason: "階数によって必要な配管の長さが変わります。",
          guide: "建物の階数でご判断ください。"
        }
      },
      {
        id: "1-3",
        question: "室外機はどこに置く予定ですか？",
        options: [
          { label: "同じ階・ベランダなど", price: 0 },
          { label: "1階に降ろす", price: 11000 },
          { label: "屋根の上に置く", price: 15400 },
          { label: "壁に金具で固定", price: 16500 }
        ],
        help: {
          reason: "室外機の設置場所によって金具や作業が変わります。",
          guide: "不明な場合は「ベランダなど」を選んでください。"
        }
      },
      {
        id: "1-4",
        question: "室外機の台はどうしますか？",
        options: [
          { label: "今ある台・ブロックを使う", price: 0 },
          { label: "新しい台を用意してほしい", price: 3300 }
        ],
        help: {
          reason: "転倒防止のため台が必要な場合があります。",
          guide: "分からなければ「新しい台を用意」でOK。"
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
        question: "今ついているエアコンの取り外しは必要ですか？",
        options: [
          { label: "必要", price: 5500 },
          { label: "必要（回収処分も希望）", price: 9900 },
          { label: "不要", price: 0 }
        ],
        help: {
          reason: "取り外し・処分の有無で作業内容と金額が変わります。",
          guide: "分からなければ「不要」でもOK。"
        }
      },
      {
        id: "2-2",
        question: "リサイクル券はお持ちですか？",
        options: [
          { label: "持っている", price: 0 },
          { label: "当日用意してほしい", price: 2200 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "法律でエアコンの処分に必要です。",
          guide: "不明な場合は「わからない」または「当日用意」でOK。"
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
        question: "室内機から室外機までの距離（配管の長さ）はどれくらいですか？",
        options: [
          { label: "4m以内", price: 0 },
          { label: "4～8m", price: 7000 },
          { label: "8m超", price: 17500 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "配管の長さが標準(4m)を超えると追加費用がかかります。",
          guide: "お部屋から室外機予定位置までのおおよその距離を選んでください。分からない場合は「わからない」でOKです。"
        }
      },
      {
        id: "3-2",
        question: "室内の配管カバーは必要ですか？",
        options: [
          { label: "いらない", price: 0 },
          { label: "1mまで", price: 10800 },
          { label: "2mまで", price: 16800 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "配管を隠して見た目をきれいにしたい場合はご選択ください。",
          guide: "分からなければ「わからない」でOK。"
        }
      },
      {
        id: "3-3",
        question: "室外の配管カバーは必要ですか？",
        options: [
          { label: "いらない", price: 0 },
          { label: "2mまで", price: 5800 },
          { label: "4mまで", price: 11600 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "外壁の美観や配管の保護のためにカバーを付けたい場合はご選択ください。",
          guide: "標準は2m単位です。分からなければ「わからない」でOK。"
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
        question: "エアコン用の穴は壁に空いていますか？",
        options: [
          { label: "既に穴がある", price: 0 },
          { label: "新たに穴を開ける必要がある", price: 4500 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "エアコン用の穴がない場合は工事が必要です。",
          guide: "不明な場合は「わからない」でOK。"
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
        question: "設置したい場所の近くにコンセントはありますか？",
        options: [
          { label: "ある", price: 0 },
          { label: "ない", price: 12000 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "エアコン用の電源が必要です。",
          guide: "不明な場合は「わからない」でOK。"
        }
      }
    ]
  }
];

// ベース料金
export const BASE_INSTALLATION_PRICE = 19000; // キャンペーン価格
export const ORIGINAL_PRICE = 22000; // 通常価格