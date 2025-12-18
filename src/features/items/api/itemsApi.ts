import type { Item, ItemFormData, ItemFilters, ItemCategory } from '../types';
import { get, put, del } from '@/lib/api/api-client';

// Mock data
let mockItems: Item[] = [
  {
    id: '1',
    title: 'ブランドバッグ',
    description: '人気ブランドのバッグです。状態良好です。使用感はありますが、まだまだ使えます。\n\n高級感のあるレザー素材を使用しており、ビジネスシーンからカジュアルまで幅広くお使いいただけます。内側には複数のポケットがあり、収納力も抜群です。\n\n使用回数は10回程度で、目立った傷や汚れはございません。金具部分も輝きを保っており、まだまだ長くお使いいただけます。\n\n元値は5万円ほどの商品です。この機会にぜひご検討ください。',
    price: 15000,
    images: ['https://placehold.co/400x400/3b82f6/white?text=Bag'],
    category: 'fashion',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
  },
  {
    id: '2',
    title: 'ワイヤレスイヤホン',
    description: '最新モデルのワイヤレスイヤホン。音質良好。ノイズキャンセリング機能付き。\n\nBluetooth 5.2対応で安定した接続を実現。アクティブノイズキャンセリング（ANC）機能により、周囲の雑音を効果的に低減します。\n\n最大6時間の連続再生が可能で、充電ケースと合わせて最大24時間使用できます。IPX4防水規格対応で、軽い運動時の汗や雨にも安心。\n\n専用アプリでイコライザーのカスタマイズも可能です。未使用品、保証書付き。',
    price: 8000,
    images: ['https://placehold.co/400x400/10b981/white?text=Earphone'],
    category: 'electronics',
    status: 'active',
    sellerId: '2',
    sellerName: 'テックガジェット',
    createdAt: new Date('2024-12-12').toISOString(),
    updatedAt: new Date('2024-12-12').toISOString(),
  },
  {
    id: '3',
    title: 'プログラミング入門書',
    description: '初心者向けのプログラミング入門書。JavaScript、Python、Javaなど幅広く対応。\n\nこれからプログラミングを始める方に最適な一冊です。基礎から丁寧に解説されており、実践的なサンプルコードも豊富に掲載されています。\n\n各章末には練習問題があり、理解度を確認しながら学習を進められます。書き込みや折り目はなく、状態は良好です。\n\n※すでに売却済みの商品です。',
    price: 2000,
    images: ['https://placehold.co/400x400/f59e0b/white?text=Book'],
    category: 'books',
    status: 'sold',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-08').toISOString(),
    updatedAt: new Date('2024-12-08').toISOString(),
  },
  {
    id: '4',
    title: 'ワイヤレスキーボード Keychron K2',
    description: '人気のメカニカルキーボード。Gateron茶軸、Mac/Windows対応。RGB バックライト付き。\n\nKeychron K2は、コンパクトな75%レイアウトながら、ファンクションキーや矢印キーを搭載した実用的なデザイン。Gateron茶軸は、クリック感と静音性のバランスが良く、タイピングが快適です。\n\nBluetooth接続と有線接続の両方に対応しており、最大3台のデバイスを登録可能。MacとWindowsの両方のキー配列に対応しています。\n\nRGBバックライトは18種類のライティング効果から選択可能。使用期間は約3ヶ月、目立った傷はありません。',
    price: 12800,
    images: ['https://placehold.co/400x400/6366f1/white?text=Keyboard'],
    category: 'electronics',
    status: 'active',
    sellerId: '2',
    sellerName: 'テックガジェット',
    createdAt: new Date('2024-12-14').toISOString(),
    updatedAt: new Date('2024-12-14').toISOString(),
  },
  {
    id: '5',
    title: 'デニムジャケット メンズ Lサイズ',
    description: 'ヴィンテージ風デニムジャケット。色落ち加工が素敵です。Lサイズ。\n\nトレンドのヴィンテージ加工が施されたデニムジャケット。絶妙な色落ち具合が味わい深く、カジュアルコーデに最適です。\n\nサイズ：Lサイズ（着丈約65cm、身幅約55cm、袖丈約62cm）\n素材：綿100%\n\n春秋のアウターとして活躍します。内側に薄手のパーカーを重ね着することも可能。数回着用のみで、状態は非常に良好です。',
    price: 6500,
    images: ['https://placehold.co/400x400/1e3a8a/white?text=Jacket'],
    category: 'fashion',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-13').toISOString(),
    updatedAt: new Date('2024-12-13').toISOString(),
  },
  {
    id: '6',
    title: 'コーヒーメーカー デロンギ',
    description: '全自動エスプレッソマシン。美味しいコーヒーがボタン一つで。\n\nデロンギの全自動エスプレッソマシン。豆を挽くところから抽出まで、ワンタッチで本格的なエスプレッソやカプチーノが楽しめます。\n\n【主な機能】\n・カフェ・ジャポーネ機能搭載（レギュラーコーヒーも抽出可能）\n・ミルク泡立て機能付き\n・2杯同時抽出可能\n・着脱式抽出ユニットで清掃が簡単\n\n購入後1年使用。定期的にメンテナンスしており、動作は良好です。取扱説明書付き。',
    price: 45000,
    images: ['https://placehold.co/400x400/78350f/white?text=Coffee'],
    category: 'home',
    status: 'active',
    sellerId: '3',
    sellerName: 'ホームセレクト',
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  },
  {
    id: '7',
    title: 'ヨガマット 厚さ10mm',
    description: '高品質ヨガマット。滑り止め加工、収納ケース付き。\n\n厚さ10mmのクッション性に優れたヨガマット。膝や腰への負担を軽減し、快適にヨガやストレッチを行えます。\n\n【特徴】\n・NBR素材使用（耐久性・弾力性に優れる）\n・両面滑り止め加工\n・サイズ：183cm × 61cm\n・専用収納ケース、ストラップ付き\n\nヨガ、ピラティス、筋トレ、ストレッチなど様々な用途に使用可能。使用回数10回程度で、ほぼ新品同様の状態です。',
    price: 3500,
    images: ['https://placehold.co/400x400/16a34a/white?text=Yoga+Mat'],
    category: 'sports',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-11').toISOString(),
    updatedAt: new Date('2024-12-11').toISOString(),
  },
  {
    id: '8',
    title: 'レゴ クリエイター 大型セット',
    description: '人気のレゴクリエイターシリーズ。ピース数800以上。\n\nレゴクリエイターの大型セット。800ピース以上のパーツで、3通りの組み立て方が楽しめる3-in-1モデルです。\n\n創造力を育む知育玩具として最適。お子様から大人まで楽しめます。説明書完備、全パーツ揃っています。\n\n※すでに売却済みの商品です。',
    price: 8900,
    images: ['https://placehold.co/400x400/dc2626/white?text=LEGO'],
    category: 'other',
    status: 'sold',
    sellerId: '3',
    sellerName: 'ホビーコレクター',
    createdAt: new Date('2024-12-09').toISOString(),
    updatedAt: new Date('2024-12-09').toISOString(),
  },
  {
    id: '9',
    title: 'ビジネス書 7つの習慣',
    description: 'スティーブン・R・コヴィー著。自己啓発の名著。\n\nスティーブン・R・コヴィー博士による世界的ベストセラー。個人の効果性と幸福を高めるための7つの習慣について解説しています。\n\nビジネスパーソンだけでなく、学生や主婦など、あらゆる立場の方に役立つ内容です。自己成長を目指す方に強くおすすめします。\n\n線引きや書き込みは一切ありません。カバー付き、帯あり。',
    price: 1500,
    images: ['https://placehold.co/400x400/ca8a04/white?text=Book'],
    category: 'books',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-14').toISOString(),
    updatedAt: new Date('2024-12-14').toISOString(),
  },
  {
    id: '10',
    title: 'スニーカー ナイキ エアマックス',
    description: 'ナイキの定番スニーカー。サイズ27cm。美品。\n\nナイキの人気モデル、エアマックス。ビジブルエアユニットが特徴的なデザインで、クッション性と通気性に優れています。\n\nサイズ：27.0cm\nカラー：ホワイト×ブルー\n状態：使用回数5回程度、ソールの減りもほとんどなし\n\nカジュアルからスポーツミックススタイルまで幅広く活躍します。箱付き。',
    price: 9800,
    images: ['https://placehold.co/400x400/0891b2/white?text=Sneakers'],
    category: 'fashion',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  },
  {
    id: '11',
    title: 'ゲーミングマウス Logicool G Pro',
    description: 'プロゲーマー仕様のゲーミングマウス。高精度センサー搭載。\n\nLogicool G Proシリーズのワイヤレスゲーミングマウス。プロeスポーツ選手との共同開発により生まれた究極の軽量設計（80g以下）。\n\nHERO 25Kセンサー搭載で、100～25,600DPIの範囲で調整可能。遅延を感じさせないLIGHTSPEED ワイヤレステクノロジーを採用しています。\n\n最大60時間の連続使用が可能。FPSやMOBAなど、あらゆるジャンルのゲームに最適です。使用期間6ヶ月、動作良好。',
    price: 7800,
    images: ['https://placehold.co/400x400/7c3aed/white?text=Mouse'],
    category: 'electronics',
    status: 'active',
    sellerId: '2',
    sellerName: 'ゲーミングギア',
    createdAt: new Date('2024-12-13').toISOString(),
    updatedAt: new Date('2024-12-13').toISOString(),
  },
  {
    id: '12',
    title: '観葉植物 モンステラ',
    description: '人気の観葉植物モンステラ。高さ約60cm。鉢付き。\n\n南国ムード満点のモンステラ。大きな切れ込みの入った葉が特徴的で、インテリアグリーンとして人気の観葉植物です。\n\n高さ：約60cm\n鉢サイズ：直径18cm\n\n耐陰性があり、室内でも育てやすい品種です。水やりは土の表面が乾いたらたっぷりと与えるだけ。初心者の方にもおすすめです。\n\n※配送は近隣地域のみ対応可能。詳細はお問い合わせください。',
    price: 4200,
    images: ['https://placehold.co/400x400/15803d/white?text=Plant'],
    category: 'home',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-12').toISOString(),
    updatedAt: new Date('2024-12-12').toISOString(),
  },
  {
    id: '13',
    title: 'テニスラケット Wilson',
    description: 'ウィルソンのテニスラケット。中級者向け。ケース付き。\n\nウィルソンの中級者向けテニスラケット。パワーとコントロールのバランスに優れたモデルです。\n\n【スペック】\n・フェイスサイズ：100平方インチ\n・重量：約300g\n・グリップサイズ：2（日本サイズ）\n・推奨テンション：50-60ポンド\n\nストリング張り替え済み。グリップテープも新品に交換しています。専用ラケットケース付き。使用回数20回程度で、状態は良好です。',
    price: 11000,
    images: ['https://placehold.co/400x400/ea580c/white?text=Racket'],
    category: 'sports',
    status: 'active',
    sellerId: '2',
    sellerName: 'テニスプロショップ',
    createdAt: new Date('2024-12-14').toISOString(),
    updatedAt: new Date('2024-12-14').toISOString(),
  },
  {
    id: '14',
    title: 'ドローン DJI Mini 3',
    description: '軽量コンパクトなドローン。4Kカメラ搭載。\n\nDJI Mini 3は、249g以下の軽量設計ながら、4K/30fps HDR動画撮影が可能な高性能ドローン。日本の航空法規制対象外の重量です。\n\n【主な機能】\n・4K HDRカメラ（1/1.3インチCMOSセンサー）\n・最大飛行時間：38分\n・最大伝送距離：10km（日本仕様）\n・3軸ジンバル搭載\n・クイックショット、パノラマ撮影対応\n\nプロペラガード、予備バッテリー2個、充電器、ケース付きのフルセット。飛行回数15回程度、傷なし美品です。',
    price: 58000,
    images: ['https://placehold.co/400x400/0284c7/white?text=Drone'],
    category: 'electronics',
    status: 'active',
    sellerId: '2',
    sellerName: 'テックガジェット',
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  },
  {
    id: '15',
    title: 'ワンピース レディース',
    description: '花柄のワンピース。Mサイズ。春夏にぴったり。\n\n明るい花柄が印象的なワンピース。春から夏にかけて活躍する爽やかなデザインです。\n\nサイズ：Mサイズ（着丈約90cm、バスト約85cm）\n素材：ポリエステル65%、綿35%\nカラー：ホワイトベース×ピンク・イエローの花柄\n\n軽やかな素材で着心地抜群。ウエスト部分にゴムが入っているので、体型をカバーしつつスタイルよく見せてくれます。1回のみ着用、ほぼ新品の状態です。\n\n※すでに売却済みの商品です。',
    price: 4800,
    images: ['https://placehold.co/400x400/db2777/white?text=Dress'],
    category: 'fashion',
    status: 'sold',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
  },
  {
    id: '16',
    title: '電子辞書 カシオ EX-word',
    description: '英語学習に最適な電子辞書。多数の辞書コンテンツ収録。\n\nカシオの人気電子辞書EX-word。英語学習に特化したモデルで、TOEIC、英検対策に最適です。\n\n【収録コンテンツ】\n・英和辞典、和英辞典（複数収録）\n・英英辞典\n・TOEICテスト対策コンテンツ\n・英検対策コンテンツ\n・ビジネス英語、旅行英会話\n・国語辞典、百科事典など200以上のコンテンツ\n\nカラー液晶、タッチパネル対応。音声再生機能で発音もチェックできます。使用期間1年、液晶保護フィルム貼付済み、ケース付き。',
    price: 15500,
    images: ['https://placehold.co/400x400/4338ca/white?text=Dictionary'],
    category: 'electronics',
    status: 'active',
    sellerId: '2',
    sellerName: '電子機器ストア',
    createdAt: new Date('2024-12-11').toISOString(),
    updatedAt: new Date('2024-12-11').toISOString(),
  },
  {
    id: '17',
    title: 'ボードゲーム カタン',
    description: '人気の戦略ボードゲーム。3〜4人用。\n\n世界中で愛されている戦略ボードゲーム「カタンの開拓者たち」。資源を集めて、道や街を作り、カタン島を開拓していくゲームです。\n\n対象年齢：8歳以上\nプレイ人数：3〜4人\nプレイ時間：約60〜90分\n\n運と戦略のバランスが絶妙で、何度でも楽しめます。家族や友人とのゲームナイトに最適。説明書付き、全パーツ揃っています。箱に若干の使用感がありますが、内容物は美品です。',
    price: 3200,
    images: ['https://placehold.co/400x400/b91c1c/white?text=Board+Game'],
    category: 'other',
    status: 'active',
    sellerId: '3',
    sellerName: 'ゲームショップ',
    createdAt: new Date('2024-12-13').toISOString(),
    updatedAt: new Date('2024-12-13').toISOString(),
  },
  {
    id: '18',
    title: '料理本 プロの技シリーズ',
    description: 'プロのシェフが教える料理のコツ。写真付きでわかりやすい。\n\n一流シェフが教える、家庭でもできるプロの技を集めた料理本。基本の包丁の使い方から、本格的なソースの作り方まで、わかりやすく解説しています。\n\n【主な内容】\n・和食、洋食、中華それぞれのプロの技\n・食材の選び方、保存方法\n・美しい盛り付けのコツ\n・失敗しない調理法\n\nフルカラーの写真付きで、手順が一目でわかります。初心者から中級者まで役立つ一冊。書き込みなし、美品です。',
    price: 2800,
    images: ['https://placehold.co/400x400/c2410c/white?text=Cookbook'],
    category: 'books',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-12').toISOString(),
    updatedAt: new Date('2024-12-12').toISOString(),
  },
  {
    id: '19',
    title: 'スマートウォッチ Apple Watch Series 8',
    description: 'Apple Watch Series 8。健康管理に最適。\n\nApple Watch Series 8の45mmモデル。ミッドナイトアルミニウムケース、スポーツバンド付き。\n\n【主な機能】\n・常時表示Retinaディスプレイ\n・血中酸素濃度測定\n・心電図アプリ\n・睡眠トラッキング\n・ワークアウト自動認識\n・Apple Pay対応\n・防水機能（50m）\n\niPhoneとの連携で、通知の確認や電話の応答もできます。健康管理からフィットネストラッキングまで、幅広く活用できます。使用期間6ヶ月、画面保護フィルム貼付済み。充電器、箱付き。',
    price: 42000,
    images: ['https://placehold.co/400x400/0369a1/white?text=Watch'],
    category: 'electronics',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  },
  {
    id: '20',
    title: 'アコースティックギター Yamaha',
    description: 'ヤマハのアコースティックギター。初心者にもおすすめ。\n\nヤマハの定番アコースティックギター。初心者でも弾きやすい設計で、これからギターを始める方に最適です。\n\n【スペック】\n・トップ：スプルース\n・サイド/バック：メランティ\n・ネック：ナトー\n・指板：ローズウッド\n・弦長：634mm\n\n温かみのある音色が特徴で、弾き語りにぴったり。ソフトケース、チューナー、カポタスト、予備弦、ピックセット付き。使用期間1年、目立った傷なし。',
    price: 18500,
    images: ['https://placehold.co/400x400/a16207/white?text=Guitar'],
    category: 'other',
    status: 'active',
    sellerId: '3',
    sellerName: 'ホビーコレクター',
    createdAt: new Date('2024-12-14').toISOString(),
    updatedAt: new Date('2024-12-14').toISOString(),
  },
  {
    id: '21',
    title: 'レザートートバッグ',
    description: '本革のトートバッグ。ビジネスにも普段使いにも。\n\n上質な本革を使用したトートバッグ。使い込むほどに味が出る経年変化を楽しめます。A4サイズの書類やノートPCも楽々収納できる大きさです。\n\n【仕様】\n・素材：本革（牛革）\n・サイズ：幅40cm × 高さ32cm × マチ12cm\n・重量：約900g\n・内ポケット2つ、外ポケット1つ\n\nビジネスシーンはもちろん、カジュアルな装いにも合わせやすいシンプルなデザイン。使用期間3ヶ月、革の状態良好です。',
    price: 24000,
    images: ['https://placehold.co/400x400/92400e/white?text=Tote+Bag'],
    category: 'fashion',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '22',
    title: 'ビジネスシューズ 革靴 25.5cm',
    description: 'フォーマルな革靴。冠婚葬祭やビジネスに。\n\n本革使用の高品質ビジネスシューズ。内羽根式のストレートチップで、最もフォーマルなデザインです。\n\n【詳細】\n・サイズ：25.5cm\n・素材：本革（アッパー）\n・ソール：合成ゴム\n・カラー：ブラック\n\nクッション性のあるインソールで長時間の着用も快適。靴磨きセット付き。着用回数5回程度、ソールの減りもわずかで美品です。',
    price: 8500,
    images: ['https://placehold.co/400x400/1c1917/white?text=Shoes'],
    category: 'fashion',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '23',
    title: '自己啓発本 思考は現実化する',
    description: 'ナポレオン・ヒル著の名著。成功哲学の古典。\n\n世界中で8000万部以上売れた成功哲学の決定版。アンドリュー・カーネギーなど、成功者500名以上への取材をもとに、成功の秘訣を体系化しています。\n\n【内容】\n・明確な目標設定の重要性\n・願望を実現する6つのステップ\n・マスターマインドの活用法\n・潜在意識の力の使い方\n\n単なる精神論ではなく、具体的な行動指針が満載。人生を変えたい方必読の一冊です。書き込みなし、状態良好。',
    price: 1800,
    images: ['https://placehold.co/400x400/d97706/white?text=Success+Book'],
    category: 'books',
    status: 'active',
    sellerId: '1',
    sellerName: 'テストユーザー',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '24',
    title: 'ワイヤレス充電器 Anker',
    description: '高速ワイヤレス充電器。iPhone/Android対応。\n\nAnkerの人気ワイヤレス充電器。最大15Wの高速充電に対応し、スマートフォンを置くだけで充電できます。\n\n【特徴】\n・最大15W出力（デバイスにより異なる）\n・iPhone、Android両対応\n・ケースを付けたまま充電可能（厚さ5mm以下）\n・過充電防止、温度管理機能搭載\n・滑り止めラバー付き\n\nケーブルの抜き差し不要で、デスクに置いておくだけで便利。USB-Cケーブル、ACアダプター付き。ほぼ未使用品です。',
    price: 2800,
    images: ['https://placehold.co/400x400/0c4a6e/white?text=Charger'],
    category: 'electronics',
    status: 'active',
    sellerId: '2',
    sellerName: 'テックガジェット',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '25',
    title: 'ゲーミングヘッドセット SteelSeries',
    description: 'プロ仕様のゲーミングヘッドセット。7.1サラウンド対応。\n\nSteelSeriesの高性能ゲーミングヘッドセット。クリアな音質と快適な装着感で長時間のゲームプレイも快適です。\n\n【スペック】\n・7.1バーチャルサラウンドサウンド\n・ノイズキャンセリングマイク\n・40mm高磁力ネオジムドライバー\n・USB接続（PC/PS4/PS5対応）\n・イヤーパッド：低反発クッション\n\nFPS、MOBA、MMOなど、あらゆるゲームジャンルに最適。Discord、Skypeなどの通話にも。使用期間4ヶ月、動作良好です。',
    price: 9500,
    images: ['https://placehold.co/400x400/5b21b6/white?text=Headset'],
    category: 'electronics',
    status: 'active',
    sellerId: '2',
    sellerName: 'テックガジェット',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '26',
    title: 'アロマディフューザー 超音波式',
    description: '静音設計のアロマディフューザー。LEDライト付き。\n\n超音波式で静かに香りを拡散するアロマディフューザー。寝室やリビング、オフィスでの使用に最適です。\n\n【機能】\n・タンク容量：300ml（最大10時間連続使用）\n・タイマー機能：1時間/3時間/6時間/連続\n・7色LEDライト（固定・グラデーション切替可）\n・自動停止機能（水がなくなると自動停止）\n・静音設計（35dB以下）\n\nリラックス効果抜群。エッセンシャルオイル2本（ラベンダー、ユーカリ）付き。使用回数少なめ、美品です。',
    price: 3200,
    images: ['https://placehold.co/400x400/065f46/white?text=Diffuser'],
    category: 'home',
    status: 'active',
    sellerId: '3',
    sellerName: 'ホビーコレクター',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '27',
    title: 'ジグソーパズル 2000ピース',
    description: '美しい風景画のジグソーパズル。完成サイズ大型。\n\n2000ピースの大型ジグソーパズル。ヨーロッパの美しい街並みを描いた作品です。\n\n【詳細】\n・ピース数：2000ピース\n・完成サイズ：約73cm × 102cm\n・絵柄：ヨーロッパ風景\n・対象年齢：12歳以上\n\nじっくり取り組める大作パズル。完成後は額装してインテリアとしても楽しめます。全ピース揃っています、未開封品です。',
    price: 3800,
    images: ['https://placehold.co/400x400/be123c/white?text=Puzzle'],
    category: 'other',
    status: 'active',
    sellerId: '3',
    sellerName: 'ホビーコレクター',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '28',
    title: 'フィギュア ワンピース ルフィ',
    description: '人気アニメのフィギュア。限定版。\n\n「ワンピース」の主人公ルフィのフィギュア。躍動感あふれるポージングが魅力的な限定モデルです。\n\n【商品情報】\n・高さ：約25cm\n・素材：PVC、ABS\n・可動：一部可動\n・付属品：専用台座、交換用パーツ\n\n細部まで丁寧に造形されており、ファン必見のクオリティ。箱付き、未開封品。コレクションや飾り用に最適です。',
    price: 12000,
    images: ['https://placehold.co/400x400/dc2626/white?text=Figure'],
    category: 'other',
    status: 'active',
    sellerId: '3',
    sellerName: 'ホビーコレクター',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '29',
    title: '登山リュック 40L',
    description: '本格登山用リュック。日帰りから1泊登山まで。\n\n容量40Lの本格的な登山用リュックサック。日帰り登山から山小屋1泊の登山まで対応できるサイズです。\n\n【仕様】\n・容量：40L\n・重量：約1.2kg\n・背面長調整機能付き\n・レインカバー内蔵\n・ハイドレーション対応\n・ウエストベルト、チェストストラップ付き\n\n通気性の良い背面メッシュ、多数のポケットで小物の整理も簡単。使用回数3回、状態良好です。',
    price: 13500,
    images: ['https://placehold.co/400x400/166534/white?text=Backpack'],
    category: 'sports',
    status: 'active',
    sellerId: '4',
    sellerName: 'アウトドア愛好家',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
  {
    id: '30',
    title: 'ミラーレスカメラ Sony α6400',
    description: 'ソニーの人気ミラーレス一眼。高速AF、4K動画対応。\n\nSony α6400は、APS-Cセンサーを搭載したミラーレス一眼カメラ。静止画も動画も高品質に撮影できます。\n\n【スペック】\n・有効画素数：約2420万画素\n・高速AF：0.02秒\n・リアルタイム瞳AF（人物・動物対応）\n・4K動画撮影\n・180度チルト液晶（自撮り対応）\n・連写：最高11コマ/秒\n\nレンズキット（E 16-50mm F3.5-5.6）、予備バッテリー、SDカード64GB、カメラバッグ付き。使用期間1年、傷なし美品です。',
    price: 78000,
    images: ['https://placehold.co/400x400/1e40af/white?text=Camera'],
    category: 'electronics',
    status: 'active',
    sellerId: '4',
    sellerName: 'アウトドア愛好家',
    createdAt: new Date('2024-12-16').toISOString(),
    updatedAt: new Date('2024-12-16').toISOString(),
  },
];

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.minPrice !== undefined) params.append('min_price', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('max_price', filters.maxPrice.toString());
    if (filters.search) params.append('search', filters.search);
  }

  const queryString = params.toString();
  const endpoint = `/items${queryString ? `?${queryString}` : ''}`;

  return get<Item[]>(endpoint);
}

