const ARTICLE_TEXT = `The Ocean's Hidden Symphony

Scientists have long known that the ocean communicates, yet the true depth of its voice remained one of nature's most remarkable secrets. Researchers at the Pacific Institute recently discovered a network of acoustic channels that carry whale song across entire ocean basins. The joy among the scientific community was palpable — decades of desperate searching had finally yielded something extraordinary.

However, understanding these channels proved far more difficult than finding them. Because sound travels differently through layers of varying temperature and salinity, the signals often arrived warped and fragmented. Nevertheless, the team developed new filtering algorithms that revealed the beautiful complexity hidden within the noise. Moreover, they found that certain species had evolved to exploit these pathways over millions of years, a discovery that left even veteran researchers feeling delighted and astonished.

The emotional weight of the findings was not lost on the public. Many people feel a deep love for the ocean, yet few had imagined it harboring such an invisible architecture of communication. Whereas previous studies focused on local whale populations, this research demonstrated a global network — one that human activity has increasingly disrupted. The news was both wonderful and devastating: a system of astonishing sophistication, now under threat.

Despite the grim implications, the scientists remained hopeful and cheerful in their press conference. "We are not helpless," said lead researcher Amara Osei. Therefore, the institute announced a new monitoring program to track acoustic pollution in real time. Meanwhile, several governments expressed cautious interest in the findings, though some officials were initially dismissive and skeptical of the projected timelines. The researchers, grateful for any support, pressed forward.

Furthermore, the discovery opens remarkable questions about consciousness and connection across vast distances. A blue whale, singing in the Indian Ocean, may be heard by another near Iceland — a kind of profound, peaceful conversation spanning hemispheres. Consequently, scientists are reconsidering what it means for an animal to be "alone" in the sea. The ocean, it turns out, is anything but silent; it is a chorus, ancient and brilliant, that we are only beginning to understand.`;

const LOGIC_WORDS = new Set([
  'however', 'therefore', 'but', 'although', 'because', 'thus', 'hence',
  'moreover', 'furthermore', 'nevertheless', 'consequently', 'meanwhile',
  'despite', 'yet', 'since', 'whereas', 'while'
]);

const EMOTION_WORDS = {
  positive: new Set([
    'joy', 'joyful', 'happy', 'happiness', 'love', 'wonderful', 'beautiful',
    'hope', 'hopeful', 'grateful', 'excited', 'delighted', 'cheerful', 'proud',
    'peaceful', 'amazing', 'brilliant', 'palpable'
  ]),
  negative: new Set([
    'sad', 'terrible', 'awful', 'worried', 'desperate', 'fear', 'angry',
    'devastating', 'tragic', 'horrified', 'dismissive', 'exhausting',
    'skeptical', 'grim', 'fragmented', 'warped'
  ]),
  surprise: new Set([
    'remarkable', 'astonishing', 'astonished', 'extraordinary', 'incredible',
    'profound', 'surprising', 'surprised'
  ])
};

const state = {
  boldBeginning: false,
  emotionColor:  false,
  gradientRows:  false,
  logicAnimation: false,
  fontSize:   18,
  fontFamily: 'Georgia',
  lineHeight: 1.8,
  fontColor:  '#2c2c2c',
  bgColor:    '#ffffff'
};

let logicWordCounter = 0;

function cleanWord(raw) {
  return raw.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '').toLowerCase();
}

function getEmotionClass(word) {
  if (EMOTION_WORDS.positive.has(word)) return 'emotion-positive';
  if (EMOTION_WORDS.negative.has(word)) return 'emotion-negative';
  if (EMOTION_WORDS.surprise.has(word)) return 'emotion-surprise';
  return null;
}

function processWord(rawToken, isFirst) {
  const clean = cleanWord(rawToken);
  if (!clean) return rawToken;

  const leading  = rawToken.match(/^[^a-zA-Z]*/)[0];
  const trailing = rawToken.match(/[^a-zA-Z]*$/)[0];
  const end      = rawToken.length - trailing.length;
  const body     = rawToken.slice(leading.length, end);

  let innerHtml = body;

  if (state.boldBeginning && isFirst) {
    const N = Math.min(3, Math.ceil(body.length / 2));
    innerHtml = `<b>${body.slice(0, N)}</b>${body.slice(N)}`;
  }

  if (state.logicAnimation && LOGIC_WORDS.has(clean)) {
    const delay = (logicWordCounter * 0.4).toFixed(1);
    logicWordCounter++;
    return `${leading}<span class="logic-word" style="animation-delay:${delay}s">${innerHtml}</span>${trailing}`;
  }

  if (state.emotionColor) {
    const cls = getEmotionClass(clean);
    if (cls) {
      return `${leading}<span class="${cls}">${innerHtml}</span>${trailing}`;
    }
  }

  return `${leading}${innerHtml}${trailing}`;
}

