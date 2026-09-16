export type Track = {
  q: string;
  track: string;
  artist: string;
  art: string | null;
  preview: string; // iTunes 官方 30 秒试听（免费、无需 key）
};

/* ====== 我们的歌单 ======
   统一音源：iTunes 官方 30 秒试听（最稳定，无 VIP/版权差异）
================================================== */
export const PLAYLIST: Track[] = [
  {
    q: "Shape of You",
    track: "Shape of You",
    artist: "Ed Sheeran",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/c7/4f/44c74f0d-72dc-6143-d4d0-ba14d661ca0d/mzaf_9566898362556366703.plus.aac.p.m4a",
  },
  {
    q: "Waiting For Love",
    track: "Waiting For Love",
    artist: "Avicii",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/e0/f4/25/e0f425ba-2848-f1c2-e102-9ddcef5e9d9d/15UMGIM35223.rgb.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c0/69/ab/c069ab0f-1f89-8636-8579-2e5df6e62a68/mzaf_16059040705385155103.plus.aac.p.m4a",
  },
  {
    q: "绝对占有 相对自由",
    track: "绝对占有相对自由",
    artist: "陈粒 Chen Li",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e0/f2/69/e0f26937-29a2-9be0-f8d3-99dd7de0b78a/cover.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e3/e4/55/e3e455f1-5ffb-4528-d8c6-d08734a6d890/mzaf_6518842074573285508.plus.aac.p.m4a",
  },
  {
    q: "JANE DOE",
    track: "JANE DOE",
    artist: "米津玄師 × 宇多田ヒカル",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/73/91/aa/7391aabc-81d8-2bcb-3b0f-8e24bc855745/4547366775211.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/62/c4/e562c413-da81-e035-012b-4b66a15905f3/mzaf_11070624371709155420.plus.aac.p.m4a",
  },
  {
    q: "Tek It",
    track: "Tek It",
    artist: "Cafuné",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/66/00/2c/66002c66-9fc6-5a16-654f-8409873352d4/075679747020.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ac/25/c6/ac25c644-057b-1421-ff7c-bdd4a0114459/mzaf_9368654034340652874.plus.aac.p.m4a",
  },
  {
    q: "her",
    track: "her",
    artist: "JVKE",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9c/0c/88/9c0c883c-0901-60a1-8f4b-6a96c36be366/198846140360.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e3/20/68/e3206897-c043-0e44-0909-cf6bd75c17df/mzaf_9868200905441748258.plus.aac.p.m4a",
  },
  {
    q: "星月落",
    track: "星月落",
    artist: "浮生梦",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/03/d3/34/03d33493-7527-7085-5dac-b12a18622251/cover.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/aa/a8/36/aaa83647-b240-8e0f-1259-ef19b4b439c7/mzaf_5872458259145774343.plus.aac.p.m4a",
  },
  {
    q: "S.S.S.",
    track: "S.S.S.",
    artist: "CHIAKI SATO 佐藤千亜妃",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/12/af/40/12af40af-80da-a5c2-19f3-4e7ba0b8c4ca/ANTCD-A0000010307.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d0/8c/3a/d08c3a64-96aa-3d60-12cf-c6660c6b0517/mzaf_11387207701327317655.plus.aac.p.m4a",
  },
  {
    q: "Checklist",    track: "Checklist (feat. Wizkid)",
    artist: "Normani, Calvin Harris",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/e3/6a/7f/e36a7feb-468a-d7d0-4431-97bc75f6455e/886447381151.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/19/89/d11989ae-4d8a-c8e8-d3c2-57effb0752af/mzaf_10916456172898013212.plus.aac.p.m4a",
  },
  {
    q: "甲乙丙丁",
    track: "甲乙丙丁Strangers",
    artist: "李幸倪 Jess Lee",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b6/e6/a5/b6e6a5ec-a86c-aece-ca1f-ee5ca56b3caf/196874568842.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/06/52/99065271-bfaa-b1c1-dfe1-da1c194ba815/mzaf_13310490662920709314.plus.aac.p.m4a",
  },
  {
    q: "酔えない",
    track: "Yoenai (feat. Anonymouz)",
    artist: "MIMiNARI",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ee/ac/bc/eeacbc43-2e5c-072f-c31e-4361c41c757c/4547366688351.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2e/85/9d/2e859d0c-de5e-3412-5ef9-a366db153459/mzaf_2140803818409666980.plus.aac.p.m4a",
  },
  {
    q: "Sick Enough to Die",
    track: "Sick enough to die (feat. JAMIE)",
    artist: "MC MONG",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/13/91/8b/13918b85-918f-fae6-66f3-f45618c9ec1a/cover_KM0014529_1.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/d2/90/2a/d2902a73-6592-6b78-749b-bf4ac30e75ef/mzaf_15876311467084868877.plus.aac.p.m4a",
  },
  {
    q: "赐我",
    track: "赐我",
    artist: "yizhibaiyang 一次白羊",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/2f/31/64/2f316450-7f8a-eb7b-1c15-bae463143743/cover.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3a/9e/dd/3a9edddb-f341-4d7d-4d41-a229b343b8b3/mzaf_18393975290288195559.plus.aac.p.m4a",
  },
  {
    q: "我的秘密",
    track: "My Secret",
    artist: "G.E.M. 邓紫棋",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c2/7c/a2/c27ca2bf-bde8-2d1d-d509-abc7b11c5d26/196873159003.jpg/100x100bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/f6/f8/1ff6f8e1-9daf-01a2-05f8-edb1bd7a3cde/mzaf_14828755059168877035.plus.aac.p.m4a",
  },
];
