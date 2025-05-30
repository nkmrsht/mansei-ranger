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
    id: "plan",
    title: "プラン選択",
    questions: [
      {
        id: "plan-selection",
        question: "ご希望のプランをお選びください",
        options: [
          { label: "取付工事のみ（本体はお持ちの方）", price: 0 },
          { label: "シャープ AC-22TFC＋取付工事セット", price: 0 },
          { label: "パナソニック CS-225DFL＋取付工事セット", price: 0 },
          { label: "パナソニック CS-225DEX＋取付工事セット", price: 0 }
        ],
        help: {
          reason: "お客様のご要望に最適なプランをご提案するため、まずは基本プランをお選びください。",
          guide: "本体をお持ちの方は「取付工事のみ」を、本体も含めてご希望の方は各メーカーのセットプランをお選びください。"
        }
      }
    ]
  },
  {
    id: "model-size",
    title: "機種・畳数選択",
    questions: [
      {
        id: "model-size-selection",
        question: "畳数・金額を選択してください",
        options: [
          { label: "6畳用 ¥199,999（税込）", price: 199999 },
          { label: "8畳用 ¥199,999（税込）", price: 199999 },
          { label: "10畳用 ¥199,999（税込）", price: 199999 },
          { label: "12畳用 ¥199,999（税込）", price: 199999 }
        ],
        help: {
          reason: "お部屋の広さに合わせて最適な機種をお選びいただくため、畳数を確認させていただきます。",
          guide: "お部屋の広さに応じて、最適な機種をお選びください。"
        }
      }
    ]
  },
  {
    id: "common",
    title: "設置条件",
    questions: [
      {
        id: "housing-type",
        question: "住居タイプを教えてください",
        options: [
          { label: "賃貸アパート", price: 0 },
          { label: "賃貸マンション", price: 0 },
          { label: "持ち家 戸建て", price: 0 },
          { label: "持ち家 マンション", price: 0 }
        ],
        help: {
          reason: "住居タイプによって工事方法や追加料金が異なる場合があります。",
          guide: "お住まいの形態をお選びください。"
        }
      },
      {
        id: "outdoor-unit-location",
        question: "室外機の設置場所はどちらですか？",
        options: [
          { label: "同じ階・ベランダなど", price: 0 },
          { label: "1階に降ろす", price: 11000 },
          { label: "屋根の上に置く", price: 15400 },
          { label: "壁に金具で固定", price: 16500 }
        ],
        help: {
          reason: "室外機の設置場所によって工事方法や追加料金が異なります。",
          guide: "室外機を設置する予定の場所をお選びください。"
        }
      },
      {
        id: "removal-needed",
        question: "エアコンの取り外しは必要ですか？",
        options: [
          { label: "必要（回収・処分込み）", price: 5500 },
          { label: "不要", price: 0 }
        ],
        help: {
          reason: "既存のエアコンを取り外す必要がある場合、追加料金が発生します。",
          guide: "既存のエアコンがある場合は「必要」を選択してください。"
        }
      },
      {
        id: "pipe-length",
        question: "室内機から室外機までの配管の長さはどれくらいですか？",
        options: [
          { label: "4m以内", price: 0 },
          { label: "4～8m", price: 13200 },
          { label: "それ以上（要相談）", price: 0 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "配管の長さによって追加料金が発生する場合があります。",
          guide: "配管の長さがわからない場合は「わからない」を選択してください。"
        }
      },
      {
        id: "indoor-pipe-cover",
        question: "室内側の配管カバーは必要ですか？",
        options: [
          { label: "賃貸の方はこちらを選択", price: 0 },
          { label: "1mまで", price: 10800 },
          { label: "2mまで", price: 16800 },
          { label: "必要ない", price: 0 }
        ],
        help: {
          reason: "配管カバーの長さによって追加料金が異なります。",
          guide: "賃貸の方は「賃貸の方はこちらを選択」を選択してください。"
        }
      },
      {
        id: "outdoor-pipe-cover",
        question: "室外側の配管カバーは必要ですか？",
        options: [
          { label: "賃貸の方はこちらを選択", price: 0 },
          { label: "2mまで", price: 10800 },
          { label: "4mまで", price: 16800 },
          { label: "必要ない", price: 0 }
        ],
        help: {
          reason: "配管カバーの長さによって追加料金が異なります。",
          guide: "賃貸の方は「賃貸の方はこちらを選択」を選択してください。"
        }
      },
      {
        id: "hole-exists",
        question: "エアコン用の配管穴は空いていますか？",
        options: [
          { label: "すでに穴がある", price: 0 },
          { label: "穴が開いていない", price: 5500 },
          { label: "賃貸の方はこちらを選択", price: 0 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "配管穴の有無によって工事内容や追加料金が異なります。",
          guide: "賃貸の方は「賃貸の方はこちらを選択」を選択してください。"
        }
      },
      {
        id: "outlet-exists",
        question: "設置希望場所の近くにエアコン専用コンセントはありますか？",
        options: [
          { label: "ある", price: 0 },
          { label: "ない", price: 0 },
          { label: "わからない", price: 0 }
        ],
        help: {
          reason: "コンセントの有無によって工事内容や追加料金が異なる場合があります。",
          guide: "コンセントの有無がわからない場合は「わからない」を選択してください。"
        }
      }
    ]
  }
];

// ベース料金
export const BASE_INSTALLATION_PRICE = 19000;
export const ORIGINAL_PRICE = 22000;

export type AirconModel = {
  id: string;
  name: string;
  sizes: {
    size: string;
    price: number;
  }[];
};

export const AIRCON_MODELS: AirconModel[] = [
  {
    id: "sharp-ac22tfc",
    name: "シャープ AC-22TFC",
    sizes: [
      { size: "6畳用", price: 199999 },
      { size: "8畳用", price: 199999 },
      { size: "10畳用", price: 199999 },
      { size: "12畳用", price: 199999 }
    ]
  },
  {
    id: "panasonic-cs225dfl",
    name: "パナソニック CS-225DFL",
    sizes: [
      { size: "6畳用", price: 199999 },
      { size: "8畳用", price: 199999 },
      { size: "10畳用", price: 199999 },
      { size: "12畳用", price: 199999 }
    ]
  },
  {
    id: "panasonic-cs225dex",
    name: "パナソニック CS-225DEX",
    sizes: [
      { size: "6畳用", price: 199999 },
      { size: "8畳用", price: 199999 },
      { size: "10畳用", price: 199999 },
      { size: "12畳用", price: 199999 }
    ]
  }
];