function renderSentenceWords(sentence) {
  const tokens = sentence.split(/(\s+)/);
  let wordCount = 0;
  let html = '';

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      html += token;
    } else {
      html += processWord(token, wordCount === 0);
      if (cleanWord(token)) wordCount++;
    }
  }
  return html;
}

function renderParagraph(paraText) {
  const sentences = paraText.trim().split(/(?<=[.!?])\s+(?=[A-Z"'])/);

  if (state.gradientRows) {
    const rows = sentences.map((s, i) => {
      const cls = i % 2 === 0 ? 'row-even' : 'row-odd';
      return `<div class="${cls}">${renderSentenceWords(s)}</div>`;
    }).join('');
    return `<div class="article-para">${rows}</div>`;
  }

  const content = sentences.map(s => renderSentenceWords(s)).join(' ');
  return `<p class="article-para">${content}</p>`;
}

function render() {
  logicWordCounter = 0;

  const article = document.getElementById('article');
  article.style.fontFamily = state.fontFamily;
  article.style.fontSize   = state.fontSize + 'px';
  article.style.lineHeight = state.lineHeight;
  article.style.color      = state.fontColor;
  document.querySelector('.content-area').style.background = state.bgColor;

  const paragraphs = ARTICLE_TEXT.trim().split(/\n\n+/);
  let html = '';

  paragraphs.forEach((para, i) => {
    if (i === 0) {
      html += `<h1 class="article-title">${para.trim()}</h1>`;
    } else {
      html += renderParagraph(para.trim());
    }
  });

  article.innerHTML = html;
}

function updateStepperDisplay() {
  document.getElementById('font-size-value').textContent  = state.fontSize + 'px';
  document.getElementById('line-height-value').textContent = state.lineHeight.toFixed(1);
}

function init() {
  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.remove('active');
  });

  document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.add('active');
  });

  document.getElementById('toggle-bold').addEventListener('change', e => {
    state.boldBeginning = e.target.checked;
    render();
  });

  document.getElementById('toggle-emotion').addEventListener('change', e => {
    state.emotionColor = e.target.checked;
    render();
  });

  document.getElementById('toggle-gradient').addEventListener('change', e => {
    state.gradientRows = e.target.checked;
    render();
  });

  document.getElementById('toggle-logic').addEventListener('change', e => {
    state.logicAnimation = e.target.checked;
    render();
  });

  document.getElementById('font-family').addEventListener('change', e => {
    state.fontFamily = e.target.value;
    render();
  });

  document.getElementById('font-size-inc').addEventListener('click', () => {
    if (state.fontSize < 28) {
      state.fontSize += 1;
      updateStepperDisplay();
      render();
    }
  });

  document.getElementById('font-size-dec').addEventListener('click', () => {
    if (state.fontSize > 14) {
      state.fontSize -= 1;
      updateStepperDisplay();
      render();
    }
  });

  document.getElementById('line-height-inc').addEventListener('click', () => {
    if (state.lineHeight < 2.4) {
      state.lineHeight = Math.round((state.lineHeight + 0.1) * 10) / 10;
      updateStepperDisplay();
      render();
    }
  });

  document.getElementById('line-height-dec').addEventListener('click', () => {
    if (state.lineHeight > 1.4) {
      state.lineHeight = Math.round((state.lineHeight - 0.1) * 10) / 10;
      updateStepperDisplay();
      render();
    }
  });

  document.getElementById('font-color').addEventListener('input', e => {
    state.fontColor = e.target.value;
    render();
  });

  document.getElementById('bg-color').addEventListener('input', e => {
    state.bgColor = e.target.value;
    render();
  });

  render();
}

document.addEventListener('DOMContentLoaded', init);