export async function getItem(id: string): Promise<Item> {
  return get<Item>(`/items/${id}`);
}

export async function createItem(data: ItemFormData): Promise<Item> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Get current user from localStorage (same logic as Header)
      let currentUser = null;
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            currentUser = JSON.parse(userStr);
          } catch (e) {
            console.error('Failed to parse user from localStorage', e);
          }
        }
      }

      // Ensure user is authenticated
      if (!currentUser) {
        reject(new Error('ユーザー情報が見つかりません。ログインしてください。'));
        return;
      }

      const newItem: Item = {
        ...data,
        id: Date.now().toString(),
        status: 'active',
        sellerId: currentUser.id, // Use current user's ID
        sellerName: currentUser.name, // Use current user's name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockItems = [newItem, ...mockItems];
      resolve(newItem);
    }, 800);
  });
}

export async function updateItem(id: string, data: Partial<ItemFormData>): Promise<Item> {
  return put<Item>(`/items/${id}`, data);
}

export async function deleteItem(id: string): Promise<void> {
  await del(`/items/${id}`);
}

export async function getUserItems(userId: string): Promise<Item[]> {
  return get<Item[]>(`/users/${userId}/items`);
}

export async function getRecommendedItems(itemId: string, category: ItemCategory, limit: number = 6): Promise<Item[]> {
  return get<Item[]>(`/items/${itemId}/recommended?limit=${limit}`);
}
