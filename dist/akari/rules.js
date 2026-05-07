(() => {
  const slug = location.pathname.split('/').filter(Boolean).pop() || (window.GAME_CONFIG && window.GAME_CONFIG.slug) || document.title.toLowerCase().replace(/\s+/g, '-');
  const title = (window.GAME_CONFIG && window.GAME_CONFIG.title) || (document.querySelector('h1') && document.querySelector('h1').textContent.trim()) || document.title || 'Game';
  const allRules = {
  "akari": [
    "盤面の白マスにライトを置き、すべての白マスを照らします。",
    "数字の黒マスは、上下左右に隣接するライトの数を表します。",
    "ライト同士が同じ行または列で照らし合ってはいけません。"
  ],
  "arrow-escape": [
    "矢印をタップして、向いている方向へ盤面の外まで抜きます。",
    "ほかの矢印や障害物にぶつかる矢印は抜けません。",
    "抜ける順番を考えて、すべての矢印を消すとクリアです。"
  ],
  "black-box": [
    "外周から光線を撃ち、見えない球の位置を推理します。",
    "光は球の近くで曲がり、正面に球があると戻ります。",
    "反応を手がかりに球の位置をすべて当てるとクリアです。"
  ],
  "block-grid": [
    "ブロックを盤面に置いて、行や列をそろえて消します。",
    "置ける場所がなくならないように、空きスペースを管理します。",
    "連続で消すほど高得点になります。"
  ],
  "box-push": [
    "箱を押して、指定されたゴール位置へ運びます。",
    "箱は押すことだけでき、引くことはできません。",
    "箱を壁際に詰ませないよう、手順を考えます。"
  ],
  "bridges": [
    "島同士を橋でつなぎ、各島の数字と同じ本数の橋を接続します。",
    "橋は縦横にだけ引け、ほかの橋と交差できません。",
    "すべての島がひとつながりになるとクリアです。"
  ],
  "bubble-pop": [
    "同じ色の泡を3つ以上つなげて消します。",
    "大きいグループほど得点が高くなります。",
    "盤面を詰まらせないように、消す順番を選びます。"
  ],
  "color-lane": [
    "自分の色を切り替えながら、同じ色の壁を通過します。",
    "違う色に当たると失敗です。",
    "タイミングよく操作してゴールを目指します。"
  ],
  "color-link": [
    "同じ色の点同士を線でつなぎます。",
    "線は交差できず、盤面のマスを無駄なく使う必要があります。",
    "すべての色を正しくつなぐとクリアです。"
  ],
  "count-gate": [
    "人数が増えるゲートを選んで進みます。",
    "壁や敵に人数を減らされるので、残数を管理します。",
    "最後まで必要人数を残せばクリアです。"
  ],
  "cube-roll": [
    "キューブを転がしてゴールへ運びます。",
    "転がる向きによって着地面が変わります。",
    "穴や壁を避け、正しい向きでゴールに立てます。"
  ],
  "dominosa": [
    "隣り合う数字2つをドミノとして選びます。",
    "同じ組み合わせのドミノは盤面全体で一度だけ使えます。",
    "すべてのマスを重ならずにペアにするとクリアです。"
  ],
  "draw-go": [
    "線を描いて、キャラクターや車輪が進む形を作ります。",
    "描いた形は物理的に動きます。",
    "障害物を越えてゴールへ届けばクリアです。"
  ],
  "draw-shield": [
    "線を描いて、中心や対象物を危険から守ります。",
    "描いた線は壁や盾として働きます。",
    "一定時間守りきるとクリアです。"
  ],
  "fruit-drop": [
    "同じ果物をぶつけて、ひとつ大きな果物に進化させます。",
    "落とす位置を決め、器からあふれないようにします。",
    "大きい果物を作るほど高得点です。"
  ],
  "hexa-sort": [
    "同じ色のヘックスを重ねて整理します。",
    "移動先の上にある色と合うものを選びます。",
    "色ごとの山を完成させるとクリアです。"
  ],
  "klotski": [
    "ブロックをスライドして、大きなブロックを出口へ運びます。",
    "ブロックは空いているマスにだけ移動できます。",
    "少ない手数で出口までの道を作ります。"
  ],
  "knot-untwist": [
    "上に重なっているリボンから順にほどきます。",
    "下に隠れている線は先に取れません。",
    "すべてのリボンを正しい順で外すとクリアです。"
  ],
  "laser-mirror": [
    "レーザーがゴールへ届くように鏡を回します。",
    "鏡は光を90度反射します。",
    "すべてのターゲットに光を通すとクリアです。"
  ],
  "make-equal": [
    "数字の間に演算子や等号を入れて、式を成立させます。",
    "左右の値が同じになる組み合わせを探します。",
    "すべての空欄を正しく埋めるとクリアです。"
  ],
  "masyu": [
    "丸のルールを守って、ひとつながりの輪を作ります。",
    "白丸は直進して、前後のどちらかで曲がります。",
    "黒丸はそのマスで曲がり、前後は直進します。"
  ],
  "merge-cells": [
    "同じ数字のセルを合わせて大きな数字を作ります。",
    "移動や合体の順番で盤面の空きが変わります。",
    "目標数字を作るか、高得点を目指します。"
  ],
  "minesweeper": [
    "地雷ではないマスをすべて開きます。",
    "数字は周囲8マスにある地雷の数です。",
    "地雷だと思う場所にはフラグを立て、推理して進めます。"
  ],
  "nonogram": [
    "行と列の数字を手がかりに、塗るマスを決めます。",
    "数字は連続して塗るマスの長さを表します。",
    "すべてのマスを正しく塗ると絵が完成します。"
  ],
  "number-grid": [
    "1から9の数字を、行・列・ブロックで重複しないように入れます。",
    "最初から入っている数字は固定です。",
    "すべての空欄を矛盾なく埋めるとクリアです。"
  ],
  "one-stroke": [
    "線を一筆書きでなぞります。",
    "同じ線は基本的に二度通れません。",
    "すべての線をつなぎきるとクリアです。"
  ],
  "parking-flow": [
    "車を前後に動かして出口への道を開けます。",
    "車は向いている方向にだけ動けます。",
    "目標の車を外へ出すとクリアです。"
  ],
  "pin-pull": [
    "ピンを正しい順番で抜きます。",
    "水や溶岩、宝などの落ち方を考えて操作します。",
    "危険を避けて目的物を届けるとクリアです。"
  ],
  "pipe-connect": [
    "パイプを回して入口から出口までつなげます。",
    "途切れや行き止まりがないように向きを調整します。",
    "流れが最後まで通ればクリアです。"
  ],
  "plate-drop": [
    "見えているネジを外して、重なった板を落とします。",
    "上の板に隠れているネジは、先に手前の板を外すまで触れません。",
    "同じ色のトレイにネジを収め、すべての板を外すとクリアです。"
  ],
  "rect-divide": [
    "数字が入ったマスを含む長方形で盤面を区切ります。",
    "各長方形の面積は、その中の数字と一致する必要があります。",
    "盤面をすべて矛盾なく分割するとクリアです。"
  ],
  "riddle-tap": [
    "画面の情報をよく見て、ひらめきで正しい操作を探します。",
    "タップ、ドラッグ、順番などが問題ごとに変わります。",
    "各ステージの条件を満たすとクリアです。"
  ],
  "rope-snip": [
    "ロープを切って、対象物をカップやゴールへ落とします。",
    "重力と振り子の動きを見て、切る順番を選びます。",
    "対象物がゴールに入るとクリアです。"
  ],
  "rubiks-cube": [
    "キューブの面を回して、各面を同じ色にそろえます。",
    "回転は層ごとに行います。",
    "全6面の色がそろうと完成です。"
  ],
  "samegame": [
    "同じ色でつながったブロックをまとめて消します。",
    "大きな塊ほど高得点になります。",
    "消す順番を考え、盤面をできるだけ空にします。"
  ],
  "screw-puzzle": [
    "同じ色のボルトをそろえるように移動します。",
    "ドラッグアンドドロップで空き場所や合う場所へ移します。",
    "すべての色を整理できればクリアです。"
  ],
  "shade-unique": [
    "数字の重複をなくすようにマスを塗ります。",
    "塗ったマス同士や残すマスのつながりに注意します。",
    "すべての条件を満たすとクリアです。"
  ],
  "shelf-fit": [
    "品物を棚の空きスペースに収めます。",
    "形や幅が合う位置を探します。",
    "すべての品物をはみ出さずに置くとクリアです。"
  ],
  "slice-it": [
    "必要なものだけをスワイプで切ります。",
    "切ってはいけないものに触れると失敗です。",
    "目標数を正確に切るとクリアです。"
  ],
  "slitherlink": [
    "点と点の間に線を引いて、ひとつながりの輪を作ります。",
    "数字は、その周囲4辺のうち線が引かれる本数です。",
    "枝分かれや複数の輪を作らず、条件を満たすとクリアです。"
  ],
  "solitaire": [
    "カードをスートごとにAからKまで組札へ積みます。",
    "場札は赤黒交互で数字が1つ小さいカードを重ねられます。",
    "裏向きカードを開きながら、すべてのカードを組札へ移すとクリアです。"
  ],
  "stack-runner": [
    "ブロックを集めて足場を作り、壁や段差を越えます。",
    "使いすぎると足りなくなるので、進むルートを選びます。",
    "ゴールまで到達するとクリアです。"
  ],
  "tap-away": [
    "ブロックを矢印の方向へ抜いて消します。",
    "前に別のブロックがあると抜けません。",
    "抜ける順番を考えて、すべて消すとクリアです。"
  ],
  "tents": [
    "各木の隣にテントを1つ置きます。",
    "テント同士は縦横斜めに接してはいけません。",
    "行と列の数字と一致するように配置します。"
  ],
  "tile-pair": [
    "同じ絵柄の自由な牌を2つ選んで消します。",
    "左右がふさがっている牌は選べません。",
    "すべての牌をペアで消すとクリアです。"
  ],
  "tilt-maze": [
    "盤面を傾けて球を転がし、ゴールへ運びます。",
    "球は壁や穴に当たるまで進みます。",
    "障害物を避けながらゴールに入れるとクリアです。"
  ],
  "toggle-all": [
    "マスを押すと、そのマスと周囲の状態が切り替わります。",
    "点灯しているマスをすべて消灯させます。",
    "押す順番を考えて最短手数を目指します。"
  ],
  "traffic-exit": [
    "車を前後にスライドして出口を開けます。",
    "車は向きに沿った方向にだけ動けます。",
    "指定された車を出口から出すとクリアです。"
  ],
  "triple-tray": [
    "同じ種類のタイルを3つそろえてトレイから消します。",
    "トレイがいっぱいになる前に組み合わせを作ります。",
    "盤面のタイルをすべて消すとクリアです。"
  ],
  "untangle": [
    "線が交差しないように点を動かします。",
    "点の位置をドラッグして、辺同士の交差をほどきます。",
    "すべての交差がなくなるとクリアです。"
  ],
  "water-sort": [
    "同じ色の液体がまとまるように注ぎ替えます。",
    "注げるのは同じ色の上か空の容器だけです。",
    "すべての容器が単色になるとクリアです。"
  ],
  "word-connect": [
    "文字をつないで単語を作ります。",
    "指定された単語や枠をすべて埋めます。",
    "余った文字もヒントになることがあります。"
  ],
  "shape-pack": [
    "ピースを選び、影の形にぴったり収まるように配置します。",
    "回転や反転を使って、はみ出しや重なりがない位置を探します。",
    "すべてのピースをシルエット内に置くとクリアです。"
  ],
  "word-guess": [
    "5文字の秘密語を少ない回数で当てます。",
    "色のヒントで、文字と位置が合っているか判断します。",
    "候補を絞り込んで正解を入力します。"
  ]
};
  const fallback = [
    'ゲーム画面の操作対象をクリックまたはドラッグして進めます。',
    '手数や状態表示を見ながら、クリア条件を満たしてください。',
    'Resetで最初からやり直せます。'
  ];
  const lines = allRules[slug] || fallback;
  function style() {
    if (document.querySelector('#rules-style')) return;
    const css = document.createElement('style');
    css.id = 'rules-style';
    css.textContent = '.rules-open{position:fixed;right:clamp(10px,2vw,18px);bottom:clamp(10px,2vw,18px);z-index:1000;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid rgba(255,255,255,.24);background:rgba(18,24,34,.92);color:#f7fbff;font-weight:900;box-shadow:0 12px 32px rgba(0,0,0,.34);backdrop-filter:blur(10px)}.rules-open:focus-visible,.rules-close:focus-visible{outline:3px solid #65e4c8;outline-offset:3px}.rules-backdrop{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:18px;background:rgba(3,7,12,.62)}.rules-modal{width:min(520px,100%);border:1px solid rgba(255,255,255,.2);border-radius:10px;background:#151d28;color:#f7fbff;box-shadow:0 24px 80px rgba(0,0,0,.55);padding:18px}.rules-modal h2{margin:0 0 12px;font-size:1.35rem}.rules-modal ol{margin:0 0 16px;padding-left:1.35rem;line-height:1.65}.rules-modal li{margin:.25rem 0}.rules-close{width:100%;min-height:44px;border-radius:8px;border:1px solid rgba(255,255,255,.22);background:#253142;color:#f7fbff;font-weight:900}@media(max-width:640px){.rules-open{right:10px;bottom:10px;min-height:42px;padding:0 14px}.rules-modal{padding:16px}.rules-modal h2{font-size:1.2rem}}';
    document.head.append(css);
  }
  function openRules() {
    style();
    const backdrop = document.createElement('div');
    backdrop.className = 'rules-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.innerHTML = '<section class="rules-modal"><h2></h2><ol></ol><button type="button" class="rules-close">閉じる</button></section>';
    backdrop.querySelector('h2').textContent = title + ' のルール';
    const list = backdrop.querySelector('ol');
    lines.forEach((line) => { const li = document.createElement('li'); li.textContent = line; list.append(li); });
    const close = () => backdrop.remove();
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
    backdrop.querySelector('.rules-close').addEventListener('click', close);
    document.addEventListener('keydown', function onKey(event) { if (event.key === 'Escape' && backdrop.isConnected) { close(); document.removeEventListener('keydown', onKey); } });
    document.body.append(backdrop);
    backdrop.querySelector('.rules-close').focus();
  }
  function attachToHost() {
    const host = document.querySelector('[data-rules], #hint');
    if (!host) return false;
    host.setAttribute('aria-label', 'ルール説明を開く');
    host.setAttribute('title', 'ルール');
    host.addEventListener('click', openRules);
    return true;
  }
  function ensureButton() {
    style();
    if (attachToHost()) return;
    if (document.querySelector('.rules-open')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rules-open';
    btn.textContent = 'Rules';
    btn.setAttribute('aria-label', 'ルール説明を開く');
    btn.addEventListener('click', openRules);
    document.body.append(btn);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureButton);
  else ensureButton();
})();
